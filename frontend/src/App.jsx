import React, { useState } from 'react';
import Login from './Login';
import VideoPlayer from './VideoPlayer';
import UploadVideo from './UploadVideo';

function App() {
  const [user, setUser] = useState(null);

  const [streamUrl, setStreamUrl] = useState("http://localhost:8888/live/index.m3u8");

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

          <main style={{ padding: '20px' }}>
            {/* --- KHU VỰC PHÁT VIDEO --- */}
            <div style={{ marginBottom: '30px' }}>
              <h3>Màn hình chính</h3>
              {/* Truyền streamUrl động vào Player */}
              <VideoPlayer src={streamUrl} />
            </div>
            
            <hr />

            {/* --- KHU VỰC UPLOAD --- */}
            <UploadVideo onUploadSuccess={(newUrl) => {
              setStreamUrl(newUrl);
              alert("Đã chuyển sang phát video vừa upload!");
            }} />
            
            <div style={{ marginTop: '20px' }}>
               <button onClick={() => setStreamUrl("http://localhost:8888/live/index.m3u8")}>
                 Quay về xem Live Stream (OBS)
               </button>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;