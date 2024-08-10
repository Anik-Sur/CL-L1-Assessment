import { addUser, getUserById, getUsers } from '@/models/User';
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
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT']);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}

// GET /api/users - Fetch all users
function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query
    if (id) {
        const user = getUserById(id as string)
        res.status(200).json({
            message: 'Users fetched',
            user: user
        });
        return;
    }
    const users = getUsers()
    res.status(200).json({
        message: 'Users fetched',
        users: users
    });
}

// POST /api/users - Add a new user
function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const { id, role }: { id: string, role?: UserRoleType } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const newUser = addUser(id, role ? role : "admin"); //todo: change back to staff

    res.status(201).json({
        message: 'User added',
        user: newUser
    });
}

// PUT /api/users - Update a user's role for a specific project
function handlePut(req: NextApiRequest, res: NextApiResponse) {
    const { userId, newRole, projectId }: { userId: string; newRole: string; projectId: string } = req.body;

    if (!userId || !newRole || !projectId) {
        return res.status(400).json({ message: 'userId, newRole, and projectId are required' });
    }

    const user = getUserById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    try {
        user.project = {
            projectId: projectId,
            projectRole: newRole as ProjectRoleType,
        }
        res.status(200).json({ message: 'Role updated' });

    } catch (error) {
        res.status(500).json({ message: 'Failed to update role' });
    }
}
