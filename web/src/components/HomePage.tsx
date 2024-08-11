import { Tabs, Row, Col, Button, Input, Empty } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useContext, useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { UserContext } from '@/context/UserContext';
import { ProjectContext } from '@/context/ProjectContext';
import NewProjectModal from './NewProjectModal';
import { TaskContext } from '@/context/TaskContext';

const { TabPane } = Tabs;

const HomePage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchText, setSearchText] = useState('');
    const { user } = useContext(UserContext);
    const { projects, addProject, fetchProjects } = useContext(ProjectContext);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        if (fetchProjects)
            fetchProjects();
    }, [])

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleCreate = async (values: any) => {
        if (addProject) {
            await addProject({ name: values.name, contributorId: values.contributor, approverId: values.approver, reviewerId: values.reviewer, userId: user?.id ? user.id : '' })
        }
        setIsModalVisible(false);
    };

    if (!user) {
        return (<></>);
    }


    const filteredProjects = projects?.filter((project) => {
        if (searchText && !project.name.toLowerCase().includes(searchText.toLowerCase())) return false;
        if (activeTab === 'all') return true;
        if (activeTab === 'assigned' && Object.values(project.members).includes(user.id)) return true;
    });

    return (
        <div >
            <NewProjectModal
                visible={isModalVisible}
                onCreate={handleCreate}
                onCancel={handleCancel}
            />
            <h1>Projects</h1>
            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                <Col>
                    <Tabs activeKey={activeTab} onChange={setActiveTab}>
                        <TabPane tab="All" key="all" />
                        <TabPane tab="Assigned to me" key="assigned" />
                    </Tabs>
                </Col>
                <Col>
                    <Row justify="end" gutter={8}>
                        <Col>
                            <Input
                                placeholder="Search projects"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>
                        {user.role === 'admin' && (
                            <Col>
                                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                                    New Project
                                </Button>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                {filteredProjects && filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <Col span={6} key={project.id}>
                            <ProjectCard id={project.id} title={project.name} />
                        </Col>
                    ))
                ) : (
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Empty description="No Projects Found" />
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default HomePage;
