let audioContext = null; 

let sourceNode = null; 
let analyzer = null; 
let myReq = null; 

const setUpAnalyzer = (stream) => {
    //set up the analyzer
    audioContext = new AudioContext();
    sourceNode = audioContext.createMediaStreamSource(stream);
    analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 2048;
    sourceNode.connect(analyzer); 

    //set up the drawing
    const canvas = document.getElementById("waveform");
    const canvasCtx = canvas.getContext("2d");
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
        analyzer.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = "rgb(200 200 200)";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(0 0 0)";
      
        canvasCtx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * canvas.height) / 2;
        
            if (i === 0) {
              canvasCtx.moveTo(x, y);
            } else {
              canvasCtx.lineTo(x, y);
            }
        
            x += sliceWidth;
        }
        
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();

        myReq = requestAnimationFrame(draw);
    }

    draw(); //start the drawing
}

const resetAnalyzer = () => {
    if(myReq){
        cancelAnimationFrame(myReq);
        audioContext = null; 
        sourceNode = null;
        analyzer = null; 
        myReq = null; 
        const canvas = document.getElementById("waveform");
        const canvasCtx = canvas.getContext("2d");
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

export {setUpAnalyzer, resetAnalyzer};