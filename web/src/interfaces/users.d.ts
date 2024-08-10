type UserRoleType = "admin" | "staff";
type ProjectRoleType = "admin" | "contributor" | "reviewer" | "approver";

interface Project {
    projectId: string;
    projectRole: ProjectRoleType;
}
interface User {
    id: string;
    role: UserRoleType;
    project?: Project;
}

interface UserProviderValue {
    user: User | null | undefined;
    fetchAndSetUser?: (id: string) => Promise<User>;
    fetchUsers?: () => Promise<User[]>;
    addUser?: (user: User) => Promise<User>;
    resetUser?: () => void
}