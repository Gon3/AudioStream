let audioContext = null
let sourceNode = null; 
let gainNode = null; 
let filterNode = null;
let destNode = null;

const initFilters = (stream) => {
    audioContext = new AudioContext();
    sourceNode = audioContext.createMediaStreamSource(stream);
    destNode = audioContext.createMediaStreamDestination();
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.75;

    filterNode = audioContext.createBiquadFilter();
    filterNode.type = 'lowpass'
    filterNode.frequency.value = 200; 
}

const connectFilters = (stream) => { 
    console.log(sourceNode);
    if(!sourceNode)
        initFilters(stream);
    sourceNode.connect(gainNode);
    gainNode.connect(filterNode);
    filterNode.connect(destNode);
    return destNode.stream; 
}

const disconnectFilters = () => {
    if(sourceNode){
        sourceNode.disconnect(gainNode);
        gainNode.disconnect(filterNode);
        filterNode.disconnect(destNode); 
        sourceNode.connect(destNode); 
    }
}

const resetNodes = () => {
    audioContext = null; 
    sourceNode = null;
    gainNode = null; 
    filterNode = null;
    destNode = null;
}

export {connectFilters, disconnectFilters, resetNodes}; 