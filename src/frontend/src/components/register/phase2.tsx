import { AuthClient, LocalStorage } from "@dfinity/auth-client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toJwt } from 'azle/http_client';

function RegisterPhase2({ phaseChanger }: { phaseChanger: (phase: number) => void }) {
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
                    return;
                }

                const identity = authClient.getIdentity();
                setIdentity(identity);

            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        checkSession();
    }, [navigate]);

    // Personal Information
    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [nationality, setNationality] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    // Financial Information
    const [sourceOfFunds, setSourceOfFunds] = useState('');
    const [bankAccountInfo, setBankAccountInfo] = useState('');
    const [taxIdentificationNumber, setTaxIdentificationNumber] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const kycData = {
                fullName,
                dateOfBirth,
                nationality,
                gender,
                address,
                phoneNumber,
                email,
                sourceOfFunds,
                bankAccountInfo,
                taxIdentificationNumber,
            };

            // Log the JWT Token
            const jwtToken = toJwt(identity);
            console.log('JWT Token:', jwtToken);

            const response = await fetch(`${import.meta.env.VITE_CANISTER_URL}/register-phase-2`, {
                method: 'POST',
                headers: {
                    "Authorization": toJwt(identity),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(kycData),
            });

            // Log the full response
            console.log('Response Status:', response.status);
            const responseBody = await response.text();
            console.log('Response Body:', responseBody);

            if (!response.ok) {
                throw new Error('Failed to submit KYC form');
            }

            const result = JSON.parse(responseBody);
            phaseChanger(2);
            console.log('KYC data submitted successfully:', result);
        } catch (error) {
            console.error('Error submitting KYC form:', error);
        }
    };

    return (
        <main className="container mt-5">
            <h1 className="text-center">Update Account - Register Phase 2</h1>

            <form onSubmit={handleSubmit} className="mt-4">
                {/* Personal Information */}
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Full Name" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input 
                        type="date" 
                        className="form-control" 
                        placeholder="Date of Birth" 
                        value={dateOfBirth} 
                        onChange={(e) => setDateOfBirth(e.target.value)} 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Nationality</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Nationality" 
                        value={nationality} 
                        onChange={(e) => setNationality(e.target.value)} 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Gender" 
                        value={gender} 
                        onChange={(e) => setGender(e.target.value)} 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Residential Address</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Residential Address" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input 
                        type="tel" 
                        className="form-control" 
                        placeholder="Phone Number" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Email Address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>

                {/* Financial Information */}
                <div className="mb-3">
                    <label className="form-label">Source of Funds</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Source of Funds" 
                        value={sourceOfFunds} 
                        onChange={(e) => setSourceOfFunds(e.target.value)} 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Bank Account Info</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Bank Account Info" 
                        value={bankAccountInfo} 
                        onChange={(e) => setBankAccountInfo(e.target.value)} 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Tax Identification Number</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Tax Identification Number" 
                        value={taxIdentificationNumber} 
                        onChange={(e) => setTaxIdentificationNumber(e.target.value)} 
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">Submit KYC</button>
            </form>
        </main>
    );
}

export default RegisterPhase2;
