import React, { useState, useEffect, useRef } from 'react';
import { initializePeer, makeCall } from './P2PConnection';
import './App.css';

function App() {
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [userId, setUserId] = useState('');
  const remoteAudioRef = useRef(null);

  useEffect(() => {
    if (remoteStream && remoteAudioRef.current) {
      //console.log(remoteStream);
      remoteAudioRef.current.srcObject = remoteStream //plug stream into audio element  
    }
  }, [remoteStream]);

  const handleEnter = () => {
    initializePeer(userId, (stream) => {
      setRemoteStream(stream);
    });
  }

  const handleCall = () => {
    makeCall(peerId, (stream) => {
      setRemoteStream(stream);
    });
  };

  return (
    <div className="App">
      <h1>Audio Streamer</h1>
      <input
        placeholder='Enter your ID'
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleEnter}>Enter</button>
      <br/>
      <input
        placeholder='Enter ID to connect to'
        value={peerId}
        onChange={(e) => setPeerId(e.target.value)}
        disabled={remoteStream}
      />
      <button onClick={handleCall} disabled={remoteStream}>Call</button>
      <audio ref={remoteAudioRef} autoPlay></audio>
    </div>
  );
}

export default App;
