import { useState, useContext } from 'react';
import { Input, Button, Form, message } from 'antd';
import { UserContext } from '@/context/UserContext';
import { useRouter } from 'next/router';
import Image from 'next/image';
import loginImage from "@/../../public/login-image.jpg"; // Replace with your image path
import Link from 'next/link';

const LoginPage = () => {
    const { fetchAndSetUser } = useContext(UserContext)!;
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (values: { username: string; password: string }) => {
        setLoading(true);
        try {
            // Simulate a login API call
            if (fetchAndSetUser) { await fetchAndSetUser(values.username); }
            message.success('Login successful!');
            router.push('/'); // Redirect to projects page
        } catch (error) {
            console.log(error);
            message.error('Login failed: User not found');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '94vh', backgroundColor: '#f0f2f5' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '80%', maxWidth: '1200px', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '20px', backgroundColor: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
                    <h2 style={{ margin: 0 }}>Login</h2>
                </div>
                <div style={{ display: 'flex', flex: 1 }}>
                    <div style={{ flex: 1, padding: '40px' }}>
                        <Form onFinish={handleLogin} layout="vertical">
                            <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please input your username!' }]}>
                                <Input placeholder="Username" />
                            </Form.Item>
                            <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input your password!' }]}>
                                <Input.Password placeholder="Password" />
                            </Form.Item>
                            <Form.Item style={{ textAlign: 'center' }}>
                                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '25%' }}>
                                    Login
                                </Button>
                            </Form.Item>
                            <Form.Item style={{ textAlign: 'center' }}>
                                <div>
                                    <span>Don't have an account?</span>
                                    {' '}
                                    <Link href="/signup">
                                        <p style={{ color: '#1890ff', fontWeight: 'bold' }}>Sign Up</p>
                                    </Link>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Image
                            src={loginImage}
                            alt="Login"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
