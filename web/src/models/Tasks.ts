import { initialTasks } from "@/data/TaskList";
import { getProjectById, getProjects, updateProject } from "./Project";
import { getUserById } from "./User";
import { readFromMemory, updateInMemory } from "./FileSync";

const filePath = "./src/memory/tasks.json"

let tasks: Task[] = readFromMemory<Task[]>(filePath);

export const Task = {
    idCounter: tasks.length + 1
}

export function initializeProjectTasks(projectId: string) {
    const projectTasks = initialTasks.map(task => {
        const taskInstance: Task = { ...task, id: Task.idCounter, assignedTo: task.persona as keyof Member, status: task.group === 1 ? "active" : "pending", projectId }

        Task.idCounter += 1;
        return taskInstance as Task;
    })
    tasks = [...tasks, ...projectTasks];
    updateInMemory(filePath, tasks);
}

export function getTasks(status?: string) {
    if (status) {
        return tasks.filter(task => {
            return task.status === status;
        })
    }
    return tasks;
}
export function getTasksForProject(projectId: string) {
    return tasks.filter(task => {
        return task.projectId === projectId;
    })
}

export function getTaskById(id: number) {
    return tasks.find(task => {
        return task.id === id;
    })
}

function updatePermitedTask(taskId: number, updates: Partial<Task>) {
    let updated = false;
    tasks = tasks.map(t => {
        if (t.id === taskId) {
            updated = true;
            return { ...t, ...updates }
        }
        return t
    })
    updateInMemory(filePath, tasks);
    return updated;
}

export function updateTask(taskId: number, updates: Partial<Task>, userId: string, projectId: string) {

    const project = getProjectById(projectId)

    if (project && project.members["approver"] === userId) {
        return updatePermitedTask(taskId, updates);
    }
    return false;
}

function setTasksActiveForGroup(groupId: number, projectId: string) {
    tasks = tasks.map(task => {
        if (task.group === groupId && task.projectId === projectId) {
            return { ...task, status: "active" }
        }
        return task
    })
    updateInMemory(filePath, tasks);
}

function checkGroupCompletionStatus(groupId: number, projectId: string) {
    const filteredTasks = tasks.filter(t => {
        return t.group === groupId && t.projectId === projectId
    });
    const countCompletedTasks = filteredTasks.reduce((prev, cur) => {
        return cur.status === "completed" ? prev + 1 : prev
    }, 0);
    return filteredTasks.length === countCompletedTasks;
}

export function markTaskAsComplete(taskId: number, userId: string, projectId: string) {
    const task = getTaskById(taskId);
    const project = getProjectById(projectId)
    if (project && task && project.members[task.assignedTo as ProjectRoleType] === userId) {

        const updated = updatePermitedTask(taskId, { status: "completed" });
        if (checkGroupCompletionStatus(task.group, projectId)) {
            setTasksActiveForGroup(task.group + 1, projectId)
        }
        updateInMemory(filePath, tasks);
        return updated;

    }
    return false;
}

export function deleteTask(taskId: number, userId: string) {
    const task = getTaskById(taskId);
    if (task) {
        const project = getProjectById(task.projectId)

        if (project && project.members["approver"] === userId) {
            tasks = tasks.filter(t => {
                return t.id !== taskId;
            })
            updateInMemory(filePath, tasks);
            return true;
        }
    }
    return false;
}

export function createTask(title: string, description: string, group: number, assignedTo: keyof Member, userId: string, projectId: string) {
    const project = getProjectById(projectId)
    if (project && project.members["approver"] === userId) {
        tasks.push({
            id: Task.idCounter, title, description, group, assignedTo, projectId, status: "pending"
        })
        Task.idCounter += 1;
        updateInMemory(filePath, tasks);
        return true
    }
    return false;
}