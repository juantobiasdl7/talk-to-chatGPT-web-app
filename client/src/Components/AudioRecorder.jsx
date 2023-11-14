import React, { useState, useRef } from 'react';

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
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
        </div>
    );
};

export default AudioRecorder;
