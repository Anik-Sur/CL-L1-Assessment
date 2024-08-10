import { createTask, deleteTask, getTaskById, getTasks, markTaskAsComplete, updateTask } from '@/models/Tasks';
import { getUserById } from '@/models/User';
import { stat } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: any, res: any) {
    const { method } = req;

    switch (method) {
        case 'GET':
            return handleGet(req, res);
        case 'POST':
            return handlePost(req, res);
        case 'PUT':
            return handlePut(req, res);
        case 'DELETE':
            return handleDelete(req, res);
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'POST']);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}

// GET /api/tasks - Fetch tasks by status
function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { status } = req.query;

    const tasks = getTasks(status as string);
    res.status(200).json({
        message: 'Tasks fetched',
        tasks: tasks
    });
}

// POST /api/tasks - Add a task
function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const { title, description, group, assignedTo, userId, projectId } = req.body;

    // Check if userId and name are provided
    if (!title || !description || !group || !assignedTo || !userId || !projectId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const created = createTask(title, description, group, assignedTo, userId, projectId)
    if (!created) {
        return res.status(403).json({ message: 'Forbidden: Only approver can manage tasks' });
    }
    res.status(201).json({
        message: 'Task created',
    });
}

// PUT /api/tasks - Update or complete a task
function handlePut(req: NextApiRequest, res: NextApiResponse) {
    const { userId, taskId, updates, projectId } = req.body;

    if (!userId || !taskId) {
        return res.status(400).json({ message: 'userId, taskId, and projectId are required' });
    }

    const user = getUserById(userId);
    const task = getTaskById(taskId);
    const linkedProjectId = projectId ? projectId : task?.projectId

    if (!user) {
        return res.status(403).json({ message: 'Forbidden: Only assigned user can mark the task as complete' });
    }

    if (updates.status === 'completed') {
        const updated = markTaskAsComplete(taskId, userId, linkedProjectId)
        if (!updated)
            return res.status(403).json({ message: 'Forbidden: Only assigned user can mark the task as complete' });
        res.status(200).json({
            message: 'Task marked as complete',
            tasks: getTasks()
        });
    } else {
        const updated = updateTask(taskId, updates, userId, linkedProjectId)
        if (!updated) {
            return res.status(403).json({ message: 'Forbidden: Only approvers can update tasks' });
        }
        res.status(200).json({
            message: 'Task updated',
            tasks: getTasks()
        });
    }
}

// DELETE /api/tasks - Delete a task
function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    const { userId, taskId } = req.body;

    if (!userId || !taskId) {
        return res.status(400).json({ message: 'userId and taskId are required' });
    }

    const deleted = deleteTask(taskId, userId);
    if (!deleted) {
        return res.status(403).json({ message: 'Forbidden: Only approvers can delete tasks' });
    }

    res.status(200).json({ message: 'Task deleted' });
}