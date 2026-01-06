import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import PropTypes from 'prop-types';

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src); 
      hls.attachMedia(videoRef.current); 
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play().catch(e => console.log("Cần tương tác để phát video tự động"));
      });

      return () => {
        hls.destroy(); 
      };
    } 
    else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = src;
      videoRef.current.addEventListener('loadedmetadata', () => {
        videoRef.current.play();
      });
    }
  }, [src]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <video 
        ref={videoRef} 
        controls 
        style={{ width: '80%', maxWidth: '800px', backgroundColor: 'black' }} 
      />
      <p>Đang phát: {src}</p>
    </div>
  );
};

export default VideoPlayer;