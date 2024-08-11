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
    const fetchTasksCompletion = async (projectId: string) => {
        const res = await fetch(`/api/tasks`)
        const json = await res.json();
        console.log(json);
        if (json.tasks) {
            const filteredTasks: Task[] = json.tasks.filter((t: Task) => {
                return t.projectId === projectId;
            });
            const completed = filteredTasks.reduce((prev, cur) => {
                return cur.status === 'completed' ? prev + 1 : prev
            }, 0)
            return {
                completed: completed,
                total: filteredTasks.length
            }
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

    const value = { tasks, fetchTasks, updateTask, addTask, fetchTasksCompletion };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
}
