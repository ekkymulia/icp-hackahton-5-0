import { AuthClient, LocalStorage } from "@dfinity/auth-client";
import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toJwt } from 'azle/http_client';

interface ProfileData {
    data: {
        fullName: string;
        email: string;
        phoneNumber: string;
        nationality: string;
        integratedApp: { appName: string }[];
    }
}

function Profile() {
    const navigate = useNavigate();
    const [identity, setIdentity] = useState<any | null>(null);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appName, setAppName] = useState<string | null>(null);
    const [pushNotif, setPushNotif] = useState<string | null>(null);

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

                // Fetch Profile Data
                const response = await fetch(
                    `${import.meta.env.VITE_CANISTER_URL}/my-profile`,
                    {
                        method: 'GET',
                        headers: [['Authorization', toJwt(identity)]],
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }

                const responseData: ProfileData = await response.json();
                setProfileData(responseData);
            } catch (error: any) {
                setError(error.message || "An error occurred");
                console.error("Error checking session or fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, [navigate]);

    const handleSubmitNewApp = async () => {
        if (!appName || !pushNotif) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_CANISTER_URL}/create-app`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': toJwt(identity),
                },
                body: JSON.stringify({
                    appName: appName,
                    postNotificationEndpoint: pushNotif,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create app');
            }

            // Handle success (e.g., show a success message, reset form)
            alert('App successfully created');
            setAppName(null);
            setPushNotif(null);
        } catch (error: any) {
            setError(error.message || "An error occurred while creating the app");
            console.error("Error creating app:", error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-danger">Error: {error}</p>;
    }

    return (
        <main className="container mt-4">
            <h1 className="mb-4">My Profile</h1>
            <NavLink to="/register" className="btn btn-primary mb-4">Edit Profile</NavLink>

            {profileData && (
                <>
                    <div className="mb-4">
                        <h4>Name: {profileData.data.fullName}</h4>
                        <h4>Email: {profileData.data.email}</h4>
                        <h4>Phone Number: {profileData.data.phoneNumber}</h4>
                        <h4>Nationality: {profileData.data.nationality}</h4>
                    </div>

                    <div className="mb-4">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Integrated App with Account</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profileData.data.integratedApp && Array.isArray(profileData.data.integratedApp) ? (
                                    profileData.data.integratedApp.map((app, index) => (
                                        <tr key={index}>
                                            <td>{app.appName}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td>No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            <div className="mb-4">
                <div className="form-group">
                    <label htmlFor="appName">App Name</label>
                    <input 
                        type="text" 
                        id="appName" 
                        className="form-control" 
                        placeholder="App Name" 
                        value={appName || ''} 
                        onChange={(e) => setAppName(e.target.value)} 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="pushNotif">Push Notifications</label>
                    <input 
                        type="text" 
                        id="pushNotif" 
                        className="form-control" 
                        placeholder="Push Notifications" 
                        value={pushNotif || ''} 
                        onChange={(e) => setPushNotif(e.target.value)} 
                    />
                </div>

                <button 
                    className="btn btn-primary" 
                    onClick={handleSubmitNewApp}
                >
                    Add New App
                </button>
            </div>
        </main>
    );
}

export default Profile;
