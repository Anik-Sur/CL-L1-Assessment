import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Card, Button, Modal } from 'antd';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { ProjectContext } from '@/context/ProjectContext';
import { UserContext } from '@/context/UserContext';
import { TaskContext } from '@/context/TaskContext';
import TaskForm from './TaskFormModal';
import { useRouter } from 'next/router';

const ProjectPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useContext(UserContext);
    const { projects } = useContext(ProjectContext);
    const { tasks, fetchTasks, updateTask, addTask } = useContext(TaskContext);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        if (fetchTasks)
            fetchTasks(id as string)
    }, [])

    const project = projects?.find((project) => project.id === id);

    if (!project) {
        return <div>Project not found</div>;
    }
    if (!user) {
        return (<></>);
    }

    const pendingTasks = tasks?.filter(task => task.status === 'pending') || [];
    const activeTasks = tasks?.filter(task => task.status === 'active') || [];
    const completedTasks = tasks?.filter(task => task.status === 'completed') || [];

    const markTaskAsDone = (taskId: number) => {
        // Handle marking the task as done, updating the context or making an API call
        if (updateTask) {
            updateTask(taskId, project.id, { status: "completed" })
        }

    };
    const handleAddTask = (values: any) => {
        // Logic to add a new task, possibly updating the context or making an API call
        if (addTask) {
            addTask(project.id, { title: values.title, description: values.description, group: values.group, assignedTo: values.assignedTo })
        }
        setIsModalVisible(false);
    };

    const activeGroup = tasks?.find((task) => {
        return task.status === "active"
    })?.group
    const groupMin = activeGroup ? activeGroup + 1 : 1;

    const lastGroup = tasks?.reduce((prev, cur) => {
        return prev > cur.group ? prev : cur.group
    }, 0)
    const groupMax = lastGroup ? lastGroup + 1 : 10;

    const renderTasks = (tasks: Task[]) => (
        <Row gutter={[16, 16]} style={{ maxHeight: '75vh', overflow: 'auto' }}>
            {tasks.map(task => (
                <Col span={12} key={task.id}>
                    <Card title={task.title}>
                        <p>{task.description}</p>
                        {task.status === 'active' && (
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={() => markTaskAsDone(task.id)}
                                disabled={project.members[task.assignedTo] !== user.id} // Disable if user.id doesn't match
                            >
                                Done
                            </Button>
                        )}
                    </Card>
                </Col>
            ))}
        </Row>
    );

    return (
        <div>
            <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>{project.name}</h1>
                {project.members.approver === user.id && (
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalVisible(true)}
                        >
                            Add New Task
                        </Button>
                    </Col>
                )}
            </Row>
            <Row gutter={32}>
                <Col span={8}>
                    <h2>Pending ({pendingTasks.length})</h2>
                    {renderTasks(pendingTasks)}
                </Col>
                <Col span={8}>
                    <h2>Active ({activeTasks.length})</h2>
                    {renderTasks(activeTasks)}
                </Col>
                <Col span={8}>
                    <h2>Completed ({completedTasks.length})</h2>
                    {renderTasks(completedTasks)}
                </Col>
            </Row>
            <Modal
                title="Add New Task"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <TaskForm groupMax={groupMax} groupMin={groupMin} onFinish={handleAddTask} onCancel={() => setIsModalVisible(false)} />
            </Modal>
        </div>

    );
};

export default ProjectPage;
