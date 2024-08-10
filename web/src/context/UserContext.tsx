
import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";

export const UserContext = createContext<UserProviderValue>({ user: null })

export default function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null | undefined>(undefined)
    const router = useRouter();
    useEffect(() => {
        if (user === null || user === undefined) {
            router.push('/login');
        }
    }, [user])
    const fetchAndSetUser = async (id: string) => {
        const res = await fetch(`/api/users?id=${id}`)
        const json = await res.json();
        if (json.user) {
            setUser(json.user);
            return json.user;
        }
        setUser(null)
        throw "messgage: User Not Found!"
    }
    const addUser = async (user: User) => {
        const res = await fetch(`/api/users`, { method: 'POST', body: JSON.stringify(user), headers: { 'content-type': 'application/json' } })
        const json = await res.json();
        setUser(json.user);
        return json.user;
    }
    const resetUser = () => {
        setUser(null);
    }
    const fetchUsers = async () => {
        const res = await fetch(`/api/users`)
        const json = await res.json();
        return json.users;
    }
    const value = { user, fetchAndSetUser, fetchUsers, addUser, resetUser }
    return (<UserContext.Provider value={value}>{children}</UserContext.Provider>)
}