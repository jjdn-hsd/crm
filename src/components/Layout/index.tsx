import { useState } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Header, Sider, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    return <>{children}</>;
  }

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/customers',
      icon: <TeamOutlined />,
      label: <Link to="/customers">Customers</Link>,
    },
    {
      key: '/deals',
      icon: <DollarOutlined />,
      label: <Link to="/deals">Deals</Link>,
    },
    {
      key: '/activities',
      icon: <CalendarOutlined />,
      label: <Link to="/activities">Activities</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      onClick: signOut,
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <AntLayout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
            {collapsed ? (
              <MenuUnfoldOutlined onClick={() => setCollapsed(false)} />
            ) : (
              <MenuFoldOutlined onClick={() => setCollapsed(true)} />
            )}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{profile?.full_name}</span>
                <Avatar icon={<UserOutlined />} src={profile?.avatar_url} />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
}