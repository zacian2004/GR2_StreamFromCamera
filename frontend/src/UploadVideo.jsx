import React, { useState } from 'react';
import axios from 'axios';

const UploadVideo = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Vui lòng chọn file video!");
      return;
    }

    const formData = new FormData();
    formData.append('video', file); 
    setUploading(true);
    setMessage("Đang upload và xử lý video... (Vui lòng đợi)");

    try {
      const res = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setMessage("Upload thành công!");
        onUploadSuccess(res.data.streamUrl); 
      }
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px dashed #007bff', borderRadius: '8px' }}>
      <h3>Upload Video (Demo)</h3>
      <input type="file" accept="video/mp4" onChange={handleFileChange} />
      
      <button 
        onClick={handleUpload} 
        disabled={uploading}
        style={{ marginLeft: '10px', padding: '5px 15px', cursor: 'pointer' }}
      >
        {uploading ? 'Đang xử lý...' : 'Upload & Convert'}
      </button>
      
      {message && <p style={{ marginTop: '10px', color: uploading ? 'blue' : 'green' }}>{message}</p>}
    </div>
  );
};

export default UploadVideo;