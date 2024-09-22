# AudioStream

### To run the app just use the npm start command while in the audio_stream directory
> **_IMPORTANT NOTE:_** When running the app, please make sure you are using the Google Chrome browser. This is because with the way I set up the use of the Media Streams and Capture libary, this app will only work if you run it on chrome. On any other browser the app will crash or be unresponsive.

## Simple Instructions to Use the App
1. Enter the ID that you want to use in the first input.
2. Click the **Enter** button next to the input to create your peer object.
3. Enter the ID that you want to connect to in the second input.
4. After these steps are done the **Call** button next to the input should be available now, click it to initiate the call.
5. Use the following **Set Audio Input** and **Set Audio Output** dropdowns to configure your audio input and output. 

## Brief Explanation of Approach:
The first thing I figured I would have to do is to establish some sort of P2P (peer to peer) connection in order to stream audio between two users. After some research, I settled on using the peerjs library as it simplified a lot of the WebRTC stuff for me in order to configure a P2P connection. I also made sure all the P2P connection logic was in a seperate file for modularity. I set up the peer object with an event listener to handle any incoming calls as well as make a method that is responsible for intiating calls that I will use in the frontend code. After setting up that, I got to coding a very simple frontend to interface this function. I ask the user to input what they want their own ID to be, then to input the id that they would want to connect to, and finally they can click the **Call** button to initiate the P2P connection. Once I got this working, I added audio input and output configurations using the Media Streams and Capture javascript library. I simply polled the enumerateDevices method to get all the output and input devcie labels and ids that I can use to set up the dropdown menus for input and output configuration once you load in the page (all of this accomplished by a simple useEffect hook + useState). Once all of this was working I decided to add a disconnect button for disconnect functionality, so that it wouldn't be a hassle to close the connection and perhaps reconnect or start a new one. For the waveform visuals I used a canvas element to broadcast waveform data that I fed into it using an audio analyzer from the Web Audio API on the remote media stream. 

## Some Challenges
The first challenge I ran into was getting the input selection to work. I realized that I had to tinker around with the a lot connection more than the output since the input 
is captured using a mediastream sent to the remote peer. I first tried just changing the event listener of the peer object to just use a different input for the stream but this
didn't work, in fact it wasn't even changing the event listener. I realized that I cannot alter a stream once it is sent to the peer, so I would have to close the current connection, make a new connection with a stream relating to the new input and send it back to the peer. I also would still need to change the event listener to use the new input
when receiving calls. I realized for the event listener that I had to use the off method to first unload the old listener and then install the new one with on again. I aslo can use arrow functions with this method as there needs to be an identifier in order for the method to know which event listener to remove so I set a variable to hold the function instead. After all these changes, I was able to get audio input configuration to finally work.

Another challenge I ran into was trying to do the second step of this exercise: basic audio manipulation with setting a filter for the gain and frequency. I first tried to manipulate the stream when it came into the receiver but I realized that doing it this way interrupts the connection, as altering the stream creates a new one that isn't connected to the peer which sent it. So I then switched to manipulating the audio from the html audio element, but this also didn't work. I eventually figured that it was never going to work as I was attempting to do audio manipulation on the audio element, which probably did not change the output of the mediastream that it was sourcing. This left me with one last option:  alter the stream on the other peer's side and make a new connection to send the stream. So I tried this way and it finally worked out. The one caveat with this method is that the filter will be toggling the audio you are sending rather than the audio that is coming in but I couldn't figure out from the instructions which way the audio should be filtered so for what the assignment entails, I believe this to be good enough. 

## Technologies used:
- react
- peerjs
- Web Audio API 
- Media Streams and Capture API