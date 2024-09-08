//handles all functions pertaining to peer object
import Peer from 'peerjs'

let peer = null;
let localStream = null;
let remoteStream = null;

const setInputOnCall = (inputId, callback) => {
    if(peer){
       peer.on('call', (call) => { //what to do when receiving calls
        console.log(inputId);
            navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => { //get stream from current audio input (microphone)
                localStream = stream; 
                call.answer(stream);
                call.on('stream', (remoteAudioStream) => {
                    remoteStream = remoteAudioStream;
                    callback(remoteAudioStream); //send audio stream from remote peer
                })
            })  
        }) 
    }
}

const initializePeer = (userId, inputId, callback) => {
    peer = new Peer(userId);//create peer object

    peer.on('open', (id) => { 
        console.log('My peer ID is: ' + id);
    });

    setInputOnCall(inputId, callback); 
}

const makeCall = (userId, inputId, callback) => { //what to do when initiating call
    navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
        localStream = stream; 
        const call = peer.call(userId, stream); 
        call.on('stream', (remoteAudioStream) => {
            remoteStream = remoteAudioStream;
            callback(remoteAudioStream); //send audio stream from remote peer
        })
    })
}



const getLocalStream = () => localStream;
const getRemoteStream = () => remoteStream;

export {initializePeer, makeCall, setInputOnCall, getLocalStream, getRemoteStream};