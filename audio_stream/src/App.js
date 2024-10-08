import React, { useState, useEffect, useRef } from 'react';
import { initializePeer, makeCall, switchInput , disconnectPeer} from './P2PConnection';
//import { connectFilters, disconnectFilters} from './AudioManipulation';
import {setUpAnalyzer, resetAnalyzer} from './StreamAnalyzer'; 
import './App.css';

function App() {
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [userId, setUserId] = useState('');
  const [output, setOutput] = useState("default");
  const [input, setInput] = useState("default");
  const [outputs, setOutputs] = useState([]);
  const [inputs, setInputs] = useState([]);  
  const [peerInit, setPeerInit] = useState(false);
  const [filter, setFilter] = useState(false); 
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

  useEffect(() => { //set up media stream
    resetAnalyzer();
    if (remoteStream && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream; 
      //do stream analyzer stuff
      setUpAnalyzer(remoteStream); 
    }
  }, [remoteStream]);

  const handleInputChange = (e) => {
    setInput(e.target.value); 
    switchInput(e.target.value, filter, (stream) => {
      setRemoteStream(stream);
    });
  }

  const handleOutputChange = (e) => {
    setOutput(e.target.value);
    if(remoteAudioRef.current){
      remoteAudioRef.current.setSinkId(e.target.value);
    }
  }

  const handleID = () => {
    initializePeer(userId, input, filter, (stream) => {
      setRemoteStream(stream);
    });
    setPeerInit(true); 
  }
  
  const handleCall = () => {
    makeCall(peerId, input, filter, (stream) => {
      setRemoteStream(stream);
    });
  };

  const handleDisconnect = () => {
    disconnectPeer();
    setRemoteStream(null);
  }

  const handleFilterToggle = () => {
    setFilter(!filter); 
    switchInput(input, !filter, (stream) => {
      setRemoteStream(stream);
    });
  }

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
        disabled={remoteStream}
      />
      <button onClick={handleCall} disabled={remoteStream || !peerInit || peerId === ''}>Call</button>
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
      <br />
      <input type="checkbox" id="toggleFilter" name="toggleFilter" value={filter} onChange={handleFilterToggle}/>
      <label for="toggleFilter"> Toggle Filter</label> 
      <br />
      {remoteStream && <button onClick={handleDisconnect} >Disconnect</button>}
      <audio ref={remoteAudioRef} autoPlay></audio>
      <br/>
      <canvas id="waveform" width={800} height={400} style={{ border: '1px solid black' }}/>
    </div>
  );
}

export default App;
