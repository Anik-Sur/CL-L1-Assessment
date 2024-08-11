import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import { Row, Col, Card, Button, Modal, Empty, Badge, Flex } from 'antd';
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

    const lastGroup = tasks?.reduce((prev, cur) => {
        return prev > cur.group ? prev : cur.group
    }, 0)
    const groupMax = lastGroup ? lastGroup + 1 : 10;

    const activeGroup = tasks?.find((task) => {
        return task.status === "active"
    })?.group
    const groupMin = activeGroup ? activeGroup + 1 : groupMax;

    const cardStyle: CSSProperties = {
        height: '200px', /* Fixed height */
        display: 'flex',
        flexDirection: 'column',
    };

    const descriptionStyle: CSSProperties = {
        height: "50px",
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2, /* Number of lines to show */
        WebkitBoxOrient: 'vertical'
    };
    const buttonContainerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '25px' // Push the button to the bottom
    };

    const renderTasks = (tasks: Task[]) => (
        <Row gutter={[16, 16]} style={{ maxHeight: '70vh', overflow: 'auto', marginTop: "2rem" }}>
            {tasks.map(task => (
                <Col span={12} key={task.id}>
                    <Card
                        title={task.title}
                        style={cardStyle} // Apply card styles here
                    >

                        <p style={descriptionStyle}>{task.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                            <Badge
                                count={task.assignedTo}
                                style={{
                                    textAlign: 'end',
                                    backgroundColor: 'gray',
                                    color: '#fff',
                                    fontSize: '0.7rem',
                                }}
                                showZero
                            />
                            {
                                task.status === 'active' && (
                                    <Button
                                        style={{ fontSize: '0.7rem', padding: '2px 10px' }}
                                        type="primary"
                                        icon={<CheckOutlined />}
                                        onClick={() => markTaskAsDone(task.id)}
                                        disabled={project.members[task.assignedTo] !== user.id}
                                    >
                                        Done
                                    </Button>
                                )
                            }
                        </div>

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
            <Row style={{ marginTop: '1rem' }} gutter={32}>
                <Col span={8}>
                    <h2>Pending <Badge count={pendingTasks.length} style={{ backgroundColor: '#d94c29' }} showZero /></h2>
                    {pendingTasks.length > 0 ? (
                        renderTasks(pendingTasks)
                    ) : (
                        <Empty style={{ marginTop: '4rem' }} description="No Pending Tasks" />
                    )}
                </Col>
                <Col span={8}>
                    <h2>Active <Badge count={activeTasks.length} style={{ backgroundColor: '#d9b929' }} showZero /></h2>
                    {activeTasks.length > 0 ? (
                        renderTasks(activeTasks)
                    ) : (
                        <Empty style={{ marginTop: '4rem' }} description="No Active Tasks" />
                    )}
                </Col>
                <Col span={8}>
                    <h2>Completed <Badge count={completedTasks.length} style={{ backgroundColor: '#52c41a' }} showZero /></h2>
                    {completedTasks.length > 0 ? (
                        renderTasks(completedTasks)
                    ) : (
                        <Empty style={{ marginTop: '4rem' }} description="No Completed Tasks" />
                    )}
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
