import React, { useContext } from 'react';
import { Breadcrumb, Avatar, Row, Col, Layout, Dropdown, Menu } from 'antd';
import { UserOutlined, HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';

const { Header } = Layout;

const Navbar = () => {
    const { pathname } = useRouter();
    const { user, resetUser } = useContext(UserContext)!;


    const getBreadcrumbItems = () => {
        switch (pathname) {
            case '/project':
                return [
                    { title: 'Home', href: '/' },
                    { title: 'Project' },
                ];
            default:
                return [{ title: 'Home', href: '/' }];
        }
    };

    const breadcrumbItems = getBreadcrumbItems();

    const handleLogout = () => {
        // Clear the user context
        if (resetUser)
            resetUser();

    };

    const userMenu = (
        <Menu>
            <Menu.Item>
                <span>User Role: {user?.role}</span>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
        </Menu>
    );

    return (
        <Header style={{ backgroundColor: 'white', padding: 0, paddingLeft: 10, paddingRight: 10 }}>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ marginLeft: '16px' }}>
                        {breadcrumbItems.map((item, index) => (
                            <Breadcrumb.Item key={index}>
                                {item.href ? (
                                    <Link href={item.href}>
                                        {item.title}
                                    </Link>
                                ) : (
                                    item.title
                                )}
                            </Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                </Col>
                <Col>
                    <Dropdown overlay={userMenu} trigger={['click']}>
                        <Avatar icon={<UserOutlined />} style={{ marginRight: '16px', cursor: 'pointer' }} />
                    </Dropdown>
                </Col>
            </Row>
        </Header>
    );
};

export default Navbar;