import { pipeline, env } from '@huggingface/transformers';

// Configure hugging face environment
env.allowLocalModels = false;
env.useBrowserCache = false;

// Cached transcriber instance so we don't reload the model every time
let _asr = null;

/**
 * Loads and returns the automatic speech recognition (ASR) pipeline.
 *
 * @returns - The ASR pipeline function you can call with audio data.
 */
export async function getTranscriber() {
  if (!_asr) {
    _asr = await pipeline("automatic-speech-recognition", "Xenova/whisper-base.en");
  }
  return _asr;
}