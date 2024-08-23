import { AuthClient, LocalStorage } from "@dfinity/auth-client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toJwt } from 'azle/http_client';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

const reduceImageSize = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
            img.src = reader.result as string;
        };

        img.onload = () => {
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        fileToBase64(new File([blob], file.name, { type: file.type }))
                            .then(resolve)
                            .catch(reject);
                    } else {
                        reject(new Error('Failed to create blob from canvas'));
                    }
                }, file.type);
            } else {
                reject(new Error('Failed to get canvas context'));
            }
        };

        img.onerror = (error) => reject(error);
    });
};

function RegisterPhase1({ phaseChanger }: { phaseChanger: (phase: number) => void }) {
    const navigate = useNavigate();
    const [identity, setIdentity] = useState<any | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const authClient = await AuthClient.create({
                    storage: new LocalStorage(),
                    keyType: 'Ed25519',
                });

                if (!(await authClient.isAuthenticated())) {
                    navigate('/login');
                    return; // Exit early if not authenticated
                }

                const identity = authClient.getIdentity();
                setIdentity(identity);
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        checkSession();
    }, [navigate]);

    const [governmentId, setGovernmentId] = useState<File | null>(null);
    const [photo1, setPhoto1] = useState<File | null>(null);
    const [photo2, setPhoto2] = useState<File | null>(null);
    const [photo3, setPhoto3] = useState<File | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const getBase64Files = async () => {
            return {
                governmentId: governmentId ?  await reduceImageSize(governmentId, 200, 100) : null,
                photo1: photo1 ?  await reduceImageSize(photo1, 200, 100) : null,
                photo2: photo2 ? await reduceImageSize(photo2, 200, 100) : null,
                photo3: photo3 ? await reduceImageSize(photo3, 200, 100) : null,
            };
        };

        try {
            const base64Files = await getBase64Files();

            const kycData = {
                governmentId: base64Files.governmentId,
                photo1: base64Files.photo1,
                photo2: base64Files.photo2,
                photo3: base64Files.photo3,
            };

            if (!identity) {
                throw new Error('No identity available');
            }

            const response = await fetch(`${import.meta.env.VITE_CANISTER_URL}/register-phase-1`, {
                method: 'POST',
                headers: {
                    "Authorization": toJwt(identity),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(kycData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit KYC form');
            }

            const result = await response.json();
            phaseChanger(1);
            console.log('KYC data submitted successfully:', result);
        } catch (error) {
            console.error('Error submitting KYC form:', error);
        }
    };

    return (
        <main className="container mt-5">
            <h1 className="text-center">Update Account - PHASE 1</h1>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="mt-4">
                <div className="mb-3">
                    <label className="form-label">Government ID</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        onChange={(e) => setGovernmentId(e.target.files ? e.target.files[0] : null)} 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Face Picture With Government ID</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        onChange={(e) => setPhoto1(e.target.files ? e.target.files[0] : null)} 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Face Picture #1</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        onChange={(e) => setPhoto2(e.target.files ? e.target.files[0] : null)} 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Face Picture #2</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        onChange={(e) => setPhoto3(e.target.files ? e.target.files[0] : null)} 
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">Submit KYC</button>
            </form>
        </main>
    );
}

export default RegisterPhase1;
