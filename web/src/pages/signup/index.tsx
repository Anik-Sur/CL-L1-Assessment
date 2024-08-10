import { useState, useContext } from 'react';
import { Input, Button, Form, message } from 'antd';
import { UserContext } from '@/context/UserContext';
import { useRouter } from 'next/router';
import Image from 'next/image';
import signupImage from "@/../../public/login-image.jpg"; // Replace with your image path
import Link from 'next/link';

const SignupPage = () => {
    const { addUser } = useContext(UserContext)!;
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSignup = async (values: { username: string; password: string }) => {
        setLoading(true);
        try {
            // Simulate a signup API call
            const user = { id: values.username };
            if (addUser) {
                await addUser(user as User);
                message.success('Signup successful!');
                router.push('/');
            }
        } catch (error) {
            message.error('Signup failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '95vh', backgroundColor: '#f0f2f5' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '80%', maxWidth: '1200px', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '20px', backgroundColor: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
                    <h2 style={{ margin: 0 }}>Sign Up</h2>
                </div>
                <div style={{ display: 'flex', flex: 1 }}>
                    <div style={{ flex: 1, padding: '40px' }}>
                        <Form onFinish={handleSignup} layout="vertical">
                            <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please input your username!' }]}>
                                <Input placeholder="Username" />
                            </Form.Item>
                            <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input your password!' }]}>
                                <Input.Password placeholder="Password" />
                            </Form.Item>
                            <Form.Item style={{ textAlign: 'center' }}>
                                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '25%' }}>
                                    Sign Up
                                </Button>
                            </Form.Item>
                            <Form.Item style={{ textAlign: 'center' }}>
                                <div>
                                    <span>Already have an account? </span>
                                    <Link href="/login">
                                        <p style={{ color: '#1890ff', fontWeight: 'bold' }}>Login</p>
                                    </Link>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Image
                            src={signupImage}
                            alt="Sign Up"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
