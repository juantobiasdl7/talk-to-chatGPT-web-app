import React, { useState, useRef } from 'react';

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');
    const [chatGPTAudioUrl, setChatGPTAudioUrl] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const uploadAudioToServer = async (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob);
    
        try {
            const response = await fetch('http://localhost:5000/v1/api/chat/process-audio', {
                method: 'POST',
                body: formData,
                // Don't set Content-Type header, let the browser set it
            });

            //const arrayBuffer = await response.arrayBuffer();
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            //console.log(arrayBuffer);
            console.log(audioBlob);

            setChatGPTAudioUrl(audioUrl);
            
            console.log("Front end response:" + audioUrl);
            // Handle the response data (transcription)
        } catch (error) {
            console.error('Error uploading audio:', error);
        }
    };
    
    
    const startRecording = async () => {
        try {
            setAudioUrl('');
            setChatGPTAudioUrl('');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.start();

            mediaRecorderRef.current.addEventListener('dataavailable', event => {
                audioChunksRef.current.push(event.data);
            });

            setIsRecording(true);
        } catch (err) {
            console.error('Error starting recording:', err);
        }
    };

    const stopRecording = () => {
        
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg-3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl);
            audioChunksRef.current = [];
            setIsRecording(false);
            uploadAudioToServer(audioBlob);
        });
    };

    return (
        <div className="container mx-auto p-8">
            <button 
                className={`bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={startRecording}
                disabled={isRecording}
            >
                Record
            </button>
            <button 
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2 ${!isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={stopRecording}
                disabled={!isRecording}
            >
                Stop
            </button>
            {audioUrl && <audio className="mt-4" controls src={audioUrl}></audio>}
            {chatGPTAudioUrl && <audio className="mt-4" controls autoPlay src={chatGPTAudioUrl}></audio>}
        </div>
    );
};

export default AudioRecorder;
