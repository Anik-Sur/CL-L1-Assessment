import { Layout as AntLayout } from 'antd';
import { useRouter } from 'next/router';
import Navbar from './NavBar';

const { Content } = AntLayout;

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { pathname } = useRouter();

    // Determine whether to show the Navbar based on the current route
    const showNavbar = !['/signup', '/login'].includes(pathname);

    return (
        <AntLayout>
            {showNavbar && <Navbar />}
            <Content style={{ padding: '16px', height: '91.8vh' }}>
                {children}
            </Content>
        </AntLayout>
    );
};

export default Layout;