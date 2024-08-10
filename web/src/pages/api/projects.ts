import { initialTasks } from '@/data/TaskList';
import { createProject, deleteProject, getProjects } from '@/models/Project';
import { initializeProjectTasks } from '@/models/Tasks';
import { getUserById, getUsers } from '@/models/User';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: any, res: any) {
    const { method } = req;

    switch (method) {
        case 'POST':
            return handlePost(req, res);
        case 'DELETE':
            return handleDelete(req, res);
        case 'GET':
            return handleGet(req, res);
        default:
            res.setHeader('Allow', ['POST', 'DELETE', 'GET']);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}

// POST /api/projects - Create a new project
function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const { userId, name, contributorId, approverId, reviewerId } = req.body;

    // Check if userId and name are provided
    if (!userId || !name || !contributorId || !approverId || !reviewerId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = getUserById(userId);
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can manage projects' });
    }

    const newProject = createProject(name, contributorId, approverId, reviewerId, userId)
    initializeProjectTasks(newProject.id);

    res.status(201).json({
        message: 'Project created',
        project: newProject
    });
}

// DELETE /api/projects - Delete an existing project
function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    const { userId, projectId } = req.body;

    // Check if userId and projectId are provided
    if (!userId || !projectId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = getUserById(userId);

    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can manage projects' });
    }

    deleteProject(projectId);

    res.status(200).json({ message: 'Project deleted' });
}

// GET /api/projects - Fetch all projects
function handleGet(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({
        message: 'Projects fetched',
        projects: getProjects()
    });
}