import React, { useState, useEffect } from 'react';
import { AuthClient, LocalStorage } from "@dfinity/auth-client";
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

async function postCapturedImage(identity: any, imageData: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_CANISTER_URL}/face-verification`, {
            method: 'POST',
            headers: {
                'Authorization': toJwt(identity),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ facePhoto: imageData })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
        }

        const responseData = await response.json();
        console.log("Image posted successfully:", responseData);
    } catch (error) {
        console.error("Failed to post image:", error);
    }
}

function IntegrationApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [identity, setIdentity] = useState<any | null>(null);
    const [whoami, setWhoami] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const authClient = await AuthClient.create({
                    storage: new LocalStorage(),
                    keyType: 'Ed25519',
                });

                if (await authClient.isAuthenticated()) {
                    const identity = await authClient.getIdentity();
                    setIdentity(identity);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        checkSession();
    }, []);

    const handleLogin = async () => {
        try {
            const authClient = await AuthClient.create({
                storage: new LocalStorage(),
                keyType: 'Ed25519',
            });

            await authClient.login({
                identityProvider: `https://identity.internetcomputer.org/`,
                onSuccess: async () => {
                    const identity = await authClient.getIdentity();
                    setIdentity(identity);
                    setIsAuthenticated(true);
                },
                onError: (error) => {
                    console.error("Login failed:", error);
                },
            });
        } catch (error) {
            console.error("Unexpected error during login:", error);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setFile(file);

            try {
                const maxWidth = 800;
                const maxHeight = 800;
                const base64Image = await reduceImageSize(file, maxWidth, maxHeight);
                
                const imageSize = (base64Image.length * (3 / 4)) / 1024; // Approximate size in KB
                console.log(`Image size: ${imageSize} KB`);

                if (imageSize <= 60) {
                    setCapturedImage(base64Image);
                    if (identity) {
                        await postCapturedImage(identity, base64Image);
                    }
                } else {
                    console.error("Image size exceeds 60KB limit");
                }
            } catch (error) {
                console.error("Error processing image:", error);
            }
        }
    };

    const whoamiUnauthenticated = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_CANISTER_URL}/whoami`);
            const responseText = await response.text();
            console.log(responseText);
            setWhoami(responseText);
        } catch (error) {
            console.error("Failed to fetch unauthenticated Whoami:", error);
        }
    };

    const whoamiAuthenticated = async () => {
        try {
            if (identity) {
                const response = await fetch(`${import.meta.env.VITE_CANISTER_URL}/whoami`, {
                    method: 'POST',
                    headers: { 'Authorization': toJwt(identity) }
                });
                const responseText = await response.text();
                console.log(responseText);
                setWhoami(responseText);
            }
        } catch (error) {
            console.error("Failed to fetch authenticated Whoami:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Internet Identity (This is a demo of an Iframe that would be embeded on other app)</h1>

            <div className="mb-3">
                <h2>Whoami principal:</h2>
                <p id="whoamiPrincipal">{whoami}</p>
            </div>

            <button className="btn btn-primary mb-3" onClick={handleLogin}>Login</button>

            <button
                className="btn btn-secondary mb-3"
                id="whoamiAuthenticated"
                onClick={whoamiAuthenticated}
                disabled={!isAuthenticated}
            >
                Check Session
            </button>

            <div className="mb-3">
                <input
                    type="file"
                    accept="image/*"
                    className="form-control-file"
                    onChange={handleFileChange}
                />
            </div>

            {capturedImage && (
                <div>
                    <h3>Captured Image:</h3>
                    <img src={capturedImage} alt="Captured" className="img-fluid" />
                </div>
            )}
        </div>
    );
}

export default IntegrationApp;
