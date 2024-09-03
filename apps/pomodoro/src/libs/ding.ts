export const playDing = (): void => {
  const AudioContext: typeof window.AudioContext =
    window.AudioContext ||
    ((window as any).webkitAudioContext as typeof window.AudioContext);

  const audioContext = new AudioContext();
  const masterGain = audioContext.createGain();
  masterGain.connect(audioContext.destination);

  const createOscillator = (
    frequency: number,
    type: OscillatorType
  ): OscillatorNode => {
    const osc = audioContext.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioContext.currentTime);
    return osc;
  };

  const oscillators: OscillatorNode[] = [
    createOscillator(440, 'sine'), // Fundamental frequency
    createOscillator(880, 'sine'), // First harmonic
    createOscillator(1320, 'sine'), // Second harmonic
  ];

  oscillators.forEach((osc, index) => {
    const oscGain = audioContext.createGain();
    oscGain.gain.setValueAtTime(0.2 / (index + 1), audioContext.currentTime);
    osc.connect(oscGain);
    oscGain.connect(masterGain);
    osc.start();
    osc.stop(audioContext.currentTime + 0.5);
  });

  // Apply envelope
  masterGain.gain.setValueAtTime(0, audioContext.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
  masterGain.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.5
  );
};
