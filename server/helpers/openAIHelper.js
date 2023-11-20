const OpenAI = require("openai");
const { Readable } = require('stream');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch-commonjs');

console.log('API Key:', process.env.OPENAI_API_KEY); // This should print out your actual API key

// Configure the OpenAI API client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.transcribeAudio = async (audioPath, reqFile) => {
    // Logic to transcribe audio using OpenAI's API
    // Placeholder for transcription logic
    try {

        let form = new FormData();        

        const newfile = fs.createReadStream(audioPath);

        newfile.on('open', () => {
            console.log('Stream opened:', audioPath);
        });
        
        newfile.on('error', (err) => {
            console.error('Error with stream:', audioPath, err);
        });
        
        newfile.on('ready', () => {
            console.log('Stream is ready:', audioPath);
        });

        form.append('file', newfile, {
            filename: reqFile.originalname,
        });
        form.append('model', 'whisper-1');
        

        const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            body: form,
            headers: {
                Authorization: "Bearer " + process.env.OPENAI_API_KEY,
            },
        });
        const data = await res.json(); // parses the response body as JSON
        console.log(data);

        
        
        return res
        } catch (error) {
            console.log("This is the error.")
            console.error(error.response ? error.response.data : error.message);
            throw new Error(error);
        }
}
        // // Assuming OpenAI provides an endpoint for Whisper
        // const response = await openai.audio.transcriptions.create({
        //     audio: audioStream,
        //     model: "whisper-1",
        //     // Other necessary options
        // });

        // return response.transcription.text;
    // } catch (error) {
    //     console.error('Error in transcribing audio:', error);
    //     throw error;
    // }
//};

// exports.getChatResponse = async (transcription) => {
//     // Logic to send the transcription to OpenAI and get a chat response
//     // Placeholder for chat response logic
// };

// exports.textToAudio = async (text) => {
//     // Logic to convert text to audio using OpenAI's API or another service
//     // Placeholder for text-to-audio logic
// };

