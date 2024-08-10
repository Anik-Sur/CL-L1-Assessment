import { Card } from 'antd';
import Link from 'next/link';

interface ProjectCardProps {
    id: string;
    title: string;
    description: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, description }) => {
    return (
        <Link href={`/project?id=${id}`} passHref>
            <Card title={title} hoverable>
                <p>{description}</p>
            </Card>
        </Link>
    );
};
export default ProjectCard;