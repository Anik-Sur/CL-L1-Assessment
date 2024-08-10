import { createContext, ReactNode, useContext, useState } from "react";
import { UserContext } from "./UserContext";

export const TaskContext = createContext<TaskProviderValues>({});

export default function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>();
    const { user } = useContext(UserContext);
    const fetchTasks = async (projectId: string) => {
        const res = await fetch(`/api/tasks`)
        const json = await res.json();
        console.log(json);
        if (json.tasks) {
            setTasks(json.tasks.filter((t: Task) => {
                return t.projectId === projectId;
            }));
            return json.tasks;
        }
        throw "messgage: Tasks Not Found!"
    }
    const updateTask = async (taskId: number, projectId: string, updates: Partial<Task>) => {
        const res = await fetch(`/api/tasks`, { method: 'PUT', body: JSON.stringify({ userId: user?.id, taskId, updates, projectId }), headers: { 'content-type': 'application/json' } })
        const json = await res.json();
        await fetchTasks(projectId);
        return json.tasks;

    }

    const addTask = async (projectId: string, task: Partial<Task>) => {
        const res = await fetch(`/api/tasks`, { method: 'POST', body: JSON.stringify({ ...task, userId: user?.id, projectId }), headers: { 'content-type': 'application/json' } })
        const json = await res.json();
        await fetchTasks(projectId);
    }

    const value = { tasks, fetchTasks, updateTask, addTask };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
}
