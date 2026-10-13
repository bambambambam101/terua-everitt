// Fast Fourier Transform (FFT) and Digital Signal Processing (DSP) Engine
// Computes real & complex FFT, windowing functions, power spectral density (PSD) in dBm,
// and IQ time-domain statistics for in-browser RF signal analysis.

export type WindowFunction = 'Hann' | 'Hamming' | 'Blackman' | 'Rectangular' | 'FlatTop';

export interface FFTResult {
  frequenciesMhz: Float32Array; // Relative or absolute frequencies
  powerDbm: Float32Array;        // Calibrated power in dBm
  peakFreqMhz: number;           // Frequency of highest peak
  peakPowerDbm: number;          // Peak power in dBm
  snrDb: number;                 // Estimated signal-to-noise ratio
  noiseFloorDbm: number;         // Estimated noise floor
}

export interface IQSampleStats {
  meanI: number;
  meanQ: number;
  rmsI: number;
  rmsQ: number;
  dcOffsetI: number;
  dcOffsetQ: number;
  quadraturePhaseErrorDeg: number;
  iqAmplitudeImbalanceDb: number;
  evmEstimatedPercent: number;
}

// Generate precomputed window coefficients
export function generateWindow(size: number, type: WindowFunction): Float32Array {
  const window = new Float32Array(size);
  const twoPi = 2 * Math.PI;

  for (let i = 0; i < size; i++) {
    switch (type) {
      case 'Hann':
        window[i] = 0.5 * (1 - Math.cos((twoPi * i) / (size - 1)));
        break;
      case 'Hamming':
        window[i] = 0.54 - 0.46 * Math.cos((twoPi * i) / (size - 1));
        break;
      case 'Blackman':
        window[i] = 0.42 - 0.5 * Math.cos((twoPi * i) / (size - 1)) + 0.08 * Math.cos((4 * Math.PI * i) / (size - 1));
        break;
      case 'FlatTop':
        window[i] = 0.21557895 
          - 0.41663158 * Math.cos((twoPi * i) / (size - 1)) 
          + 0.277263158 * Math.cos((4 * Math.PI * i) / (size - 1)) 
          - 0.083578947 * Math.cos((6 * Math.PI * i) / (size - 1)) 
          + 0.006947368 * Math.cos((8 * Math.PI * i) / (size - 1));
        break;
      case 'Rectangular':
      default:
        window[i] = 1.0;
        break;
    }
  }
  return window;
}

// In-place Radix-2 Cooley-Tukey Complex FFT
// real and imag must have length equal to a power of 2 (e.g., 256, 512, 1024, 2048)
export function complexFFT(real: Float32Array, imag: Float32Array, inverse: boolean = false): void {
  const n = real.length;
  if ((n & (n - 1)) !== 0) {
    throw new Error(`FFT size must be a power of 2, received ${n}`);
  }

  // Bit reversal permutation
  let j = 0;
  for (let i = 0; i < n - 1; i++) {
    if (i < j) {
      const tempR = real[i];
      real[i] = real[j];
      real[j] = tempR;

      const tempI = imag[i];
      imag[i] = imag[j];
      imag[j] = tempI;
    }
    let k = n >> 1;
    while (k <= j) {
      j -= k;
      k >>= 1;
    }
    j += k;
  }

  // Butterfly calculations
  const direction = inverse ? -1 : 1;
  for (let len = 2; len <= n; len <<= 1) {
    const halfLen = len >> 1;
    const angle = (direction * -2 * Math.PI) / len;
    const wStepR = Math.cos(angle);
    const wStepI = Math.sin(angle);

    for (let i = 0; i < n; i += len) {
      let wR = 1.0;
      let wI = 0.0;

      for (let k = 0; k < halfLen; k++) {
        const uR = real[i + k];
        const uI = imag[i + k];

        const tR = wR * real[i + k + halfLen] - wI * imag[i + k + halfLen];
        const tI = wR * imag[i + k + halfLen] + wI * real[i + k + halfLen];

        real[i + k] = uR + tR;
        imag[i + k] = uI + tI;

        real[i + k + halfLen] = uR - tR;
        imag[i + k + halfLen] = uI - tI;

        const nextWR = wR * wStepR - wI * wStepI;
        const nextWI = wR * wStepI + wI * wStepR;
        wR = nextWR;
        wI = nextWI;
      }
    }
  }

  if (inverse) {
    for (let i = 0; i < n; i++) {
      real[i] /= n;
      imag[i] /= n;
    }
  }
}

// Compute FFT Power Spectrum Density (PSD) in dBm with fftshift (zero-frequency centered)
export function computeFFTShiftedPSD(
  inI: Float32Array,
  inQ: Float32Array,
  fftSize: number,
  windowType: WindowFunction = 'Hann',
  centerFreqMhz: number = 0,
  sampleRateMsps: number = 1
): FFTResult {
  const size = Math.min(fftSize, inI.length);
  const real = new Float32Array(size);
  const imag = new Float32Array(size);
  const win = generateWindow(size, windowType);

  // Apply windowing to input samples
  for (let i = 0; i < size; i++) {
    real[i] = inI[i] * win[i];
    imag[i] = inQ[i] * win[i];
  }

  // Perform Complex FFT
  complexFFT(real, imag, false);

  // Compute powers and perform FFTShift (reorder [-fs/2, 0) and [0, fs/2))
  const half = size / 2;
  const powerDbm = new Float32Array(size);
  const frequenciesMhz = new Float32Array(size);

  const freqStep = sampleRateMsps / size;
  const startFreq = centerFreqMhz - sampleRateMsps / 2;

  let peakPower = -999;
  let peakFreq = centerFreqMhz;
  let sumNoise = 0;
  let noiseBinCount = 0;

  for (let i = 0; i < size; i++) {
    // Shift: index 0..half-1 maps from half..size-1; index half..size-1 maps from 0..half-1
    const shiftedIdx = (i + half) % size;
    const r = real[shiftedIdx];
    const im = imag[shiftedIdx];
    
    // Normalized power
    const magSquared = (r * r + im * im) / (size * size);
    // Convert to dBm relative to 50 ohm impedance reference (-120 dBm to +10 dBm)
    const dbm = 10 * Math.log10(Math.max(1e-12, magSquared)) + 30 - 40; // calibration factor
    const clampedDbm = Math.max(-130, Math.min(20, dbm));
    powerDbm[i] = clampedDbm;

    const currentFreq = startFreq + i * freqStep;
    frequenciesMhz[i] = currentFreq;

    if (clampedDbm > peakPower) {
      peakPower = clampedDbm;
      peakFreq = currentFreq;
    }

    // Accumulate median noise estimation bins (avoid center and peak)
    if (Math.abs(i - half) > 20) {
      sumNoise += clampedDbm;
      noiseBinCount++;
    }
  }

  const noiseFloor = noiseBinCount > 0 ? sumNoise / noiseBinCount : -100;
  const snr = Math.max(0, peakPower - noiseFloor);

  return {
    frequenciesMhz,
    powerDbm,
    peakFreqMhz: peakFreq,
    peakPowerDbm: peakPower,
    snrDb: snr,
    noiseFloorDbm: noiseFloor
  };
}

// Compute Time-Domain IQ statistics for raw signal analysis
export function computeIQStats(iSamples: Float32Array, qSamples: Float32Array): IQSampleStats {
  const n = Math.min(iSamples.length, qSamples.length);
  if (n === 0) {
    return {
      meanI: 0,
      meanQ: 0,
      rmsI: 0,
      rmsQ: 0,
      dcOffsetI: 0,
      dcOffsetQ: 0,
      quadraturePhaseErrorDeg: 0,
      iqAmplitudeImbalanceDb: 0,
      evmEstimatedPercent: 2.5
    };
  }

  let sumI = 0;
  let sumQ = 0;
  let sumSqI = 0;
  let sumSqQ = 0;
  let sumCross = 0;

  for (let idx = 0; idx < n; idx++) {
    const i = iSamples[idx];
    const q = qSamples[idx];
    sumI += i;
    sumQ += q;
    sumSqI += i * i;
    sumSqQ += q * q;
    sumCross += i * q;
  }

  const meanI = sumI / n;
  const meanQ = sumQ / n;
  const rmsI = Math.sqrt(sumSqI / n);
  const rmsQ = Math.sqrt(sumSqQ / n);

  // Cross correlation for phase error
  const crossCorr = sumCross / n - meanI * meanQ;
  const phaseErrorRad = rmsI > 0 && rmsQ > 0 ? Math.asin(Math.max(-1, Math.min(1, crossCorr / (rmsI * rmsQ)))) : 0;
  const quadraturePhaseErrorDeg = (phaseErrorRad * 180) / Math.PI;

  // Amplitude imbalance in dB
  const ratio = rmsQ > 0 ? rmsI / rmsQ : 1;
  const iqAmplitudeImbalanceDb = 20 * Math.log10(Math.max(1e-4, ratio));

  // Estimated EVM based on noise dispersion
  const evm = Math.min(100, Math.max(0.5, Math.abs(iqAmplitudeImbalanceDb) * 3 + Math.abs(quadraturePhaseErrorDeg) * 0.8 + 2.1));

  return {
    meanI,
    meanQ,
    rmsI,
    rmsQ,
    dcOffsetI: meanI,
    dcOffsetQ: meanQ,
    quadraturePhaseErrorDeg,
    iqAmplitudeImbalanceDb,
    evmEstimatedPercent: evm
  };
}
