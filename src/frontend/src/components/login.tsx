import React, { useState, useEffect } from 'react';
import { AuthClient, LocalStorage } from "@dfinity/auth-client";
import { toJwt } from 'azle/http_client';  

async function handleAuthenticated(authClient: any, setIsAuthenticated: any, setIdentity: any) {
    try {
        const identity = await authClient.getIdentity();
        setIdentity(identity);
        setIsAuthenticated(true)
    } catch (error) {
        console.error("Failed to handle authentication:", error);
    }
}

function Login() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [identity, setIdentity] = useState<any | null>(null);
    const [whoami, setWhoami] = useState('');

    useEffect(() => {
        const checkSession = async () => {
            try {
                const authClient = await AuthClient.create({
                    storage: new LocalStorage(),
                    keyType: 'Ed25519',
                });

                if (await authClient.isAuthenticated()) {
                    await handleAuthenticated(authClient, setIsAuthenticated, setIdentity);
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
                identityProvider: `http://bd3sg-teaaa-aaaaa-qaaba-cai.localhost:4943/`,
                onSuccess: async () => {
                    await handleAuthenticated(authClient, setIsAuthenticated, setIdentity);
                    console.log("Login successful!");
                },
                onError: (error) => {
                    console.error("Login failed:", error);
                },
            });

        } catch (error) {
            console.error("Unexpected error during login:", error);
        }
    };

    const whoamiUnauthenticated = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_CANISTER_URL}/whoami`,
            );
            const responseText = await response.text();
            console.log(responseText)
            setWhoami(responseText);
        } catch (error) {
            console.error("Failed to fetch unauthenticated Whoami:", error);
        }
    };

    const whoamiAuthenticated = async () => {
        try {
            if (identity) {
                const response = await fetch(
                    `${import.meta.env.VITE_CANISTER_URL}/whoami`,
                    {
                        method: 'POST',
                        headers: [['Authorization', toJwt(identity)]]
                    }
                );
                const responseText = await response.text();
                console.log(responseText)

                setWhoami(responseText);
            }
        } catch (error) {
            console.error("Failed to fetch authenticated Whoami:", error);
        }
    };

    return (
        <main className="container mt-5">
            <h1 className="text-center mb-4">Internet Identity</h1>

            <div className="text-center mb-4">
                <h2>
                    Whoami principal:
                    <span id="whoamiPrincipal" className="ml-2 font-weight-bold">{whoami}</span>
                </h2>
            </div>

            <div className="d-flex justify-content-center mb-3">
                <button className="btn btn-primary mr-2" onClick={handleLogin}>Login</button>
                <button
                    className="btn btn-secondary mr-2"
                    id="whoamiUnauthenticated"
                    onClick={whoamiUnauthenticated}
                >
                    Whoami Unauthenticated
                </button>
                <button
                    className="btn btn-secondary"
                    id="whoamiAuthenticated"
                    onClick={whoamiAuthenticated}
                    disabled={!isAuthenticated}
                >
                    Whoami Authenticated
                </button>
            </div>
        </main>
    );
}

export default Login;
