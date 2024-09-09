//handles all functions pertaining to peer object
import Peer from 'peerjs'

let peer = null;
let call = null; 
let localStream = null;
let remoteStream = null;
let handleCall = null; 

const replaceCallListener = (inputId, callback) => {//helper function for replacing call event listener of peer object for input switch
    if(peer){
        if(handleCall) peer.off('call', handleCall);
        handleCall = (incoming) => { //what to do when receiving calls
            if(call) call.close();
            call = incoming; 
            navigator.mediaDevices.getUserMedia({audio: {deviceId: {exact: inputId}}}).then((stream) => { //get stream from current audio input (microphone)
                localStream = stream; 
                //console.log(stream.getTracks());
                incoming.answer(stream);
                incoming.on('stream', (remoteAudioStream) => {
                    remoteStream = remoteAudioStream;
                    callback(remoteAudioStream); //send audio stream from remote peer
                });
                incoming.on('close', () => {
                    disconnectPeer();
                    callback(null);
                });
            }); 
            //console.log(call);
        };
        peer.on('call', handleCall); 
    }
}

const switchInput = (inputId, callback) => {
    replaceCallListener(inputId, callback); 
    if(call){
        let newId = call.peer;
        call.close();
        makeCall(newId, inputId, callback); 
    }
}

const initializePeer = (userId, inputId, callback) => {
    peer = new Peer(userId);//create peer object

    peer.on('open', (id) => { 
        console.log('My peer ID is: ' + id);
    });

    replaceCallListener(inputId, callback); //set the call eventlister to respond to incoming calls
}

const makeCall = (userId, inputId, callback) => { //what to do when initiating call
    navigator.mediaDevices.getUserMedia({audio: {deviceId: {exact: inputId}}}).then((stream) => {
        localStream = stream; 
        //console.log(inputId);
        //console.log(stream.getTracks());
        call = peer.call(userId, stream); 
        call.on('stream', (remoteAudioStream) => {
            remoteStream = remoteAudioStream;
            callback(remoteAudioStream); //send audio stream from remote peer
        });
        call.on('close', () => {
            disconnectPeer();
            callback(null);
        });
    }).catch(err => console.log(err));
}

const disconnectPeer = () => {
    //if(peer) peer.disconnect(); 
    if(call){ call.close(); call = null;}
}

const getLocalStream = () => localStream;
const getRemoteStream = () => remoteStream;

export {initializePeer, makeCall, switchInput, disconnectPeer, getLocalStream, getRemoteStream};