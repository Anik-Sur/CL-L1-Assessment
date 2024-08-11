import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { ProjectContext } from '@/context/ProjectContext';

const { Option } = Select;

interface NewProjectModalProps {
    visible: boolean;
    onCreate: (values: any) => void;
    onCancel: () => void;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    const { fetchUsers, user } = useContext(UserContext);
    const [users, setUsers] = useState([] as User[]);

    useEffect(() => {
        const loadUsers = async () => {
            if (fetchUsers) {
                const users = await fetchUsers();
                setUsers(users ? users : []);
            }
        };
        loadUsers();
    }, [fetchUsers]);

    return (
        <Modal
            visible={visible}
            title="Create a New Project"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="new_project_form"
                initialValues={{ modifier: 'public' }}
            >
                <Form.Item
                    name="name"
                    label="Project Name"
                    rules={[{ required: true, message: 'Please input the project name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="contributor"
                    label="Contributor"
                    rules={[{ required: true, message: 'Please select a contributor!' }]}
                >
                    <Select placeholder="Select a contributor">
                        {users.map((user) => (
                            <Option key={user.id} value={user.id}>
                                {user.id}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="approver"
                    label="Approver"
                    rules={[{ required: true, message: 'Please select an approver!' }]}
                >
                    <Select placeholder="Select an approver">
                        {users.map((user) => (
                            <Option key={user.id} value={user.id}>
                                {user.id}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="reviewer"
                    label="Reviewer"
                    rules={[{ required: true, message: 'Please select a reviewer!' }]}
                >
                    <Select placeholder="Select a reviewer">
                        {users.map((user) => (
                            <Option key={user.id} value={user.id}>
                                {user.id}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="admin"
                    label="Admin"
                    rules={[{ message: 'Please select an admin!' }]}
                >
                    <Select defaultValue={user?.id} disabled placeholder="You are selected as the admin by default">
                        <Option selected key={user?.id} value={user?.id}>
                            {user?.id}
                        </Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NewProjectModal;
