const fs = require('fs');
const speech = require('@google-cloud/speech').v1p1beta1;

const client = new speech.SpeechClient();

export default async function STT(audioBytes: string) {
    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        content: audioBytes,
    };
    // these config could be different from one audio type to another
    const config = {
        audioChannelCount: 1,
        encoding: 'AMR_WB',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
    };
    const request = {
        audio,
        config,
    };

    // Detects speech in the audio file
    const [operation] = await client.longRunningRecognize(request);
    const [response] = await operation.promise();

    console.log(response);

    response.results
        .map((result: any) => console.log(result.alternatives[0]))
        .join('\n');

    const data = response.results[0].alternatives[0];

    const words = data.transcript.split(" ");

    console.log(words);

    return {
        words,
        confidence: data.confidence
    }
}