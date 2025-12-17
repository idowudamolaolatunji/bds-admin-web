import { createContext, useState, useEffect, useContext } from "react";
import Cookies from 'js-cookie';

//////////////////////////////////////////////
//// CREATING CONTEXT ////
//////////////////////////////////////////////
interface AuthContextType {
	user: Record<string, unknown> | null;
	token: string | null;
	handleChange: (user: Record<string, unknown>, token: any) => void;
	handleUser: (user: Record<string, unknown>) => void;
	signoutUser: () => boolean;
}

const AuthContext = createContext<AuthContextType | any>(null);
export default AuthContext;

//////////////////////////////////////////////
//// CREATING PROVIDER ////
//////////////////////////////////////////////
interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const storedAuth = Cookies.get("auth_obj");
    const [auth, setAuth] = useState(storedAuth == null ? null : JSON.parse(storedAuth));
    const [token, setToken] = useState<any | null>(Cookies.get("token") ? Cookies.get("token") : null);

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }
    const formdataHeader = { Authorization: `Bearer ${token}` }

    function handleAuthChange(auth: Record<string, unknown> | any, token: string | any) {
        setAuth(auth)
        setToken(token);
    };

    async function signout() {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, { method: "POST", headers });
        if (!res.ok) return false;
		
		handleAuthChange(null, null);
		Cookies.remove("auth_obj");
		Cookies.remove("token");
        return true
    }

    function shouldKick(res: any) {
        if (res?.status === 401 || res?.status === 403) {
            handleAuthChange(null, null);
        }
    };

    useEffect(function () {
        Cookies.set("auth_obj", JSON.stringify(auth), { expires: 365 });
        Cookies.set("token", token, { expires: 365 });
    }, [auth, token]);
    

    // CREATE CONTEXT DATA
    let contextData = {
        auth,
        token,
        handleAuthChange,
        headers,
        formdataHeader,
        signout,
        shouldKick,
    }

    return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
}


//////////////////////////////////////////////
//// CREATING HOOK AND EXPORTING ////
//////////////////////////////////////////////
export const useAuthContext = () => useContext(AuthContext);