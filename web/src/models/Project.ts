import { readFromMemory, updateInMemory } from "./FileSync";

const filePath = "./src/memory/projects.json"
let projectInstances: ProjectInstance[] = readFromMemory<ProjectInstance[]>(filePath);

export const Project = {
    idCounter: projectInstances.length + 1
}

export function getProjects() {
    return projectInstances;
}

export function getProjectById(id: string) {
    return projectInstances.find(projectInstance => projectInstance.id === id);
}

export function createProject(
    name: string,
    contributorId: string,
    approverId: string,
    reviewerId: string,
    adminId: string
) {
    const project: ProjectInstance = {
        id: Project.idCounter.toString(),
        name,
        members: {
            contributor: contributorId,
            approver: approverId,
            reviewer: reviewerId,
            admin: adminId,
        },
    };
    projectInstances.push(project);
    Project.idCounter += 1;
    updateInMemory(filePath, projectInstances);
    return project;
};


export function updateProject(projectInstance: ProjectInstance) {
    projectInstances = projectInstances.map(p => {
        if (p.id === projectInstance.id)
            return projectInstance
        return p
    })
    updateInMemory(filePath, projectInstances);
}

export function deleteProject(id: string) {
    projectInstances = projectInstances.filter(p => {
        return p.id !== id;
    })
    updateInMemory(filePath, projectInstances);
}
