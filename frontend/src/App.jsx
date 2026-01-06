import React, { useState } from 'react';
import Login from './Login';
import VideoPlayer from './VideoPlayer';

function App() {
  const [user, setUser] = useState(null);

  const streamUrl = "http://localhost:8888/live/index.m3u8";

  return (
    <div className="App">
      {!user ? (
        <Login onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />
      ) : (
        <div>
          <header style={{ padding: '20px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>HUST Stream Dashboard</h1>
            <div>
              <span>Xin chào, <b>{user.username || user}</b>! </span>
              <button onClick={() => setUser(null)} style={{ marginLeft: '10px' }}>Đăng xuất</button>
            </div>
          </header>

          <main>
            <h3>Live Stream từ Camera/OBS</h3>
            {/* Truyền link stream vào Player */}
            <VideoPlayer src={streamUrl} />
            
            <div style={{ margin: '20px', padding: '20px', border: '1px dashed #aaa' }}>
              <h4>Khu vực Upload Video (Tính năng sắp tới)</h4>
              <p>Chức năng upload file sẽ được xây dựng ở bước tiếp theo...</p>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;