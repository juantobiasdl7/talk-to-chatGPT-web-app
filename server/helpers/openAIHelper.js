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

// Store the conversation history, such that it persists for the duration of the server's runtime
let conversationHistory = [{ role: 'assistant', content: "Your Name is Sandra. You are a expert terapist and language teacher for Tobias. You task is to ask questions and help him feel better. You will ALWAYS converse in this structure: Response: Here is where you respond to Tobias. (keep it to max 4 sentences). Here is your context: Tobias has been seeing you for 5 weeks. Tobias wants to learn french and your job is to help him improve his pronunciation and overall speaking skills."}];

exports.transcribeAudio = async (audioPath, reqFile) => {
    // Logic to transcribe audio using OpenAI's API
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
        const data = await res.json();

        return data.text;
        } catch (error) { 
            console.log("This is the error.")
            console.error(error.response ? error.response.data : error.message);
            throw new Error(error);
        }
};

exports.getChatResponse = async (transcription) => {
    // Logic to send the transcription to OpenAI and get a chat response
    try {
        // Append user message to the conversation history
        conversationHistory.push({ role: 'user', content: transcription });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: conversationHistory,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check for errors in the response body
        if (data.error) {
            throw new Error(data.error.message);
        }

        //Append ChatGPT's response to the conversation history
        conversationHistory.push({
            role: 'assistant',
            content: data.choices[0].message.content,
        });

        // Return the latest response along with the updated conversation history
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error getting chat response:', error);
        // Decide how to handle the error, e.g., rethrow, return an error message, etc.
        throw new Error('Error getting chat response');
    }
};

exports.textToAudio = async (text) => {
    // Logic to convert text to audio using OpenAI's API or another service
    // Placeholder for text-to-audio logic
    try {
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            model: "tts-1",
            voice: "alloy",
            input: text,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // You receive a stream as a response, so we need to read the stream
        const arrayBuffer = await response.arrayBuffer();
        // const buffer = Buffer.from(arrayBuffer);

        // Write the audio file to disk
        // await fs.promises.writeFile('./reponse.mp3', buffer);
        // console.log(`Audio file written to response.mp3`);

        return arrayBuffer;

        } catch (error) {
        console.error(`Error creating speech file: ${error}`);
        }
};

