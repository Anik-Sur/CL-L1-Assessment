type TaskStatus = "active" | "pending" | "completed"

interface Member {
    contributor: string; //contains ids of users.
    approver: string;
    reviewer: string;
    admin: string;
}

interface Task {
    id: number;
    title: string;
    description: string;
    group: number;
    assignedTo: keyof Member;
    status: TaskStatus;
    projectId: string;
}

interface ProjectInstance {
    id: string;
    name: string;
    members: Member;
}
interface ProjectCreationRequest {
    userId: string;
    name: string;
    contributorId: string;
    approverId: string;
    reviewerId: string;
}

interface ProjectInstanceProviderValues {
    projects: ProjectInstance[] | null;
    fetchProjects?: () => Promise<ProjectInstance[]>;
    addProject?: (projectRequest: ProjectCreationRequest) => Promise<ProjectInstance>;
}

interface TaskProviderValues {
    tasks?: Task[];
    fetchTasks?: (projectId: string) => Promise<Task[]>;
    updateTask?: (taskId: number, projectId: string, updates: Partial<Task>) => Promise<Task[]>;
    addTask?: (projectId: string, updates: Partial<Task>) => Promise<void>;
    fetchTasksCompletion?: (projectId: string) => Promise<{ completed: number, total: number }>;
}