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

function FormsPage() {
    const navigate = useNavigate();
    const [identity, setIdentity] = useState<any | null>(null)

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

    // Personal Information
    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [nationality, setNationality] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    // Identity Verification
    const [governmentId, setGovernmentId] = useState<File | null>(null);
    const [photo, setPhoto] = useState<File | null>(null);

    // Address Verification
    const [utilityBill, setUtilityBill] = useState<File | null>(null);
    const [bankStatement, setBankStatement] = useState<File | null>(null);
    const [rentalAgreement, setRentalAgreement] = useState<File | null>(null);

    // Financial Information
    const [sourceOfFunds, setSourceOfFunds] = useState('');
    const [bankAccountInfo, setBankAccountInfo] = useState('');
    const [taxIdentificationNumber, setTaxIdentificationNumber] = useState('');

    // Business Information (for Corporate KYC)
    const [companyName, setCompanyName] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [certificateOfIncorporation, setCertificateOfIncorporation] = useState<File | null>(null);
    const [memorandum, setMemorandum] = useState<File | null>(null);
    const [boardResolution, setBoardResolution] = useState<File | null>(null);
    const [directorsList, setDirectorsList] = useState<string>('');
    const [businessLicense, setBusinessLicense] = useState<File | null>(null);
    const [financialStatements, setFinancialStatements] = useState<File | null>(null);

    // Risk Assessment Data
    const [occupation, setOccupation] = useState('');
    const [expectedActivity, setExpectedActivity] = useState('');
    const [pepStatus, setPepStatus] = useState(false);

    // Handler function example
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        // Convert files to base64
        const getBase64Files = async () => {
            return {
                governmentId: governmentId ? await fileToBase64(governmentId) : null,
                photo: photo ? await fileToBase64(photo) : null,
                utilityBill: utilityBill ? await fileToBase64(utilityBill) : null,
                bankStatement: bankStatement ? await fileToBase64(bankStatement) : null,
                rentalAgreement: rentalAgreement ? await fileToBase64(rentalAgreement) : null,
                certificateOfIncorporation: certificateOfIncorporation ? await fileToBase64(certificateOfIncorporation) : null,
                memorandum: memorandum ? await fileToBase64(memorandum) : null,
                boardResolution: boardResolution ? await fileToBase64(boardResolution) : null,
                businessLicense: businessLicense ? await fileToBase64(businessLicense) : null,
                financialStatements: financialStatements ? await fileToBase64(financialStatements) : null,
            };
        };
    
        try {
            const base64Files = await getBase64Files();
    
            const kycData = {
                fullName,
                dateOfBirth,
                nationality,
                gender,
                address,
                phoneNumber,
                email,
                governmentId: base64Files.governmentId,
                photo: base64Files.photo,
                utilityBill: base64Files.utilityBill,
                bankStatement: base64Files.bankStatement,
                rentalAgreement: base64Files.rentalAgreement,
                sourceOfFunds,
                bankAccountInfo,
                taxIdentificationNumber,
                companyName,
                registrationNumber,
                certificateOfIncorporation: base64Files.certificateOfIncorporation,
                memorandum: base64Files.memorandum,
                boardResolution: base64Files.boardResolution,
                directorsList,
                businessLicense: base64Files.businessLicense,
                financialStatements: base64Files.financialStatements,
                occupation,
                expectedActivity,
                pepStatus
            };
    
            // Example API request to submit the form data as JSON
            const response = await fetch(`${import.meta.env.VITE_CANISTER_URL}/post-kyc-data`, {
                method: 'POST',
                headers: [['Authorization', toJwt(identity)]],
                body: JSON.stringify(kycData),
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit KYC form');
            }
    
            const result = await response.json();
            console.log('KYC data submitted successfully:', result);
        } catch (error) {
            console.error('Error submitting KYC form:', error);
        }
    };
    

    return (
        <main>
            <h1>Forms Page</h1>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Personal Information */}
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                />
                <input 
                    type="date" 
                    placeholder="Date of Birth" 
                    value={dateOfBirth} 
                    onChange={(e) => setDateOfBirth(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Nationality" 
                    value={nationality} 
                    onChange={(e) => setNationality(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Gender" 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Residential Address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                />
                <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                />
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />

                {/* Identity Verification */}
                <input 
                    type="file" 
                    placeholder="Government ID" 
                    onChange={(e) => setGovernmentId(e.target.files ? e.target.files[0] : null)} 
                />
                <input 
                    type="file" 
                    placeholder="Photo" 
                    onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)} 
                />

                {/* Address Verification */}
                {/* <input 
                    type="file" 
                    placeholder="Utility Bill" 
                    onChange={(e) => setUtilityBill(e.target.files ? e.target.files[0] : null)} 
                />
                <input 
                    type="file" 
                    placeholder="Bank Statement" 
                    onChange={(e) => setBankStatement(e.target.files ? e.target.files[0] : null)} 
                />
                <input 
                    type="file" 
                    placeholder="Rental Agreement" 
                    onChange={(e) => setRentalAgreement(e.target.files ? e.target.files[0] : null)} 
                /> */}

                {/* Financial Information */}
                <input 
                    type="text" 
                    placeholder="Source of Funds" 
                    value={sourceOfFunds} 
                    onChange={(e) => setSourceOfFunds(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Bank Account Info" 
                    value={bankAccountInfo} 
                    onChange={(e) => setBankAccountInfo(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Tax Identification Number" 
                    value={taxIdentificationNumber} 
                    onChange={(e) => setTaxIdentificationNumber(e.target.value)} 
                />

                {/* Business Information */}
                {/* <input 
                    type="text" 
                    placeholder="Company Name" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Registration Number" 
                    value={registrationNumber} 
                    onChange={(e) => setRegistrationNumber(e.target.value)} 
                />
                <input 
                    type="file" 
                    placeholder="Certificate of Incorporation" 
                    onChange={(e) => setCertificateOfIncorporation(e.target.files ? e.target.files[0] : null)} 
                />
                <input 
                    type="file" 
                    placeholder="Memorandum" 
                    onChange={(e) => setMemorandum(e.target.files ? e.target.files[0] : null)} 
                />
                <input 
                    type="file" 
                    placeholder="Board Resolution" 
                    onChange={(e) => setBoardResolution(e.target.files ? e.target.files[0] : null)} 
                />
                <input 
                    type="text" 
                    placeholder="List of Directors" 
                    value={directorsList} 
                    onChange={(e) => setDirectorsList(e.target.value)} 
                />
                <input 
                    type="file" 
                    placeholder="Business License" 
                    onChange={(e) => setBusinessLicense(e.target.files ? e.target.files[0] : null)} 
                />
                <input 
                    type="file" 
                    placeholder="Financial Statements" 
                    onChange={(e) => setFinancialStatements(e.target.files ? e.target.files[0] : null)} 
                /> */}

                {/* Risk Assessment Data */}
                {/* <input 
                    type="text" 
                    placeholder="Occupation/Profession" 
                    value={occupation} 
                    onChange={(e) => setOccupation(e.target.value)} 
                />
                <textarea 
                    placeholder="Expected Account Activity" 
                    value={expectedActivity} 
                    onChange={(e) => setExpectedActivity(e.target.value)} 
                />
                <label>
                    Politically Exposed Person (PEP) Status:
                    <input 
                    type="checkbox" 
                    checked={pepStatus} 
                    onChange={(e) => setPepStatus(e.target.checked)} 
                    />
                </label> */}

                <button type="submit">Submit KYC</button>
                </form>
        </main>
    );
}

export default FormsPage;
