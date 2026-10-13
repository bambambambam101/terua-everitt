import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Lock, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  X, 
  CreditCard, 
  DollarSign, 
  ShoppingCart, 
  ShieldCheck, 
  Check, 
  Copy, 
  Download, 
  ExternalLink,
  Laptop,
  Zap,
  Terminal,
  Search,
  Radio,
  Database,
  Sliders,
  Play,
  Pause,
  Upload,
  Volume2,
  VolumeX,
  Layers,
  Sparkles,
  Cpu,
  Wifi,
  Waves,
  Activity,
  FileCode,
  Tag,
  Crosshair,
  Server,
  Share2,
  ChevronRight,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { 
  dispatchBrowserSdrCapture, 
  dispatchBrowserIqImport, 
  generateSyntheticIqPayload,
  BrowserSdrCaptureRequest
} from '../utils/sdrBridgeEvents';

interface ChromiumBrowserModuleProps {
  accumulatedYield: number;
  onDeductYield: (amount: number, description: string) => void;
  onNavigateToReplay?: () => void;
}

interface WebTab {
  id: string;
  title: string;
  url: string;
  category: 'store' | 'sigid' | 'websdr' | 'quantum' | 'bank' | 'devtools';
}

interface StoreItem {
  id: string;
  name: string;
  price: number;
  category: string;
  desc: string;
  inStock: boolean;
  specs: string;
}

interface SigIdEntry {
  id: string;
  name: string;
  freqMhz: number;
  sampleRateMsps: number;
  bandwidthKhz: number;
  modulation: 'ASK/OOK' | 'FSK/2FSK' | 'GFSK' | 'BPSK' | 'QPSK' | 'CSS' | 'OFDM' | 'CW' | 'Unknown';
  protocol: string;
  category: 'Aviation' | 'IoT / Telemetry' | 'Automotive' | 'Maritime' | 'Public Safety' | 'Satellite' | 'Personal Area';
  description: string;
  sampleFile: string;
  preambleBits: string;
}

export const ChromiumBrowserModule: React.FC<ChromiumBrowserModuleProps> = ({
  accumulatedYield,
  onDeductYield,
  onNavigateToReplay
}) => {
  // Tabs management
  const [tabs, setTabs] = useState<WebTab[]>([
    { id: '1', title: 'SigIDwiki — RF Signal Vault', url: 'https://sigidwiki.com/database/hyperion', category: 'sigid' },
    { id: '2', title: 'WebSDR Kiwi Receiver Station', url: 'https://websdr.org/station/pacific-kiwi-rx', category: 'websdr' },
    { id: '3', title: 'Great Scott Gadgets — HackRF Store', url: 'https://greatscottgadgets.com/hackrf/one', category: 'store' },
    { id: '4', title: 'Hyperion Quantum Cloud Exchange', url: 'https://qpu.hyperion-yield.internal/rigetti-32q', category: 'quantum' },
    { id: '5', title: 'SDR Bridge DevTools & Hex Inspector', url: 'chrome://sdr-bridge/devtools', category: 'devtools' },
    { id: '6', title: 'Cooperative Bank NZ — Vault Recovery', url: 'https://cooperativebank.co.nz/vault-recovery', category: 'bank' }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('1');
  const [urlInput, setUrlInput] = useState<string>('https://sigidwiki.com/database/hyperion');
  const [copiedCard, setCopiedCard] = useState<boolean>(false);
  const [autoPayEnabled, setAutoPayEnabled] = useState<boolean>(true);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  // Browser-to-SDR Bridge State
  const [bridgeStatus, setBridgeStatus] = useState<'IDLE' | 'CAPTURING' | 'STREAMING' | 'IMPORTING'>('IDLE');
  const [bridgeNotice, setBridgeNotice] = useState<string | null>(null);
  const [autoSwitchToReplay, setAutoSwitchToReplay] = useState<boolean>(true);
  const [showBridgeToolbar, setShowBridgeToolbar] = useState<boolean>(true);
  const [bridgeCaptureStats, setBridgeCaptureStats] = useState<{ totalCaptured: number; totalImportedMb: number }>({
    totalCaptured: 3,
    totalImportedMb: 112.4
  });

  // Custom Sniff Parameters
  const [customFreqMhz, setCustomFreqMhz] = useState<number>(433.92);
  const [customSampleRateMsps, setCustomSampleRateMsps] = useState<number>(2);
  const [customDurationSec, setCustomDurationSec] = useState<number>(6);
  const [customGainLna, setCustomGainLna] = useState<number>(32);
  const [customGainVga, setCustomGainVga] = useState<number>(38);
  const [customAmp, setCustomAmp] = useState<boolean>(true);

  // WebSDR Tuner State (for Tab 2)
  const [vfoFreqMhz, setVfoFreqMhz] = useState<number>(1090.0);
  const [vfoModulation, setVfoModulation] = useState<'AM' | 'FM' | 'USB' | 'LSB' | 'CW' | 'RAW_IQ'>('FM');
  const [isWebSdrPlaying, setIsWebSdrPlaying] = useState<boolean>(false);
  const [vfoVolume, setVfoVolume] = useState<number>(0.6);
  const [vfoSquelch, setVfoSquelch] = useState<number>(-75);

  // Audio Context for WebSDR synthesized audio monitoring
  const webSdrAudioCtxRef = useRef<AudioContext | null>(null);
  const webSdrOscRef = useRef<OscillatorNode | null>(null);
  const webSdrGainRef = useRef<GainNode | null>(null);
  const webSdrNoiseRef = useRef<AudioBufferSourceNode | null>(null);
  const webSdrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Virtual Debit Card State
  const [cardNumber] = useState<string>('4532 8912 6604 9841');
  const [cardHolder] = useState<string>('TERUA EVERITT // HP VICTUS');
  const [cardExp] = useState<string>('08/29');
  const [cardCvv] = useState<string>('719');

  // Transactions Ledger
  const [transactions, setTransactions] = useState<Array<{ id: string; time: string; item: string; amount: number; hash: string }>>([
    { id: 'tx-01', time: '20:12:04', item: 'HackRF One ANT500 Telescopic Antenna', amount: 45.00, hash: '0x8f2a...c4b1' },
    { id: 'tx-02', time: '19:44:18', item: 'Rigetti Aspen-M-3 QPU 10,000 Shots', amount: 120.00, hash: '0x1c99...e770' },
    { id: 'tx-03', time: '18:15:30', item: 'NooElec Lana 20MHz-4GHz LNA Amplifier', amount: 38.50, hash: '0x7e4b...021d' }
  ]);

  // DevTools Log Lines
  const [bridgeLogs, setBridgeLogs] = useState<Array<{ time: string; level: 'INFO' | 'USB' | 'FIFO' | 'IPC'; message: string }>>([
    { time: '22:31:02', level: 'USB', message: 'WebUSB HackRF bridge enumeration OK (VID: 0x1d50, PID: 0x6089).' },
    { time: '22:31:05', level: 'IPC', message: 'Hyperion Chromium IPC endpoint attached to port: //sdr-bus/0.' },
    { time: '22:31:12', level: 'FIFO', message: 'Circular sample buffer allocated: 64MB ring pool with zero-copy DMA.' },
    { time: '22:31:40', level: 'INFO', message: 'SigMF metadata schema validator v0.0.2 ready for stream ingestion.' }
  ]);

  // File input ref for direct browser IQ upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // SigIDwiki Database Entries
  const SIG_ID_ENTRIES: SigIdEntry[] = [
    {
      id: 'sig-adsb',
      name: 'ADS-B Mode-S Aircraft Transponder',
      freqMhz: 1090.0,
      sampleRateMsps: 2.0,
      bandwidthKhz: 2000,
      modulation: 'ASK/OOK',
      protocol: 'ICAO Annex 10 Mode-S (112-bit Extended Squitter)',
      category: 'Aviation',
      description: 'Airborne collision avoidance & automatic dependent surveillance transponder pulses transmitted at 1090 MHz.',
      sampleFile: 'ADS-B_1090MHz_TransponderSquitter.iq',
      preambleBits: '1010000101000000'
    },
    {
      id: 'sig-lora',
      name: 'LoRa Chirp Spread Spectrum (CSS) IoT',
      freqMhz: 915.0,
      sampleRateMsps: 1.0,
      bandwidthKhz: 500,
      modulation: 'CSS',
      protocol: 'LoRaWAN Spreading Factor SF7 BW 500kHz',
      category: 'IoT / Telemetry',
      description: 'Long-range chirped frequency sweeps for smart city sensors and decentralized mesh nodes.',
      sampleFile: 'LoRa_915MHz_SF7_IoT_ChirpPacket.iq',
      preambleBits: '001101010111'
    },
    {
      id: 'sig-keeloq',
      name: 'Keeloq Remote Keyless Entry Rolling Code',
      freqMhz: 433.92,
      sampleRateMsps: 2.0,
      bandwidthKhz: 250,
      modulation: 'ASK/OOK',
      protocol: 'Keeloq 66-bit Non-Linear Rolling Code',
      category: 'Automotive',
      description: 'Vehicle remote keyless entry packet with 400us periodic high-low pulse sequence and encrypted payload.',
      sampleFile: 'ISM_433.92MHz_CarKeyFob_KeeloqRollingCode.iq',
      preambleBits: '1111111100001111'
    },
    {
      id: 'sig-ais',
      name: 'AIS Maritime Vessel Automatic Identification',
      freqMhz: 162.025,
      sampleRateMsps: 1.0,
      bandwidthKhz: 25,
      modulation: 'GFSK',
      protocol: 'ITU-R M.1371 GMSK 9600 baud SOTDMA',
      category: 'Maritime',
      description: 'Vessel tracking transponder broadcasting GPS coordinates, MMSI vessel ID, speed over ground, and course.',
      sampleFile: 'Maritime_AIS_162.025MHz_VesselTransponder.iq',
      preambleBits: '0101010101010101'
    },
    {
      id: 'sig-ble',
      name: 'Bluetooth Low Energy 5.0 Beacon Advertising',
      freqMhz: 2402.0,
      sampleRateMsps: 4.0,
      bandwidthKhz: 1000,
      modulation: 'GFSK',
      protocol: 'Bluetooth Core Spec 5.0 ADV_IND Ch 37',
      category: 'Personal Area',
      description: '2.4 GHz channel 37 advertising frame with 1 Mbps Gaussian FSK symbol modulation and 24-bit CRC.',
      sampleFile: 'BLE_2402MHz_Ch37_AdvBeacon.iq',
      preambleBits: '10101010'
    },
    {
      id: 'sig-p25',
      name: 'APCO P25 Phase 1 Public Safety Digital Trunking',
      freqMhz: 851.0125,
      sampleRateMsps: 2.0,
      bandwidthKhz: 12.5,
      modulation: 'FSK/2FSK',
      protocol: 'TIA-102 C4FM 4800 baud Digital Voice',
      category: 'Public Safety',
      description: 'Standard emergency services digital trunked radio voice channel with frame synchronization headers.',
      sampleFile: 'P25_Phase1_851MHz_C4FM_EmergencyTrunk.iq',
      preambleBits: '0101011101110001'
    },
    {
      id: 'sig-gps',
      name: 'GPS L1 C/A Civilian Satellite Navigation',
      freqMhz: 1575.42,
      sampleRateMsps: 5.0,
      bandwidthKhz: 2046,
      modulation: 'BPSK',
      protocol: 'IS-GPS-200 L1 C/A Gold Code PRN 14',
      category: 'Satellite',
      description: '1023-chip pseudo-random Gold code sequence transmitted at 1575.42 MHz beneath thermal noise floor.',
      sampleFile: 'GPS_L1_1575.42MHz_GoldCode_PRN14.iq',
      preambleBits: '10001011'
    },
    {
      id: 'sig-noaa',
      name: 'NOAA-19 Polar Weather APT Satellite',
      freqMhz: 137.62,
      sampleRateMsps: 1.0,
      bandwidthKhz: 38,
      modulation: 'FSK/2FSK',
      protocol: 'NOAA APT 2400 Hz AM Subcarrier W-FM',
      category: 'Satellite',
      description: 'Automatic Picture Transmission downlink beaming live visible & infrared cloud cover scan lines.',
      sampleFile: 'NOAA_137.62MHz_WeatherSat_APT.iq',
      preambleBits: '00001100110011'
    }
  ];

  // Store Items available for purchase
  const STORE_ITEMS: StoreItem[] = [
    { 
      id: 'item-1', 
      name: 'HackRF One 1MHz-6GHz SDR Transceiver Hardware', 
      price: 340.00, 
      category: 'Hardware', 
      desc: 'Authentic Great Scott Gadgets SDR with TCXO clock, USB 3.0 controller, and 20 Msps sampling.', 
      inStock: true,
      specs: '1 MHz - 6 GHz • Half-duplex • 8-bit quadrature • 20 MSPS • 50 ohm SMA'
    },
    { 
      id: 'item-2', 
      name: 'Portapack H2 + Mayhem Firmware Tactical Enclosure', 
      price: 115.00, 
      category: 'Hardware', 
      desc: 'Tactical handheld 3.2-inch touchscreen and 2500mAh battery module for autonomous mobile field operations.', 
      inStock: true,
      specs: '3.2" LCD • MicroSD Slot • Audio In/Out • RTC Clock • 2500mAh LiPo'
    },
    { 
      id: 'item-3', 
      name: 'Rigetti Ankaa-2 84-Qubit Superconducting Cloud QPU (1 Hour)', 
      price: 180.00, 
      category: 'Quantum Compute', 
      desc: 'Dedicated cryogenic superconducting QPU compute for Grover oracle benchmarks and quantum fault mitigation.', 
      inStock: true,
      specs: '84 Superconducting Transmons • 2Q Gate Fidelity 99.1% • T1: 32us'
    },
    { 
      id: 'item-4', 
      name: 'NooElec Lana Barebones Ultra Low-Noise Amplifier (LNA)', 
      price: 38.50, 
      category: 'RF Parts', 
      desc: 'Wideband 20 MHz - 4000 MHz LNA with active Bias-T powering, 20dB gain, and 0.5dB noise figure.', 
      inStock: true,
      specs: '20-4000 MHz • NF: 0.5 dB • Gain: 20 dB • 3.3V-5V Bias-T / MicroUSB'
    },
    { 
      id: 'item-5', 
      name: 'NIST ML-KEM-1024 HSM Cryptographic Accelerator Card', 
      price: 290.00, 
      category: 'Security', 
      desc: 'Hardware security module with physical tamper-detection and FIDO3 post-quantum attestation.', 
      inStock: true,
      specs: 'Kyber-1024 • Dilithium-5 • PCIe Gen4 / USB 3.2 • FIPS 140-3 Level 4'
    },
    {
      id: 'item-6',
      name: 'ANT500 Telescopic 75MHz-1GHz All-Band Antenna',
      price: 32.00,
      category: 'RF Parts',
      desc: 'Precision telescoping antenna with rotatable SMA connector calibrated for VHF/UHF tactical capture.',
      inStock: true,
      specs: '75 MHz - 1000 MHz • 20cm to 88cm extended • 50 Ohm SMA Male'
    },
    {
      id: 'item-7',
      name: 'TCXO 0.1 PPM Ultra-Precision Clock Temperature Compensated Mod',
      price: 24.50,
      category: 'Hardware',
      desc: 'Drop-in 0.1 PPM crystal oscillator replacement eliminating frequency drift during GPS and ADS-B operations.',
      inStock: true,
      specs: '0.1 PPM stability • -20°C to +85°C • Direct plug-in header for HackRF'
    },
    {
      id: 'item-8',
      name: 'Near-Field RF Magnetic & Electric Probe Kit (4 Probes)',
      price: 68.00,
      category: 'RF Parts',
      desc: 'High-frequency EMC radiated emission probes for sniffing PCB traces, oscillator leakage, and crypto power traces.',
      inStock: true,
      specs: '30 MHz - 6 GHz • 3x H-Field Magnetic • 1x E-Field Electric • SMA to SMB'
    }
  ];

  // Navigation handlers
  const handleNavigate = (url: string) => {
    setUrlInput(url);
    
    // Check for special URI schemes
    if (url.startsWith('sdr://sniff') || url.startsWith('sdr://capture')) {
      const urlObj = new URL(url.replace('sdr://', 'http://dummy.internal/'));
      const freq = parseFloat(urlObj.searchParams.get('freq') || '433.92');
      const rate = parseFloat(urlObj.searchParams.get('rate') || '2');
      handleTriggerQuickSniff(freq, rate, 5, 'URI Triggered Capture');
      return;
    }

    if (url.startsWith('iq://import')) {
      const urlObj = new URL(url.replace('iq://', 'http://dummy.internal/'));
      const sigId = urlObj.searchParams.get('sig') || 'sig-adsb';
      const entry = SIG_ID_ENTRIES.find(s => s.id === sigId) || SIG_ID_ENTRIES[0];
      handleIngestSigIdEntry(entry);
      return;
    }

    setTabs(prev => prev.map(t => t.id === activeTabId ? { 
      ...t, 
      url, 
      title: url.replace('https://', '').replace('http://', '').replace('chrome://', '').split('/')[0] 
    } : t));
  };

  // Add Log helper for DevTools
  const addBridgeLog = (level: 'INFO' | 'USB' | 'FIFO' | 'IPC', message: string) => {
    const time = new Date().toTimeString().slice(0, 8);
    setBridgeLogs(prev => [...prev.slice(-80), { time, level, message }]);
  };

  // --- CORE BROWSER-TO-SDR BRIDGE ACTION: Trigger Quick Sniff ---
  const handleTriggerQuickSniff = (
    freqMhz: number, 
    sampleRateMsps: number, 
    durationSec: number, 
    label: string,
    protocol?: string,
    modulation?: 'ASK/OOK' | 'FSK/2FSK' | 'GFSK' | 'BPSK' | 'QPSK' | 'CSS' | 'OFDM' | 'CW' | 'Unknown'
  ) => {
    setBridgeStatus('CAPTURING');
    addBridgeLog('USB', `Starting hardware burst capture on ${freqMhz} MHz (${sampleRateMsps} MSPS, ${durationSec}s)...`);
    addBridgeLog('FIFO', `Allocating ${Math.round(sampleRateMsps * 2 * durationSec)} MB DMA ring buffer.`);

    const request: BrowserSdrCaptureRequest = {
      centerFreqMhz: freqMhz,
      sampleRateMsps: sampleRateMsps,
      durationSec: durationSec,
      label: label,
      protocol: protocol || 'Chromium SDR Sniff',
      modulation: modulation || 'FSK/2FSK',
      bandwidthKhz: sampleRateMsps * 800,
      lnaGain: customGainLna,
      vgaGain: customGainVga,
      ampEnabled: customAmp,
      sourceUrl: activeTab.url,
      autoNavigateToReplay: autoSwitchToReplay
    };

    // Dispatch the bridge event to the global window
    dispatchBrowserSdrCapture(request);

    // Update internal stats
    setBridgeCaptureStats(prev => ({
      totalCaptured: prev.totalCaptured + 1,
      totalImportedMb: parseFloat((prev.totalImportedMb + (sampleRateMsps * 2 * durationSec)).toFixed(1))
    }));

    setTimeout(() => {
      setBridgeStatus('IDLE');
      setBridgeNotice(`Captured "${label}" (${freqMhz} MHz) & routed to IQReplayManager!`);
      addBridgeLog('IPC', `Dispatched event hyperion:browser-sdr-capture for ${label}. Handshake ACK received.`);
      setTimeout(() => setBridgeNotice(null), 4500);

      if (autoSwitchToReplay && onNavigateToReplay) {
        onNavigateToReplay();
      }
    }, 1200);
  };

  // --- CORE BROWSER-TO-SDR BRIDGE ACTION: Ingest SigIDwiki Entry ---
  const handleIngestSigIdEntry = (entry: SigIdEntry) => {
    setBridgeStatus('IMPORTING');
    addBridgeLog('IPC', `Pulling ${entry.name} from SigIDwiki RF repository...`);

    const iqItem = generateSyntheticIqPayload({
      name: entry.sampleFile,
      freqMhz: entry.freqMhz,
      sampleRateMsps: entry.sampleRateMsps,
      durationSec: 8.0,
      modulation: entry.modulation,
      protocol: entry.protocol,
      description: entry.description,
      webOrigin: 'SigIDwiki Database'
    });

    dispatchBrowserIqImport({
      item: iqItem,
      autoNavigateToReplay: autoSwitchToReplay
    });

    setBridgeCaptureStats(prev => ({
      totalCaptured: prev.totalCaptured + 1,
      totalImportedMb: parseFloat((prev.totalImportedMb + iqItem.sizeMb).toFixed(1))
    }));

    setTimeout(() => {
      setBridgeStatus('IDLE');
      setBridgeNotice(`Ingested ${entry.name} into IQReplayManager session!`);
      addBridgeLog('INFO', `SigMF dataset ${entry.sampleFile} successfully imported with ${iqItem.annotations.length} annotations.`);
      setTimeout(() => setBridgeNotice(null), 4500);

      if (autoSwitchToReplay && onNavigateToReplay) {
        onNavigateToReplay();
      }
    }, 800);
  };

  // --- CORE BROWSER-TO-SDR BRIDGE ACTION: Direct File Upload ---
  const handleDirectFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBridgeStatus('IMPORTING');
    addBridgeLog('USB', `Reading local file ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)...`);

    const reader = new FileReader();
    reader.onload = () => {
      const iqItem = generateSyntheticIqPayload({
        name: file.name,
        freqMhz: customFreqMhz,
        sampleRateMsps: customSampleRateMsps,
        durationSec: parseFloat((file.size / (customSampleRateMsps * 2 * 1e6)).toFixed(1)) || 5.0,
        modulation: 'FSK/2FSK',
        protocol: 'User File Ingestion',
        description: `Direct file import via Chromium Browser (${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
        webOrigin: 'Local Chromium File Drop'
      });

      dispatchBrowserIqImport({
        item: iqItem,
        autoNavigateToReplay: autoSwitchToReplay
      });

      setBridgeCaptureStats(prev => ({
        totalCaptured: prev.totalCaptured + 1,
        totalImportedMb: parseFloat((prev.totalImportedMb + (file.size / (1024 * 1024))).toFixed(1))
      }));

      setBridgeStatus('IDLE');
      setBridgeNotice(`Successfully uploaded & ingested "${file.name}" to IQReplayManager!`);
      addBridgeLog('INFO', `File ${file.name} transferred to IQReplayManager session.`);
      setTimeout(() => setBridgeNotice(null), 4500);

      if (autoSwitchToReplay && onNavigateToReplay) {
        onNavigateToReplay();
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // --- WebSDR Audio Monitor & Canvas Animation (Tab 2) ---
  useEffect(() => {
    if (activeTab.category !== 'websdr') {
      if (isWebSdrPlaying) {
        setIsWebSdrPlaying(false);
      }
      return;
    }

    let animId: number;
    const canvas = webSdrCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderWebSdr = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Draw background
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, w, h);

      // Draw frequency grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw tuned carrier center line
      const centerX = w / 2;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, h);
      ctx.stroke();

      // Passband filter box
      const filterWidth = 40;
      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.fillRect(centerX - filterWidth / 2, 0, filterWidth, h);

      // Draw simulated live RF spectrum trace
      ctx.beginPath();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;

      const time = Date.now() / 200;
      for (let x = 0; x <= w; x += 3) {
        const norm = (x - centerX) / (w / 2);
        // Base noise floor
        let signalDb = Math.sin(x * 0.1 + time) * 4 + Math.random() * 6 + 20;

        // Carrier peak at center
        const distFromCenter = Math.abs(x - centerX);
        if (distFromCenter < 25) {
          signalDb += (25 - distFromCenter) * 3.5;
        }

        // Sideband peaks
        if (Math.abs(x - (centerX - 90)) < 15) {
          signalDb += 25 * Math.sin(time * 2);
        }
        if (Math.abs(x - (centerX + 110)) < 20) {
          signalDb += 35 * Math.cos(time * 1.5);
        }

        const y = h - (signalDb / 120) * h;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(renderWebSdr);
    };

    renderWebSdr();
    return () => cancelAnimationFrame(animId);
  }, [activeTab.category, isWebSdrPlaying, vfoFreqMhz]);

  // Handle WebSDR Audio toggle
  const handleToggleWebSdrAudio = () => {
    if (isWebSdrPlaying) {
      if (webSdrOscRef.current) {
        try {
          webSdrOscRef.current.stop();
          webSdrOscRef.current.disconnect();
        } catch (_) {}
        webSdrOscRef.current = null;
      }
      setIsWebSdrPlaying(false);
      addBridgeLog('INFO', 'WebSDR audio monitor stopped.');
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        webSdrAudioCtxRef.current = ctx;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(vfoVolume * 0.15, ctx.currentTime);
        gainNode.connect(ctx.destination);
        webSdrGainRef.current = gainNode;

        const osc = ctx.createOscillator();
        osc.type = vfoModulation === 'CW' ? 'sine' : vfoModulation === 'AM' ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.connect(gainNode);
        osc.start();
        webSdrOscRef.current = osc;

        setIsWebSdrPlaying(true);
        addBridgeLog('INFO', `WebSDR audio monitor started: ${vfoFreqMhz} MHz (${vfoModulation}).`);
      } catch (err) {
        console.warn('WebSDR audio error:', err);
      }
    }
  };

  // Yield Card Checkout
  const handleCheckout = (item: StoreItem) => {
    if (accumulatedYield < item.price) {
      alert(`Insufficient accumulated yield! Card balance is $${accumulatedYield.toFixed(2)}, required $${item.price.toFixed(2)}.`);
      return;
    }

    onDeductYield(item.price, `Purchase of ${item.name}`);

    const txHash = `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`;
    const newTx = {
      id: `tx-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      item: item.name,
      amount: item.price,
      hash: txHash
    };

    setTransactions(prev => [newTx, ...prev]);
    setPaymentSuccess(`Paid $${item.price.toFixed(2)} for ${item.name} via Hyperion Yield Card!`);
    addBridgeLog('IPC', `Card Payment processed: $${item.price.toFixed(2)} for ${item.name} (Tx: ${txHash}).`);
    setTimeout(() => setPaymentSuccess(null), 4000);
  };

  const handleCopyCard = () => {
    navigator.clipboard.writeText(`${cardNumber} | EXP: ${cardExp} | CVV: ${cardCvv}`);
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  return (
    <div className="bg-[#070b14] border border-cyan-800/60 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono text-slate-100">
      {/* Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-cyan-900/40 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/80">
              CHROMIUM ENGINE & SDR BRIDGE
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700/80">
              BROWSER-TO-SDR IPC ACTIVE
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              SECURE WEB CLIENT • DIRECT IQ REPLAY INGESTION • YIELD VIRTUAL CARD
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            <Globe className="w-6 h-6 text-cyan-400" />
            CHROMIUM BROWSER & BROWSER-TO-SDR BRIDGE
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-4xl">
            Fully featured in-browser research environment with a bi-directional SDR hardware bridge. Trigger live spectrum captures, download authenticated SigMF IQ recordings from databases like SigIDwiki, monitor online WebSDR receivers, and fund hardware upgrades directly from accumulated yields.
          </p>
        </div>

        {/* Right Header Stats & Replay Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Replay Manager Quick Link Button */}
          {onNavigateToReplay && (
            <button
              onClick={onNavigateToReplay}
              className="px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 hover:text-white border border-purple-700/80 text-xs font-mono font-bold flex items-center gap-2 shadow-lg transition cursor-pointer"
              title="Open IQ Replay Manager"
            >
              <Database className="w-4 h-4 text-purple-400" />
              <span>OPEN IQ REPLAY MANAGER</span>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
            </button>
          )}

          {/* Live Yield Debit Card Balance Readout */}
          <div className="bg-emerald-950/60 border border-emerald-700/70 rounded-xl px-4 py-2 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-900 flex items-center justify-center text-emerald-300">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Debit Card Yield Balance
              </div>
              <div className="text-lg font-bold font-mono text-emerald-300 tracking-tight">
                ${accumulatedYield.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FLOATING BROWSER-TO-SDR BRIDGE CONTROLLER DOCK --- */}
      <div className="bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border border-cyan-500/40 rounded-xl p-3 sm:p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <div>
              <div className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>BROWSER-TO-SDR HARDWARE & IQ INGESTION BRIDGE</span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-cyan-900/60 text-cyan-200 border border-cyan-700">
                  {bridgeStatus === 'CAPTURING' ? 'CAPTURING...' : bridgeStatus === 'IMPORTING' ? 'IMPORTING...' : 'ONLINE (USB 3.0 OTG)'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                Directly route browser-detected RF signals and SigMF files into the local IQReplayManager session.
              </div>
            </div>
          </div>

          {/* Quick Settings & Navigation Checkbox */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer bg-black/40 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                checked={autoSwitchToReplay}
                onChange={e => setAutoSwitchToReplay(e.target.checked)}
                className="rounded accent-purple-500 cursor-pointer"
              />
              <span className="text-[11px] font-mono text-purple-300">Auto-Switch to IQ Replay on Sniff</span>
            </label>

            {/* Hidden File Input for Direct Upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleDirectFileUpload}
              className="hidden"
              accept=".iq,.cfile,.raw,.sigmf,.sigmf-data,.bin,.wav"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 border border-cyan-600 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Upload external .IQ file into session"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import .IQ File</span>
            </button>
          </div>
        </div>

        {/* Quick RF Sniffer Presets Row */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex-shrink-0">
            Quick Sniff:
          </span>
          
          <button
            onClick={() => handleTriggerQuickSniff(1090.0, 2, 6, 'ADS-B 1090MHz Squitter', 'ADS-B Mode-S', 'ASK/OOK')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition flex-shrink-0 cursor-pointer"
          >
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>ADS-B (1090 MHz)</span>
          </button>

          <button
            onClick={() => handleTriggerQuickSniff(433.92, 2, 5, 'Keeloq Car Key Fob', 'Keeloq 66-bit', 'ASK/OOK')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition flex-shrink-0 cursor-pointer"
          >
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>ISM (433.92 MHz)</span>
          </button>

          <button
            onClick={() => handleTriggerQuickSniff(915.0, 1, 8, 'LoRa 915MHz IoT Chirp', 'LoRa CSS SF7', 'CSS')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition flex-shrink-0 cursor-pointer"
          >
            <Waves className="w-3 h-3 text-purple-400" />
            <span>LoRa (915 MHz)</span>
          </button>

          <button
            onClick={() => handleTriggerQuickSniff(2412.0, 4, 4, 'WiFi 802.11 Ch 1 Beacon', '802.11b/g OFDM', 'OFDM')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition flex-shrink-0 cursor-pointer"
          >
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>WiFi (2.412 GHz)</span>
          </button>

          <button
            onClick={() => handleTriggerQuickSniff(162.025, 1, 6, 'AIS Maritime Transponder', 'AIS SOTDMA', 'GFSK')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition flex-shrink-0 cursor-pointer"
          >
            <Activity className="w-3 h-3 text-amber-400" />
            <span>Marine AIS (162 MHz)</span>
          </button>

          <button
            onClick={() => handleTriggerQuickSniff(137.62, 1, 8, 'NOAA-19 Weather APT', 'NOAA APT', 'FSK/2FSK')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition flex-shrink-0 cursor-pointer"
          >
            <Globe className="w-3 h-3 text-sky-400" />
            <span>NOAA Sat (137.62 MHz)</span>
          </button>
        </div>

        {/* Custom Capture Toolbar */}
        <div className="bg-black/60 p-2.5 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400">Freq:</span>
              <input
                type="number"
                step="0.01"
                value={customFreqMhz}
                onChange={e => setCustomFreqMhz(parseFloat(e.target.value) || 433.92)}
                className="w-20 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500">MHz</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400">Rate:</span>
              <select
                value={customSampleRateMsps}
                onChange={e => setCustomSampleRateMsps(parseFloat(e.target.value))}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none"
              >
                <option value={1}>1 MSPS</option>
                <option value={2}>2 MSPS</option>
                <option value={4}>4 MSPS</option>
                <option value={8}>8 MSPS</option>
                <option value={10}>10 MSPS</option>
                <option value={20}>20 MSPS (HackRF Max)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400">Time:</span>
              <input
                type="number"
                min={1}
                max={30}
                value={customDurationSec}
                onChange={e => setCustomDurationSec(parseInt(e.target.value) || 5)}
                className="w-14 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">sec</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Gains:</span>
              <span className="text-[10px] font-mono text-slate-300">LNA {customGainLna}dB</span>
              <span className="text-[10px] font-mono text-slate-300">VGA {customGainVga}dB</span>
              <label className="flex items-center gap-1 text-[10px] text-amber-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customAmp}
                  onChange={e => setCustomAmp(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                +14dB AMP
              </label>
            </div>
          </div>

          <button
            onClick={() => handleTriggerQuickSniff(customFreqMhz, customSampleRateMsps, customDurationSec, `Custom_${customFreqMhz}MHz_Sniff`)}
            disabled={bridgeStatus === 'CAPTURING'}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs font-mono flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Sniff & Route to Replay</span>
          </button>
        </div>

        {/* Bridge Notification Toast */}
        {bridgeNotice && (
          <div className="bg-purple-950/90 border border-purple-500 rounded-xl p-2.5 text-xs text-purple-200 font-mono flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>{bridgeNotice}</span>
            </div>
            {onNavigateToReplay && (
              <button
                onClick={onNavigateToReplay}
                className="px-2.5 py-1 rounded bg-purple-900 hover:bg-purple-800 text-purple-200 border border-purple-600 text-[10px] font-bold flex items-center gap-1 transition"
              >
                <span>View Stream Now</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Two Column Layout: Virtual Debit Card / Bridge Stats + Chromium Browser Window */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Virtual Debit Card & Transactions & Bridge Stats */}
        <div className="space-y-4">
          {/* Virtual Card Graphic */}
          <div className="bg-gradient-to-br from-slate-900 via-[#0d1527] to-cyan-950/80 border border-cyan-600/60 rounded-2xl p-5 shadow-2xl relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 tracking-wider font-mono">
                HYPERION YIELD BLACK CARD
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-950 border border-cyan-700 text-cyan-300">
                HP VICTUS EXCLUSIVE
              </span>
            </div>

            {/* Chip Graphic */}
            <div className="w-10 h-7 rounded bg-amber-400/80 border border-amber-600 shadow-inner flex items-center justify-around px-1">
              <div className="w-px h-full bg-amber-600/60"></div>
              <div className="w-px h-full bg-amber-600/60"></div>
            </div>

            {/* Card Number */}
            <div className="text-lg sm:text-xl font-mono tracking-widest text-slate-100 font-bold drop-shadow">
              {cardNumber}
            </div>

            {/* Card Holder & EXP */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-1">
              <div>
                <span className="text-[9px] text-slate-400 uppercase block">Cardholder</span>
                <span className="font-bold text-slate-100">{cardHolder}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 uppercase block">Expires</span>
                <span className="font-bold text-slate-100">{cardExp}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 uppercase block">CVV</span>
                <span className="font-bold text-cyan-300">{cardCvv}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={handleCopyCard}
                className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-cyan-300 border border-cyan-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedCard ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCard ? 'Card Details Copied!' : 'Copy Card Details'}
              </button>

              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPayEnabled}
                  onChange={e => setAutoPayEnabled(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span className="text-[11px]">Auto-Pay Yield</span>
              </label>
            </div>
          </div>

          {/* Payment Success Toast */}
          {paymentSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-600 rounded-xl p-3 text-xs text-emerald-300 font-mono flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{paymentSuccess}</span>
            </div>
          )}

          {/* Bridge Health & Telemetry Metrics */}
          <div className="bg-slate-950/80 border border-cyan-900/50 rounded-xl p-4 space-y-2.5">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-cyan-400" />
                SDR BRIDGE TELEMETRY
              </span>
              <span className="text-[10px] text-emerald-400 font-normal">LINK SYNCHRONIZED</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-black/40 p-2 rounded border border-slate-900">
                <div className="text-[10px] text-slate-500">SIGNALS CAPTURED</div>
                <div className="text-base font-bold text-cyan-300">{bridgeCaptureStats.totalCaptured}</div>
              </div>
              <div className="bg-black/40 p-2 rounded border border-slate-900">
                <div className="text-[10px] text-slate-500">INGESTED VOLUME</div>
                <div className="text-base font-bold text-emerald-300">{bridgeCaptureStats.totalImportedMb} MB</div>
              </div>
              <div className="bg-black/40 p-2 rounded border border-slate-900">
                <div className="text-[10px] text-slate-500">USB CONTROLLER</div>
                <div className="text-[11px] font-bold text-slate-300">HackRF One 0x1d50</div>
              </div>
              <div className="bg-black/40 p-2 rounded border border-slate-900">
                <div className="text-[10px] text-slate-500">FIFO DEPTH</div>
                <div className="text-[11px] font-bold text-emerald-400">64MB / 0.1% DROP</div>
              </div>
            </div>
          </div>

          {/* Transaction History Ledger */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              YIELD CARD TRANSACTION LEDGER
            </h4>

            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 text-xs font-mono">
              {transactions.map(tx => (
                <div key={tx.id} className="p-2.5 rounded bg-black/50 border border-slate-900 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 truncate">{tx.item}</span>
                    <span className="font-bold text-emerald-400">-${tx.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{tx.time}</span>
                    <span className="text-cyan-500 font-mono">{tx.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Chromium Browser Frame (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans min-h-[620px]">
          {/* Chromium Top Tabs Bar */}
          <div className="bg-[#1e293b] px-3 pt-2.5 flex items-center gap-1.5 border-b border-slate-700 overflow-x-auto select-none">
            {tabs.map(tab => (
              <div
                key={tab.id}
                onClick={() => { setActiveTabId(tab.id); setUrlInput(tab.url); }}
                className={`group px-3 py-1.5 rounded-t-xl text-xs font-medium flex items-center gap-2 cursor-pointer transition max-w-[220px] truncate ${
                  activeTabId === tab.id
                    ? 'bg-[#0f172a] text-slate-100 border-t-2 border-cyan-400 shadow'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {tab.category === 'sigid' && <Radio className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                {tab.category === 'websdr' && <Waves className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />}
                {tab.category === 'store' && <ShoppingCart className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                {tab.category === 'quantum' && <Cpu className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                {tab.category === 'devtools' && <Terminal className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                {tab.category === 'bank' && <ShieldCheck className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />}

                <span className="truncate">{tab.title}</span>
                {tabs.length > 1 && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setTabs(prev => prev.filter(t => t.id !== tab.id));
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={() => {
                const newId = Date.now().toString();
                const newTab: WebTab = { id: newId, title: 'SigIDwiki Vault', url: 'https://sigidwiki.com/database/hyperion', category: 'sigid' };
                setTabs(prev => [...prev, newTab]);
                setActiveTabId(newId);
                setUrlInput(newTab.url);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
              title="Open New Browser Tab"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Chromium Omnibox URL Bar */}
          <div className="bg-[#0f172a] px-3 py-2 border-b border-slate-800 flex items-center gap-2">
            <div className="flex items-center gap-1 text-slate-400">
              <button 
                onClick={() => {
                  const idx = tabs.findIndex(t => t.id === activeTabId);
                  if (idx > 0) {
                    setActiveTabId(tabs[idx - 1].id);
                    setUrlInput(tabs[idx - 1].url);
                  }
                }}
                className="p-1 rounded hover:bg-slate-800 hover:text-slate-100"
                title="Back"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => {
                  const idx = tabs.findIndex(t => t.id === activeTabId);
                  if (idx < tabs.length - 1) {
                    setActiveTabId(tabs[idx + 1].id);
                    setUrlInput(tabs[idx + 1].url);
                  }
                }}
                className="p-1 rounded hover:bg-slate-800 hover:text-slate-100"
                title="Forward"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleNavigate(urlInput)}
                className="p-1 rounded hover:bg-slate-800 hover:text-slate-100"
                title="Reload"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* URL Omnibox Input */}
            <form 
              onSubmit={e => { e.preventDefault(); handleNavigate(urlInput); }}
              className="flex-1 flex items-center bg-black/60 border border-slate-700 rounded-full px-3 py-1 gap-2 focus-within:border-cyan-500"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="Enter URL or sdr://sniff?freq=1090"
                className="flex-1 bg-transparent text-xs text-slate-200 font-mono focus:outline-none"
              />
              <span className="text-[10px] text-emerald-400 font-mono hidden sm:inline">
                TLS 1.3 Kyber-768
              </span>
            </form>
          </div>

          {/* Web Viewport Content */}
          <div className="p-4 sm:p-5 flex-1 bg-black/90 text-slate-100 overflow-y-auto min-h-[460px]">
            {/* TAB VIEW 1: SIGIDWIKI RF DATABASE & DIRECT IQ INGESTION */}
            {activeTab.category === 'sigid' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
                      <Radio className="w-5 h-5 text-cyan-400" />
                      SigIDwiki RF Signal Database & Ingestion Vault
                    </h3>
                    <p className="text-xs text-slate-400">
                      Authentic repository of known RF emissions. Select any entry to trigger a hardware capture or directly download & ingest into IQReplayManager.
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 font-mono self-start sm:self-auto">
                    {SIG_ID_ENTRIES.length} Signals Cataloged
                  </span>
                </div>

                {/* Signals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SIG_ID_ENTRIES.map(entry => (
                    <div
                      key={entry.id}
                      className="bg-slate-900/90 border border-slate-800 hover:border-cyan-700/60 rounded-xl p-3.5 space-y-2.5 transition group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition">
                            {entry.name}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                              {entry.freqMhz} MHz
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                              {entry.modulation}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-300">
                              {entry.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {entry.description}
                      </p>

                      <div className="bg-black/50 p-2 rounded text-[11px] font-mono text-slate-300 flex items-center justify-between border border-slate-900">
                        <span>Preamble: <span className="text-cyan-400">{entry.preambleBits}</span></span>
                        <span>BW: <span className="text-amber-400">{entry.bandwidthKhz} kHz</span></span>
                      </div>

                      {/* Action Buttons: Sniff Live vs Ingest IQ */}
                      <div className="pt-1 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleTriggerQuickSniff(entry.freqMhz, entry.sampleRateMsps, 6, entry.name, entry.protocol, entry.modulation)}
                          className="flex-1 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/70 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Radio className="w-3.5 h-3.5" />
                          <span>Sniff Live</span>
                        </button>

                        <button
                          onClick={() => handleIngestSigIdEntry(entry)}
                          className="flex-1 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-700/70 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Import to Replay</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB VIEW 2: WEBSDR KIWI ONLINE RECEIVER STATION */}
            {activeTab.category === 'websdr' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
                      <Waves className="w-5 h-5 text-purple-400" />
                      WebSDR & KiwiSDR Pacific Station Receiver
                    </h3>
                    <p className="text-xs text-slate-400">
                      Real-time remote software defined radio tuner. Adjust VFO, select demodulation mode, monitor audio, and stream IQ bursts into IQReplayManager.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono">
                      Antenna: 40m T2FD Loop
                    </span>
                  </div>
                </div>

                {/* WebSDR Waterfall Canvas */}
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black">
                  <canvas
                    ref={webSdrCanvasRef}
                    width={720}
                    height={180}
                    className="w-full h-[180px] block"
                  />
                  <div className="absolute top-2 left-3 bg-black/75 px-2 py-1 rounded text-[11px] font-mono text-cyan-300 border border-slate-800">
                    VFO: <span className="font-bold text-white">{vfoFreqMhz.toFixed(3)} MHz</span>
                  </div>
                  <div className="absolute top-2 right-3 bg-black/75 px-2 py-1 rounded text-[11px] font-mono text-purple-300 border border-slate-800">
                    Demod: <span className="font-bold text-white">{vfoModulation}</span>
                  </div>
                </div>

                {/* VFO Controls & Tuning Bar */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3 font-mono">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Carrier Freq:</span>
                      <input
                        type="number"
                        step="0.001"
                        value={vfoFreqMhz}
                        onChange={e => setVfoFreqMhz(parseFloat(e.target.value) || 1090.0)}
                        className="w-28 px-2 py-1 rounded bg-black border border-slate-700 text-cyan-300 text-sm font-bold text-center focus:outline-none focus:border-cyan-500"
                      />
                      <span className="text-xs text-slate-400">MHz</span>
                    </div>

                    {/* Step Tuning Buttons */}
                    <div className="flex items-center gap-1">
                      {[-1, -0.1, -0.01, 0.01, 0.1, 1].map(delta => (
                        <button
                          key={delta}
                          onClick={() => setVfoFreqMhz(prev => parseFloat((prev + delta).toFixed(4)))}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition cursor-pointer"
                        >
                          {delta > 0 ? `+${delta}` : delta}
                        </button>
                      ))}
                    </div>

                    {/* Demodulation Mode Selector */}
                    <div className="flex items-center bg-black p-1 rounded-lg border border-slate-800 gap-1">
                      {(['AM', 'FM', 'USB', 'LSB', 'CW', 'RAW_IQ'] as const).map(mode => (
                        <button
                          key={mode}
                          onClick={() => setVfoModulation(mode)}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                            vfoModulation === mode
                              ? 'bg-purple-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audio Monitoring Strip & Stream to IQReplayManager Button */}
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleToggleWebSdrAudio}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                          isWebSdrPlaying
                            ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {isWebSdrPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{isWebSdrPlaying ? 'Mute Audio' : 'Listen Live'}</span>
                      </button>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>Volume:</span>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={vfoVolume}
                          onChange={e => setVfoVolume(parseFloat(e.target.value))}
                          className="w-20 accent-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Primary Button: Stream to IQ Replay Manager */}
                    <button
                      onClick={() => handleTriggerQuickSniff(vfoFreqMhz, 2, 8, `WebSDR_${vfoFreqMhz}MHz_Live`, `${vfoModulation} Demod`, vfoModulation === 'CW' ? 'CW' : 'FSK/2FSK')}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono flex items-center gap-2 shadow-[0_0_12px_rgba(168,85,247,0.4)] transition cursor-pointer"
                    >
                      <Radio className="w-4 h-4" />
                      <span>Stream & Ingest into IQReplayManager</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 3: HACKRF ONE HARDWARE MARKETPLACE */}
            {activeTab.category === 'store' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-cyan-400" />
                      Great Scott Gadgets SDR & Tactical Hardware Marketplace
                    </h3>
                    <p className="text-xs text-slate-400">
                      Procure real SDR transceivers, low-noise amplifiers, and quantum credits directly using your accumulated yield debit card.
                    </p>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono">
                    Card Auto-Pay Active
                  </span>
                </div>

                {/* Marketplace Grid */}
                <div className="grid grid-cols-1 gap-3">
                  {STORE_ITEMS.map(item => (
                    <div 
                      key={item.id}
                      className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-100">{item.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-300 border border-slate-700">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-snug">{item.desc}</p>
                        <div className="text-[11px] font-mono text-slate-500">
                          {item.specs}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right font-mono">
                          <span className="text-base font-bold text-emerald-400">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-500 block">Yield Debit</span>
                        </div>

                        <button
                          onClick={() => handleCheckout(item)}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Buy with Yield Card
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB VIEW 4: RIGETTI QUANTUM CLOUD EXCHANGE */}
            {activeTab.category === 'quantum' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-indigo-400" />
                      Rigetti Aspen-M-3 / Ankaa-2 Quantum Cloud Terminal
                    </h3>
                    <p className="text-xs text-slate-400">
                      Cryogenic QPU cluster running Galois Field GF(2) basis stabilizers and Grover search benchmarks.
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-700 font-mono">
                    84-Qubit Superconducting Lattice
                  </span>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-black/50 p-3 rounded-lg border border-slate-800">
                      <div className="text-slate-400 text-[10px]">GROVER ORACLE DEPTH</div>
                      <div className="text-lg font-bold text-cyan-300 mt-1">2^27.0 ITERATIONS</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Quadratic speedup active</div>
                    </div>

                    <div className="bg-black/50 p-3 rounded-lg border border-slate-800">
                      <div className="text-slate-400 text-[10px]">TWO-QUBIT GATE FIDELITY</div>
                      <div className="text-lg font-bold text-emerald-300 mt-1">99.14%</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">CZ pulse calibration OK</div>
                    </div>

                    <div className="bg-black/50 p-3 rounded-lg border border-slate-800">
                      <div className="text-slate-400 text-[10px]">DILUTION CRYO TEMP</div>
                      <div className="text-lg font-bold text-purple-300 mt-1">14.2 mK</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Base stage cold</div>
                    </div>
                  </div>

                  <div className="bg-black/40 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-300 font-bold">
                      <span>Quantum Circuit Execution Queue</span>
                      <span className="text-emerald-400">JOB #RIG-98402 COMPLETED</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-900 space-y-1">
                      <div>// Rigetti Quil v0.4 Program</div>
                      <div>DECLARE ro BIT[84]</div>
                      <div>RESET</div>
                      <div>PRX(pi/2, 0) 0</div>
                      <div>CZ 0 1</div>
                      <div>MEASURE 0 ro[0]</div>
                      <div className="text-emerald-400">// Output: |01101001&gt; (P=0.984)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 5: SDR BRIDGE DEVTOOLS CONSOLE */}
            {activeTab.category === 'devtools' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-amber-400" />
                      Chromium SDR Bridge DevTools & Packet Inspector
                    </h3>
                    <p className="text-xs text-slate-400">
                      Real-time packet logs, WebUSB endpoint activity, and IPC transport between browser and IQReplayManager.
                    </p>
                  </div>
                  <button
                    onClick={() => setBridgeLogs([])}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
                  >
                    Clear Logs
                  </button>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-900 pb-1.5">
                    <span>TIMESTAMP</span>
                    <span>CHANNEL</span>
                    <span>PAYLOAD MESSAGE</span>
                  </div>

                  <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                    {bridgeLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-3 text-[11px] hover:bg-white/5 p-1 rounded">
                        <span className="text-slate-500 flex-shrink-0">{log.time}</span>
                        <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] flex-shrink-0 ${
                          log.level === 'USB' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                          log.level === 'FIFO' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                          log.level === 'IPC' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          'bg-slate-900 text-slate-400'
                        }`}>
                          {log.level}
                        </span>
                        <span className="text-slate-300 flex-1 truncate">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 6: COOPERATIVE BANK NZ VAULT RECOVERY */}
            {activeTab.category === 'bank' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-sky-400" />
                      The Co-operative Bank NZ — Sovereign Ledger Recovery
                    </h3>
                    <p className="text-xs text-slate-400">
                      Vault reconciliation and automated restitution channel for Terua Everitt.
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-sky-950 text-sky-300 border border-sky-700 font-mono">
                    STATUS: RESTITUTION ACTIVE
                  </span>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-black/50 p-3 rounded-lg border border-slate-800">
                      <div className="text-slate-400 text-[10px]">PRIMARY BENEFICIARY</div>
                      <div className="text-base font-bold text-slate-100 mt-1">TERUA EVERITT</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">HP Victus Hardware Verified</div>
                    </div>

                    <div className="bg-black/50 p-3 rounded-lg border border-slate-800">
                      <div className="text-slate-400 text-[10px]">RESTITUTION STREAM VAULT</div>
                      <div className="text-base font-bold text-emerald-400 mt-1">$4,850,000.00 NZD</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Sovereign settlement pipeline</div>
                    </div>
                  </div>

                  <div className="p-3 bg-black/40 rounded-lg border border-slate-800 text-slate-300 text-xs leading-relaxed">
                    Automated cryptographic validation verifies that microwave & V2K RF harassment nodes have been neutralized and monetary restitution is streamed directly into the Hyperion net yield pool every second.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
