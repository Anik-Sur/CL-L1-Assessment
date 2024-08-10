import { createContext, ReactNode, useEffect, useState } from "react";

export const ProjectContext = createContext<ProjectInstanceProviderValues>({ projects: [] });

export default function ProjectProvider({ children }: { children: ReactNode }) {
    const [projects, setProjects] = useState<ProjectInstance[] | null>(null);

    const fetchProjects = async () => {
        const res = await fetch(`/api/projects`)
        const json = await res.json();
        console.log(json);
        if (json.projects) {
            setProjects(json.projects);
            return json.projects;
        }
        throw "messgage: Projects Not Found!"
    }
    const addProject = async (projectRequest: ProjectCreationRequest) => {
        const res = await fetch(`/api/projects`, { method: 'POST', body: JSON.stringify(projectRequest), headers: { 'content-type': 'application/json' } })
        const json = await res.json();
        await fetchProjects()
        return json.project;
    }


    const value: ProjectInstanceProviderValues = { projects, fetchProjects, addProject };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
}
