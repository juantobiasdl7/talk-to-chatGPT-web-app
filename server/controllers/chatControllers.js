const openAIHelper = require('../helpers/openAIHelper');
const fs = require('fs');
// const audioHelper = require('../helpers/audioHelper');

exports.processAudio = async (req, res) => {
    try {
        // This function would handle the uploaded audio file and saved it to the server
            // req.file contains the audio file
        const audioBuffer = req.file.buffer;
        const audioPath = 'C:/Users/juant/Desktop/Projects/Talk to ChatGPT Web App/server/audio_uploads/audio.mp3';

        // Save the buffer to a file
        fs.writeFile(audioPath, audioBuffer, (err) => {
            if (err) {
                console.log('Error saving audio:', err);
                console.error('Error saving audio:', err);
            }
            console.log('Audio saved successfully');
        });

        
        // send it to OpenAI for transcription, get the chat response,
        // generate the audio from the text response, and return it to the client.
        const transcription = await openAIHelper.transcribeAudio(audioPath, req.file); // You'll need to set up file handling middleware like 'multer'.

        console.log('Transcription:', transcription);
        
        const response = await openAIHelper.getChatResponse(transcription);

        console.log('Response:', response);
        // const audioResponse = await openAIHelper.textToAudio(response);
        
        // Send back the audio response as a file or a buffer
        res.status(200).send(transcription);
    } catch (error) {
        console.error('Error processing audio:', error);
        res.status(500).send('An error occurred while processing the audio.');
    }
};
