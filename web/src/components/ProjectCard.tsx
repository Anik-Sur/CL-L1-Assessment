import { useContext, useEffect, useState } from 'react';
import { Card, Progress, Space, Typography } from 'antd';
import Link from 'next/link';
import { TaskContext } from '@/context/TaskContext';
const { Text, Title } = Typography;

interface ProjectCardProps {
    id: string;
    title: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title }) => {
    const { fetchTasksCompletion } = useContext(TaskContext);
    const [completion, setCompletion] = useState<{ completed: number, total: number }>({ completed: 0, total: 0 });

    useEffect(() => {
        const fetchCompletionData = async () => {
            if (fetchTasksCompletion)
                setCompletion(await fetchTasksCompletion(id));
        };

        fetchCompletionData();
    }, [id, fetchTasksCompletion]);

    const progressPercent = completion.total > 0 ? (completion.completed / completion.total) * 100 : 0;

    return (
        <Link href={`/project?id=${id}`} passHref>
            <Card hoverable style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Title level={4} style={{ marginBottom: 5, borderBottom: '1px solid lightgray', paddingBottom: 10 }}>
                        {title}
                    </Title>
                    <Space direction="vertical" style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        <Text style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                            <Text strong>
                                Progress
                            </Text>
                            <Text >
                                {completion.completed}/{completion.total} Tasks Completed
                            </Text>
                        </Text>

                        <Progress percent={progressPercent} showInfo={false} />
                    </Space>
                </Space>
            </Card>
        </Link>
    );
};

export default ProjectCard;
