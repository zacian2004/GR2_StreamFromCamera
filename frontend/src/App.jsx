import React, { useState } from 'react';
import { Layout, Menu, Button, theme, message, Typography, Avatar } from 'antd';
import { 
  VideoCameraOutlined, 
  UploadOutlined, 
  UserOutlined, 
  LogoutOutlined,
  PlayCircleOutlined 
} from '@ant-design/icons';
import Login from './Login';
import VideoPlayer from './VideoPlayer';
import UploadVideo from './UploadVideo';
const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const [user, setUser] = useState(null);
  const [streamUrl, setStreamUrl] = useState("http://localhost:8888/live/index.m3u8");
  const [currentView, setCurrentView] = useState('live');
  const { 
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleUploadSuccess = (newUrl) => {
    setStreamUrl(newUrl);
    setCurrentView('live');
    message.success('Upload thành công! Đang phát video mới.');
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
        {/* Truyền message của AntD vào để Login dùng nếu muốn sửa Login sau này */}
        <Login onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          message.success(`Xin chào, ${loggedInUser.username || 'User'}!`);
        }} />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 1. THANH MENU BÊN TRÁI */}
      <Sider collapsible breakpoint="lg">
        <div className="demo-logo-vertical" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '6px' }} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentView]}
          onClick={(e) => setCurrentView(e.key)}
          items={[
            {
              key: 'live',
              icon: <PlayCircleOutlined />,
              label: 'Xem Live Stream',
            },
            {
              key: 'upload',
              icon: <UploadOutlined />,
              label: 'Upload Video',
            },
          ]}
        />
      </Sider>

      <Layout>
        {/* 2. THANH HEADER TRÊN CÙNG */}
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>HUST Stream Platform</Title>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar icon={<UserOutlined />} />
              <strong>{user.username || user}</strong>
            </span>
            <Button 
              type="primary" 
              danger 
              icon={<LogoutOutlined />} 
              onClick={() => {
                setUser(null);
                message.info('Đã đăng xuất');
              }}
            >
              Thoát
            </Button>
          </div>
        </Header>

        {/* 3. KHU VỰC NỘI DUNG CHÍNH */}
        <Content style={{ margin: '24px 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* Logic hiển thị nội dung dựa trên Menu đang chọn */}
            {currentView === 'live' && (
              <div style={{ textAlign: 'center' }}>
                <Title level={3}>Màn hình Live Stream</Title>
                <VideoPlayer src={streamUrl} />
                <div style={{ marginTop: 20 }}>
                  <Button type="dashed" onClick={() => setStreamUrl("http://localhost:8888/live/index.m3u8")}>
                    Reset về luồng OBS gốc
                  </Button>
                </div>
              </div>
            )}

            {currentView === 'upload' && (
              <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <Title level={3} style={{ textAlign: 'center' }}>Upload Video Mới</Title>
                <UploadVideo onUploadSuccess={handleUploadSuccess} />
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;