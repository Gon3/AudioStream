import React, { useState, useEffect, useRef } from 'react';
import { initializePeer, makeCall, setInputOnCall } from './P2PConnection';
import './App.css';

function App() {
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [userId, setUserId] = useState('');
  const [output, setOutput] = useState("default");
  const [input, setInput] = useState("default");
  const [outputs, setOutputs] = useState([]);
  const [inputs, setInputs] = useState([]);  
  const remoteAudioRef = useRef(null);

  useEffect(() => {
    let outputsArr = []; 
    let inputsArr = [];
    navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        if(device.kind === "audiooutput"){
          //console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
          outputsArr.push(<option key={device.deviceId} value={device.deviceId}>
            {device.deviceId === "default" ? "Default - " : "" + device.label}
          </option>);
        } else if (device.kind === "audioinput"){
          inputsArr.push(<option key={device.deviceId} value={device.deviceId}>
            {device.deviceId === "default" ? "Default - " : "" + device.label}
          </option>);
        }
        
        });
        setOutputs(outputsArr); 
        setInputs(inputsArr)
    });
  }, []);

  useEffect(() => {
    initializePeer(userId, input, (stream) => {
      setRemoteStream(stream);
    });
  }, [userId]);

  useEffect(() => {
    if (remoteStream && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream //plug stream into audio element  
    }
  }, [remoteStream]);

  useEffect(() => {
    setInputOnCall(input, (stream) => {
      setRemoteStream(stream);
    });
  }, [input]);

  useEffect(() => {
    if(remoteAudioRef.current){
      remoteAudioRef.current.setSinkId(output);
    }
  }, [output]);

  const handleCall = () => {
    makeCall(peerId, input, (stream) => {
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
      <br/>
      <input
        placeholder='Enter ID to connect to'
        value={peerId}
        onChange={(e) => setPeerId(e.target.value)}
        disabled={remoteStream}
      />
      <button onClick={handleCall} disabled={remoteStream}>Call</button>
      <br />

      <label>
        Set audio input:
      </label>
      <select value={input} onChange={(e) => setInput(e.target.value)}>
        {inputs}
      </select>
     
      <br />
      <label>
        Set audio output:
      </label>
      <select value={output} onChange={(e) => setOutput(e.target.value)}>
        {outputs}
      </select>

      <audio ref={remoteAudioRef} autoPlay></audio>
    </div>
  );
}

export default App;
