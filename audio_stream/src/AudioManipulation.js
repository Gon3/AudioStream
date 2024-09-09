let audioContext = null
let sourceNode = null; 
let gainNode = null; 
let filterNode = null;

const initFilters = () => {
    audioContext = new AudioContext();
    const myAudio = document.querySelector("audio");
    console.log(myAudio);
    sourceNode = audioContext.createMediaElementSource(myAudio);
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.75;

    filterNode = audioContext.createBiquadFilter();
    filterNode.type = 'lowpass'
    filterNode.frequency.value = 200; 

    sourceNode.connect(gainNode);
    gainNode.connect(filterNode);
    filterNode.connect(audioContext.destination);
}

const connectFilters = () => {
    if(!sourceNode)
        return initFilters();
    sourceNode.connect(gainNode);
    gainNode.connect(filterNode);
    filterNode.connect(audioContext.destination);
}

const disconnectFilters = () => {
    if(sourceNode){
        sourceNode.disconnect(gainNode);
        gainNode.disconnect(filterNode);
        filterNode.disconnect(audioContext.destination); 
    } 
}

export {connectFilters, disconnectFilters}; 