import React from "react";
import { Loading } from "@/components/ui/Loading";
import { useLogout } from "@/hooks/use-auth";


const Logout: React.FC = () => {
    const logout = useLogout();

    const handleLogout = () => {
        logout.mutateAsync();
    }
    React.useEffect(() => {
        handleLogout();
    }, []);
    return (
        <Loading />
    )
}

export default Logout