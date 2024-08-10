import { users as defaultUsers } from '@/data/UserList';
import { readFromMemory, updateInMemory } from './FileSync';

const filePath = "./src/memory/users.json"

let users: User[] = readFromMemory<User[]>(filePath)
export function initializeUsers() {
    users = [...defaultUsers as User[]];
    updateInMemory(filePath, users);
}
export function getUsers() {
    return users;
}

export function getUserById(id: string) {
    return users.find(user => user.id === id);
}

export function addUser(id: string, role: string) {
    const userRole = role as UserRoleType
    let newUser: User = { id: id, role: userRole, }
    users.push(newUser);
    updateInMemory(filePath, users);
    return newUser;
}

export function updateUserRole(userId: string, newRole: string, projectId: string) {
    const projectRole = newRole as ProjectRoleType;
    users = users.map(u => {
        if (u.id === userId) {
            return {
                ...u,
                project: {
                    projectId: projectId,
                    projectRole: projectRole
                }
            };
        }
        return u;
    });
    updateInMemory(filePath, users);
}
export function deleteUser(id: string) {
    users = users.filter(u => {
        return u.id !== id;
    })
    updateInMemory(filePath, users);
}