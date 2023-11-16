const OpenAI = require("openai");
const { Readable } = require('stream');

console.log('API Key:', process.env.OPENAI_API_KEY); // This should print out your actual API key


// Configure the OpenAI API client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const bufferToStream = (buffer) => {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // Signifies the end of the stream
    return stream;
};

exports.transcribeAudio = async (audioBuffer) => {
    // Logic to transcribe audio using OpenAI's API
    // Placeholder for transcription logic
    try {

        const audioStream = bufferToStream(audioBuffer.buffer);

        // Assuming OpenAI provides an endpoint for Whisper
        const response = await openai.whisper.transcribe({
            audio: audioStream,
            model: "whisper-1",
            // Other necessary options
        });

        return response.transcription.text;
    } catch (error) {
        console.error('Error in transcribing audio:', error);
        throw error;
    }
};

// exports.getChatResponse = async (transcription) => {
//     // Logic to send the transcription to OpenAI and get a chat response
//     // Placeholder for chat response logic
// };

// exports.textToAudio = async (text) => {
//     // Logic to convert text to audio using OpenAI's API or another service
//     // Placeholder for text-to-audio logic
// };

