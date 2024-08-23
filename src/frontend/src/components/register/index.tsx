import { AuthClient, LocalStorage } from "@dfinity/auth-client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toJwt } from 'azle/http_client';  
import RegisterPhase1 from "./phase1";
import RegisterPhase2 from "./phase2";

function RegisterIndex() {
    const navigate = useNavigate();
    const [identity, setIdentity] = useState<any | null>(null)
    const [registerPhase, setRegisterPhase] = useState(0)

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

        setRegisterPhase(0)
    }, [navigate]);

    return (
        <main>
            <h1>Register Page</h1>

            <div>
                {registerPhase === 0 && (
                    <RegisterPhase1 phaseChanger={setRegisterPhase} />
                )}
                {registerPhase === 1 && (
                    <RegisterPhase2 phaseChanger={setRegisterPhase} />
                )}
                {registerPhase === 2 && (
                    <div>Registration Successful!</div>
                )}
            </div>

        </main>
    );
}

export default RegisterIndex;
