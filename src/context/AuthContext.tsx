import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "@/types";
import { getCurrentUser } from "@/lib/appwrite/api";

export const INITIAL_USER = {
id: "",
name: "",
username: "",
email: "",
imageUrl: "",
bio: "",
};

const INITIAL_STATE = {
user: INITIAL_USER,
isPending: false,
isAuthenticated: false,
setUser: () => {},
setIsAuthenticated: () => {},
checkAuthUser: async () => false,
};

type IContextType = {
user: IUser;
isPending: boolean;
setUser: React.Dispatch<React.SetStateAction<IUser>>;
isAuthenticated: boolean;
setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
const navigate = useNavigate();
const [user, setUser] = useState<IUser>(INITIAL_USER);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [isPending, setIsPending] = useState(false);

const checkAuthUser = async () => {
    setIsPending(true);
    try {
    const currentAccount = await getCurrentUser();
    if (currentAccount) {
        setUser({
        id: currentAccount.$id,
        name: currentAccount.name,
        username: currentAccount.username,
        email: currentAccount.email,
        imageUrl: currentAccount.imageUrl,
        bio: currentAccount.bio,
        });
        setIsAuthenticated(true);

        return true;
    }

    return false;
    } catch (error) {
    console.error(error);
    return false;
    } finally {
    setIsPending(false);
    }
};

//VARUN GUPTA CHANGES IT I JUST COMMENT THE BELOW CODE

// useEffect(() => {
//     const checkAuth = async () => {
//     const cookieFallback = localStorage.getItem("cookieFallback");
//     if (
//         cookieFallback === "[]" ||
//         cookieFallback === null ||
//         cookieFallback === undefined
//     ) {
//         navigate("/sign-in");
//     }

//     await checkAuthUser();
//     };
//     checkAuth();
// }, [navigate]);

const value = {
    user,
    setUser,
    isPending,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
};

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
