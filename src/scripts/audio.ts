// Audio module for retro music and keyboard sounds

let audioContext: AudioContext | null = null;
let musicGainNode: GainNode | null = null;
let isMusicPlaying = false;
let musicInterval: number | null = null;
let currentNoteIndex = 0;
let soundEffectsEnabled = true;

// Mellow ambient melody - slow and dreamy
const melody = [
  // Phrase 1 - gentle opening
  { note: 'E4', duration: 1.0 },
  { note: 'G4', duration: 0.75 },
  { note: 'A4', duration: 1.25 },
  { note: 'rest', duration: 0.5 },
  { note: 'B4', duration: 1.0 },
  { note: 'A4', duration: 0.75 },
  { note: 'G4', duration: 1.5 },
  { note: 'rest', duration: 0.75 },
  // Phrase 2 - rising
  { note: 'E4', duration: 0.75 },
  { note: 'G4', duration: 0.75 },
  { note: 'B4', duration: 1.25 },
  { note: 'C5', duration: 1.5 },
  { note: 'rest', duration: 0.5 },
  { note: 'B4', duration: 1.0 },
  { note: 'G4', duration: 1.25 },
  { note: 'rest', duration: 0.75 },
  // Phrase 3 - contemplative
  { note: 'D4', duration: 1.0 },
  { note: 'E4', duration: 1.25 },
  { note: 'G4', duration: 1.5 },
  { note: 'rest', duration: 0.5 },
  { note: 'A4', duration: 1.0 },
  { note: 'G4', duration: 0.75 },
  { note: 'E4', duration: 2.0 },
  { note: 'rest', duration: 1.0 },
  // Phrase 4 - resolution
  { note: 'G4', duration: 1.0 },
  { note: 'A4', duration: 0.75 },
  { note: 'B4', duration: 1.25 },
  { note: 'A4', duration: 1.0 },
  { note: 'rest', duration: 0.5 },
  { note: 'G4', duration: 1.5 },
  { note: 'E4', duration: 2.0 },
  { note: 'rest', duration: 1.5 },
  // Phrase 5 - ethereal ascent
  { note: 'C5', duration: 1.0 },
  { note: 'B4', duration: 0.75 },
  { note: 'A4', duration: 1.25 },
  { note: 'rest', duration: 0.5 },
  { note: 'G4', duration: 1.0 },
  { note: 'A4', duration: 0.75 },
  { note: 'B4', duration: 1.5 },
  { note: 'rest', duration: 0.75 },
  // Phrase 6 - soaring
  { note: 'D5', duration: 1.5 },
  { note: 'C5', duration: 1.0 },
  { note: 'B4', duration: 1.25 },
  { note: 'rest', duration: 0.5 },
  { note: 'A4', duration: 1.0 },
  { note: 'G4', duration: 0.75 },
  { note: 'E4', duration: 1.5 },
  { note: 'rest', duration: 0.75 },
  // Phrase 7 - reflective
  { note: 'A4', duration: 1.0 },
  { note: 'B4', duration: 1.25 },
  { note: 'C5', duration: 1.5 },
  { note: 'rest', duration: 0.5 },
  { note: 'B4', duration: 1.0 },
  { note: 'A4', duration: 0.75 },
  { note: 'G4', duration: 2.0 },
  { note: 'rest', duration: 1.0 },
  // Phrase 8 - peaceful return
  { note: 'E4', duration: 1.0 },
  { note: 'G4', duration: 1.25 },
  { note: 'A4', duration: 1.5 },
  { note: 'G4', duration: 1.0 },
  { note: 'rest', duration: 0.5 },
  { note: 'E4', duration: 1.5 },
  { note: 'D4', duration: 2.0 },
  { note: 'rest', duration: 1.5 },
];

// Slow bass line
const bassLine = [
  { note: 'E2', duration: 2.0 },
  { note: 'A2', duration: 2.0 },
  { note: 'D2', duration: 2.0 },
  { note: 'G2', duration: 2.0 },
  { note: 'C3', duration: 2.0 },
  { note: 'G2', duration: 2.0 },
  { note: 'A2', duration: 2.0 },
  { note: 'E2', duration: 2.0 },
  { note: 'C3', duration: 2.0 },
  { note: 'D2', duration: 2.0 },
  { note: 'G2', duration: 2.0 },
  { note: 'A2', duration: 2.0 },
  { note: 'E2', duration: 2.0 },
  { note: 'G2', duration: 2.0 },
  { note: 'D2', duration: 2.0 },
  { note: 'E2', duration: 2.0 },
];

// Note frequencies
const noteFrequencies: Record<string, number> = {
  'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
};

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
    musicGainNode = audioContext.createGain();
    musicGainNode.gain.value = 0.15;
    musicGainNode.connect(audioContext.destination);
  }
  return audioContext;
}

function playNote(frequency: number, duration: number, type: OscillatorType = 'sine', gain: number = 0.12, delay: number = 0) {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // Add a filter for warmth
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 2000;
  filter.Q.value = 0.5;

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  // Soft attack and release for mellow sound
  const attackTime = 0.08;
  const releaseTime = duration * 0.3;

  gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + attackTime);
  gainNode.gain.setValueAtTime(gain, ctx.currentTime + delay + duration - releaseTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(musicGainNode!);

  oscillator.start(ctx.currentTime + delay);
  oscillator.stop(ctx.currentTime + delay + duration + 0.1);
}

function playPadChord(notes: string[], duration: number, delay: number = 0) {
  notes.forEach(note => {
    const freq = noteFrequencies[note];
    if (freq) {
      playNote(freq, duration, 'sine', 0.06, delay);
    }
  });
}

function playArpeggio(baseFreq: number, duration: number, delay: number = 0) {
  const ctx = getAudioContext();
  const arpNotes = [1, 1.25, 1.5, 1.25, 1];
  const noteDuration = duration / arpNotes.length;

  arpNotes.forEach((mult, i) => {
    playNote(baseFreq * mult, noteDuration * 1.5, 'sine', 0.05, delay + i * noteDuration);
  });
}

let melodyIndex = 0;
let bassIndex = 0;
let beatCount = 0;

let bassTime = 0;
let padTime = 0;

// Pad chord progressions
const padChords = [
  ['E3', 'G3', 'B3'],
  ['A3', 'C4', 'E4'],
  ['D3', 'F3', 'A3'],
  ['G3', 'B3', 'D4'],
  ['C4', 'E4', 'G4'],
  ['D3', 'G3', 'B3'],
  ['A3', 'C4', 'E4'],
  ['E3', 'G3', 'B3'],
];
let padIndex = 0;

function playMusicBeat() {
  if (!isMusicPlaying) return;

  const ctx = getAudioContext();
  const melodyNote = melody[melodyIndex];
  const noteDuration = melodyNote.duration;

  // Play melody note (skip rests)
  if (melodyNote.note !== 'rest') {
    const melodyFreq = noteFrequencies[melodyNote.note];
    playNote(melodyFreq, noteDuration * 0.9, 'sine', 0.1);
  }

  // Play bass every 2 seconds
  bassTime += noteDuration;
  if (bassTime >= 2.0) {
    const bassNote = bassLine[bassIndex];
    const bassFreq = noteFrequencies[bassNote.note];
    playNote(bassFreq, 1.8, 'triangle', 0.08);
    bassIndex = (bassIndex + 1) % bassLine.length;
    bassTime = 0;
  }

  // Play pad chords every 4 seconds
  padTime += noteDuration;
  if (padTime >= 4.0) {
    playPadChord(padChords[padIndex], 3.5);
    padIndex = (padIndex + 1) % padChords.length;
    padTime = 0;
  }

  // Play gentle arpeggio occasionally
  if (beatCount % 16 === 8) {
    const arpFreq = noteFrequencies['E3'];
    playArpeggio(arpFreq, 2.0);
  }

  melodyIndex = (melodyIndex + 1) % melody.length;
  beatCount++;

  // Schedule next beat - slower tempo (600ms per beat unit)
  const nextBeatTime = noteDuration * 600;
  musicInterval = window.setTimeout(playMusicBeat, nextBeatTime);
}

export function startMusic() {
  if (isMusicPlaying) return;

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  isMusicPlaying = true;
  melodyIndex = 0;
  bassIndex = 0;
  beatCount = 0;
  bassTime = 0;
  padTime = 0;
  padIndex = 0;
  playMusicBeat();
}

export function stopMusic() {
  isMusicPlaying = false;
  if (musicInterval) {
    clearTimeout(musicInterval);
    musicInterval = null;
  }
}

export function toggleMusic(): boolean {
  if (isMusicPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
  return isMusicPlaying;
}

export function isMusicEnabled(): boolean {
  return isMusicPlaying;
}

export function toggleSoundEffects(): boolean {
  soundEffectsEnabled = !soundEffectsEnabled;
  return soundEffectsEnabled;
}

export function isSoundEffectsEnabled(): boolean {
  return soundEffectsEnabled;
}

// Mechanical keyboard click sound - realistic clicky switch
export function playKeySound() {
  if (!soundEffectsEnabled) return;

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  // Create sharp click using filtered noise burst
  const clickDuration = 0.007;
  const clickBuffer = ctx.createBuffer(1, ctx.sampleRate * clickDuration, ctx.sampleRate);
  const clickData = clickBuffer.getChannelData(0);

  // Generate noise with sharp attack
  for (let i = 0; i < clickData.length; i++) {
    const envelope = Math.exp(-i / (clickData.length * 0.15));
    clickData[i] = (Math.random() * 2 - 1) * envelope;
  }

  const clickSource = ctx.createBufferSource();
  clickSource.buffer = clickBuffer;

  // Highpass filter for crisp click
  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 3000;
  highpass.Q.value = 0.7;

  // Slight resonance for the "click" character
  const peak = ctx.createBiquadFilter();
  peak.type = 'peaking';
  peak.frequency.value = 4500;
  peak.Q.value = 2;
  peak.gain.value = 6;

  const clickGain = ctx.createGain();
  clickGain.gain.value = 0.15;

  clickSource.connect(highpass);
  highpass.connect(peak);
  peak.connect(clickGain);
  clickGain.connect(ctx.destination);

  clickSource.start(now);

  // Add subtle low "thud" for body
  const thudDuration = 0.02;
  const thudBuffer = ctx.createBuffer(1, ctx.sampleRate * thudDuration, ctx.sampleRate);
  const thudData = thudBuffer.getChannelData(0);

  for (let i = 0; i < thudData.length; i++) {
    const envelope = Math.exp(-i / (thudData.length * 0.1));
    thudData[i] = (Math.random() * 2 - 1) * envelope;
  }

  const thudSource = ctx.createBufferSource();
  thudSource.buffer = thudBuffer;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 800;

  const thudGain = ctx.createGain();
  thudGain.gain.value = 0.06;

  thudSource.connect(lowpass);
  lowpass.connect(thudGain);
  thudGain.connect(ctx.destination);

  thudSource.start(now);
}

// Key release sound - lighter click when key comes back up
export function playKeyReleaseSound() {
  if (!soundEffectsEnabled) return;

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  // Shorter, softer click for release
  const clickDuration = 0.008;
  const clickBuffer = ctx.createBuffer(1, ctx.sampleRate * clickDuration, ctx.sampleRate);
  const clickData = clickBuffer.getChannelData(0);

  for (let i = 0; i < clickData.length; i++) {
    const envelope = Math.exp(-i / (clickData.length * 0.12));
    clickData[i] = (Math.random() * 2 - 1) * envelope;
  }

  const clickSource = ctx.createBufferSource();
  clickSource.buffer = clickBuffer;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 2500;

  const clickGain = ctx.createGain();
  clickGain.gain.value = 0.08;

  clickSource.connect(highpass);
  highpass.connect(clickGain);
  clickGain.connect(ctx.destination);

  clickSource.start(now);
}
