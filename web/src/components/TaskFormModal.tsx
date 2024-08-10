import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

interface TaskFormProps {
    onFinish: (values: any) => void;
    onCancel: () => void;
    groupMin: number;
    groupMax: number;
}

const TaskForm: React.FC<TaskFormProps> = ({ onFinish, onCancel, groupMin, groupMax }) => {
    const groupOptions = [];
    for (let i = groupMin; i <= groupMax; i++) {
        groupOptions.push(
            <Option key={i} value={i}>
                {i}
            </Option>
        );
    }
    return (
        <Form onFinish={onFinish}>
            <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please input the task title!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please input the task description!' }]}
            >
                <TextArea rows={4} />
            </Form.Item>
            <Form.Item
                name="group"
                label="Group"
                rules={[
                    { required: true, message: 'Please select the task group!' },
                    {
                        validator: (_, value) =>
                            value >= groupMin && value <= groupMax
                                ? Promise.resolve()
                                : Promise.reject(
                                    new Error(`Group number must be between ${groupMin} and ${groupMax}!`)
                                ),
                    },
                ]}
            >
                <Select placeholder="Select a group">
                    {groupOptions}
                </Select>
            </Form.Item>
            <Form.Item
                name="assignedTo"
                label="Assigned To"
                rules={[{ required: true, message: 'Please select the assignee!' }]}
            >
                <Select placeholder="Select a role">
                    <Option value="contributor">Contributor</Option>
                    <Option value="approver">Approver</Option>
                    <Option value="reviewer">Reviewer</Option>
                    <Option value="admin">Admin</Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
                    Add Task
                </Button>
                <Button onClick={onCancel}>Cancel</Button>
            </Form.Item>
        </Form>
    );
};

export default TaskForm;
