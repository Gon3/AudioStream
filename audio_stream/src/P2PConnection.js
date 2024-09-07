//handles all functions pertaining to peer object
import Peer from 'peerjs'

let peer = null;
let localStream = null;
let remoteStream = null;

const initializePeer = (userId, callback) => {
    peer = new Peer(userId);//create peer object

    peer.on('open', (id) => { 
        console.log('My peer ID is: ' + id);
    });

    peer.on('call', (call) => { //handle any incoming calls
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

const makeCall = (userId, callback) => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        localStream = stream; 
        const call = peer.call(userId, stream); //how will we continue to send localstream
        call.on('stream', (remoteAudioStream) => {
            remoteStream = remoteAudioStream;
            callback(remoteAudioStream); //send audio stream from remote peer
        })
    })
}

const getLocalStream = () => localStream;
const getRemoteStream = () => remoteStream;

export {initializePeer, makeCall, getLocalStream, getRemoteStream};