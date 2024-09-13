import { Outlet, Navigate } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";
import svgImg from './forms/side-image.svg';

export default function AuthLayout() {
const { isAuthenticated } = useUserContext();

return (
    <>
    {isAuthenticated ? (
        <Navigate to="/" />
    ) : (
        <>
        <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
        </section>

        <img
            src={svgImg}
            alt="logo"
            className="hidden xl:block h-screen w-3/4 object-cover bg-no-repeat"
        />
        </>
    )}
    </>
);
}
