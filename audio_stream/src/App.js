import React, { useState, useEffect, useRef } from 'react';
import { initializePeer, makeCall, switchInput } from './P2PConnection';
import './App.css';

function App() {

  const [userId, setUserId] = useState('');
  const [peerId, setPeerId] = useState('');
  const [output, setOutput] = useState("default");
  const [input, setInput] = useState("default");
  const [outputs, setOutputs] = useState([]);
  const [inputs, setInputs] = useState([]);  
  const [peerInit, setPeerInit] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const remoteAudioRef = useRef(null);

  useEffect(() => { //set up audio outputs and inputs
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

  const handleInputChange = (e) => {
    setInput(e.target.value); 
    switchInput(e.target.value, (stream) => { //set up media stream callback
      remoteAudioRef.current.srcObject = stream
      setCallActive(true);
    });
  }

  const handleOutputChange = (e) => {
    setOutput(e.target.value);
    if(remoteAudioRef.current){
      remoteAudioRef.current.setSinkId(e.target.value);
      setCallActive(true);
    }
  }

  const handleID = () => {
    initializePeer(userId, input, (stream) => { //set up media stream callback
      remoteAudioRef.current.srcObject = stream
      setCallActive(true);
    });
    setPeerInit(true); 
  }
  
  const handleCall = () => {
    makeCall(peerId, input, (stream) => { //set up media stream callback
      remoteAudioRef.current.srcObject = stream
      setCallActive(true);
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
      <button onClick={handleID}>Enter</button>
      <br/>
      <input
        placeholder='Enter ID to connect to'
        value={peerId}
        onChange={(e) => setPeerId(e.target.value)}
        disabled={callActive}
      />
      <button onClick={handleCall} disabled={callActive || !peerInit}>Call</button>
      <br />

      <label>
        Set audio input:
      </label>
      <select value={input} onChange={handleInputChange}>
        {inputs}
      </select>
  
      <br />
      <label>
        Set audio output:
      </label>
      <select value={output} onChange={handleOutputChange}>
        {outputs}
      </select>

      <audio ref={remoteAudioRef} autoPlay></audio>
    </div>
  );
}

export default App;
