const speech = require('@google-cloud/speech');

async function audioRecognition(base64) {

    const client = new speech.SpeechClient();

    let text = '';

    try {

        const audio = {
            content: base64
        };

        const config = {
            encoding: 'OGG_OPUS',
            enableAutomaticPunctuation: true,
            sampleRateHertz: 16000,
            languageCode: 'pt-BR',
        };

        const request = {
            audio: audio,
            config: config,
        };

        const [response] = await client.recognize(request);

        text = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        console.log(text);

    } catch (err) {
        console.error('ERROR:', err);
    }

    return text;
}

module.exports = audioRecognition;