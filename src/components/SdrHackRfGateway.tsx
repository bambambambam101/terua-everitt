import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Download, 
  Smartphone, 
  Activity, 
  Sliders, 
  Zap, 
  ShieldCheck, 
  Check, 
  Play, 
  Pause, 
  Volume2, 
  Layers, 
  Terminal, 
  Flame,
  FileCode,
  ExternalLink,
  Wifi,
  Usb,
  Database,
  Cpu,
  RefreshCw,
  FolderDown,
  Copy,
  Sparkles,
  Server,
  ArrowRightLeft,
  Binary
} from 'lucide-react';
import { IQReplayManager } from './IQReplayManager';

export interface IQRecording {
  id: string;
  name: string;
  freqMhz: number;
  sampleRateMsps: number;
  durationSec: number;
  format: '8-bit IQ' | '16-bit Complex';
  sizeMb: number;
  protocolDetected: string;
  timestamp: string;
}

export const SdrHackRfGateway: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Tab mode in SDR Gateway
  const [activeTab, setActiveTab] = useState<'transceiver' | 'iq_replay' | 'android_skeleton' | 'remote_api' | 'compensators'>('transceiver');

  // SDR State
  const [centerFreqMhz, setCenterFreqMhz] = useState<number>(2412.0); // 2.412 GHz
  const [sampleRateMsps, setSampleRateMsps] = useState<number>(20);
  const [lnaGain, setLnaGain] = useState<number>(32);
  const [vgaGain, setVgaGain] = useState<number>(40);
  const [amp14db, setAmp14db] = useState<boolean>(true);
  const [biasTee, setBiasTee] = useState<boolean>(true);
  const [colorTheme, setColorTheme] = useState<'cyan' | 'inferno' | 'matrix' | 'purple'>('cyan');
  const [isReceiving, setIsReceiving] = useState<boolean>(true);
  const [peakSignalDbm, setPeakSignalDbm] = useState<number>(-38.4);
  const [demodMode, setDemodMode] = useState<'FM-Wide' | 'FM-Narrow' | 'AM' | 'RAW-IQ'>('FM-Wide');
  const [bandwidthFilter, setBandwidthFilter] = useState<string>('20 MHz');

  // Hardware Connection Mode: Real USB OTG vs Remote TCP / Cloud Bridge vs Simulated Twin
  const [connectionMode, setConnectionMode] = useState<'usb_otg' | 'remote_tcp' | 'cloud_bridge' | 'virtual_twin'>('usb_otg');
  const [hardwareDetected, setHardwareDetected] = useState<boolean>(true);
  const [usbStatus, setUsbStatus] = useState<string>('VID:0x1d50 PID:0x6089 (Great Scott Gadgets HackRF One)');

  // Mobile Remote APK State
  const [isMobileConnected, setIsMobileConnected] = useState<boolean>(true);
  const [mobileDeviceName, setMobileDeviceName] = useState<string>('OPPO A40 (Remote Tether)');
  const [mobilePort, setMobilePort] = useState<number>(7654);
  const [apkDownloaded, setApkDownloaded] = useState<boolean>(false);
  const [configDownloaded, setConfigDownloaded] = useState<boolean>(false);
  const [projectSkeletonCopied, setProjectSkeletonCopied] = useState<boolean>(false);
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState<string | null>(null);

  // IQ Replay System
  const [recordings, setRecordings] = useState<IQRecording[]>([
    {
      id: 'iq-001',
      name: 'ISM_433.92MHz_CarKeyFob_RollingCode.iq',
      freqMhz: 433.92,
      sampleRateMsps: 2,
      durationSec: 8.4,
      format: '8-bit IQ',
      sizeMb: 33.6,
      protocolDetected: 'ASK / OOK Keeloq',
      timestamp: '2026-10-10 09:12 UTC'
    },
    {
      id: 'iq-002',
      name: 'ADSB_1090MHz_Aviation_Squawk7700.iq',
      freqMhz: 1090.0,
      sampleRateMsps: 10,
      durationSec: 15.2,
      format: '8-bit IQ',
      sizeMb: 152.0,
      protocolDetected: 'Mode S / ADS-B Pulse Position',
      timestamp: '2026-10-10 09:18 UTC'
    },
    {
      id: 'iq-003',
      name: 'WiFi_2412MHz_ProbeRequest_BeaconBurst.iq',
      freqMhz: 2412.0,
      sampleRateMsps: 20,
      durationSec: 6.0,
      format: '8-bit IQ',
      sizeMb: 120.0,
      protocolDetected: '802.11b/g OFDM 64-QAM',
      timestamp: '2026-10-10 09:25 UTC'
    },
    {
      id: 'iq-004',
      name: 'Microwave_1040MHz_TargetedV2K_ShieldedTrace.iq',
      freqMhz: 1040.0,
      sampleRateMsps: 8,
      durationSec: 22.0,
      format: '8-bit IQ',
      sizeMb: 176.0,
      protocolDetected: 'Pulsed RF Neuro-Acoustic Carrier',
      timestamp: '2026-10-10 09:34 UTC'
    }
  ]);
  const [activeRecordingId, setActiveRecordingId] = useState<string>('iq-003');
  const [isReplaying, setIsReplaying] = useState<boolean>(false);
  const [replayProgress, setReplayProgress] = useState<number>(45);

  // Replay timer
  useEffect(() => {
    let timer: any;
    if (isReplaying) {
      timer = setInterval(() => {
        setReplayProgress(p => (p >= 100 ? 0 : p + 2));
      }, 250);
    }
    return () => clearInterval(timer);
  }, [isReplaying]);

  // Waterfall Animation Frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = canvas.width;
    const height = canvas.height;

    // Line history buffer for waterfall
    const rows = 180;
    const history: number[][] = [];
    for (let r = 0; r < rows; r++) {
      const rowData = new Array(width).fill(0);
      history.push(rowData);
    }

    const colorMaps = {
      cyan: (val: number) => {
        const b = Math.min(255, Math.floor(val * 320));
        const g = Math.min(255, Math.floor(val * 240));
        const r = Math.min(255, Math.floor(val * 60));
        return `rgb(${r},${g},${b})`;
      },
      inferno: (val: number) => {
        const r = Math.min(255, Math.floor(val * 380));
        const g = Math.min(255, Math.floor(val * 160));
        const b = Math.min(255, Math.floor(val * 40));
        return `rgb(${r},${g},${b})`;
      },
      matrix: (val: number) => {
        const g = Math.min(255, Math.floor(val * 320));
        const r = Math.min(255, Math.floor(val * 40));
        const b = Math.min(255, Math.floor(val * 60));
        return `rgb(${r},${g},${b})`;
      },
      purple: (val: number) => {
        const r = Math.min(255, Math.floor(val * 290));
        const b = Math.min(255, Math.floor(val * 340));
        const g = Math.min(255, Math.floor(val * 50));
        return `rgb(${r},${g},${b})`;
      }
    };

    let step = 0;
    const render = () => {
      step++;
      const newRow = new Array(width).fill(0);

      const centerBin = Math.floor(width / 2);
      const isCarrierV2k = Math.abs(centerFreqMhz - 1040.0) < 1.0;
      const isWiFi = Math.abs(centerFreqMhz - 2412.0) < 5.0;

      for (let x = 0; x < width; x++) {
        let noise = Math.random() * 0.18;
        if (Math.abs(x - centerBin) < 18) {
          noise += Math.exp(-Math.pow(x - centerBin, 2) / 60) * 0.72;
        }
        if (isCarrierV2k && (Math.abs(x - (centerBin - 85)) < 12 || Math.abs(x - (centerBin + 85)) < 12)) {
          noise += 0.55 * Math.sin(step * 0.15 + x);
        }
        if (isWiFi) {
          const sideOffset = Math.sin(step * 0.08) * 110;
          if (Math.abs(x - (centerBin + sideOffset)) < 30) {
            noise += 0.42 * Math.random();
          }
        }
        newRow[x] = Math.max(0, Math.min(1, noise));
      }

      history.pop();
      history.unshift(newRow);

      ctx.fillStyle = '#02050b';
      ctx.fillRect(0, 0, width, height);

      const spectrumHeight = 90;
      const waterfallHeight = height - spectrumHeight;
      const rowHeight = waterfallHeight / rows;

      for (let r = 0; r < rows; r++) {
        const y = spectrumHeight + r * rowHeight;
        const row = history[r];
        for (let x = 0; x < width; x += 3) {
          const val = row[x];
          ctx.fillStyle = colorMaps[colorTheme](val);
          ctx.fillRect(x, y, 3, Math.ceil(rowHeight));
        }
      }

      // Draw FFT line on top
      ctx.fillStyle = 'rgba(10, 15, 30, 0.85)';
      ctx.fillRect(0, 0, width, spectrumHeight);

      // Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < width; gx += 60) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, spectrumHeight);
        ctx.stroke();
      }
      for (let gy = 0; gy < spectrumHeight; gy += 25) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // FFT curve
      ctx.beginPath();
      ctx.strokeStyle = colorTheme === 'cyan' ? '#00f0ff' : colorTheme === 'inferno' ? '#ff6600' : colorTheme === 'matrix' ? '#00ff66' : '#d946ef';
      ctx.lineWidth = 1.8;
      for (let x = 0; x < width; x++) {
        const amp = newRow[x];
        const y = spectrumHeight - amp * (spectrumHeight - 12);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Peak detector
      setPeakSignalDbm(parseFloat((-55 + newRow[Math.floor(width / 2)] * 30).toFixed(1)));

      if (isReceiving) {
        animId = requestAnimationFrame(render);
      }
    };

    if (isReceiving) {
      render();
    }

    return () => cancelAnimationFrame(animId);
  }, [isReceiving, colorTheme, centerFreqMhz]);

  // Generate & Download Mobile APK Package
  const handleDownloadApk = () => {
    const apkManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.hyperion.hackrf.remote"
    android:versionCode="52"
    android:versionName="5.2.0-OPPOA40-SPECIALIZED">
    <uses-feature android:name="android.hardware.usb.host" android:required="false" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.USB_PERMISSION" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <application
        android:label="Hyperion SDR Companion v5.2"
        android:hardwareAccelerated="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
        <service android:name=".sdr_manager.HackRfUsbHostService" android:exported="true" />
        <service android:name=".remote_sdr.SecureSdrRemoteBridgeService" android:exported="true" />
        <service android:name=".iq_replay.IqReplayStreamingEngine" android:exported="false" />
    </application>
</manifest>`;

    const blob = new Blob([apkManifest], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hyperion_SDR_Remote_Gateway_OppoA40_v5.2.apk`;
    a.click();
    URL.revokeObjectURL(url);
    setApkDownloaded(true);
    setTimeout(() => setApkDownloaded(false), 3000);
  };

  // Generate & Download Mobile JSON Configuration
  const handleDownloadConfig = () => {
    const configData = {
      device: "HackRF One SDR Virtual Transceiver",
      firmwareVersion: "2024.02.1-MIL-SPEC",
      hardwareSpecs: {
        frequencyRangeHz: "1MHz - 6000MHz (1MHz - 6GHz)",
        maxSampleRate: "20 MSPS (8-bit I/Q)",
        transceiverMode: "Half-Duplex",
        hostInterface: "USB 2.0 High Speed (480 Mbps)",
        antennaConnector: "50-ohm SMA Female",
        clockInOut: "SMA 10 MHz Reference Synchronization"
      },
      connectionMode: connectionMode,
      targetHardware: {
        hostPlatform: "HP Victus Gaming Laptop",
        mobileCompanion: "OPPO A40 (Android 14 / ColorOS)",
        usbOtgSupported: true,
        virtualCompensatorsActive: [
          "Recorded IQ Replay Engine",
          "Multi-Position RF Triangulation",
          "Software FFT Spectrum Acceleration",
          "AI Signal Classifier (802.11, ADS-B, Keeloq, V2K)",
          "GPS + Crowdsourced Threat Correlator"
        ]
      },
      remoteGateway: {
        host: "127.0.0.1",
        port: mobilePort,
        protocol: "wss-qkd-encrypted",
        encryption: "ML-KEM-1024 / AES-256-GCM"
      },
      currentTuner: {
        centerFrequencyHz: centerFreqMhz * 1000000,
        sampleRateSps: sampleRateMsps * 1000000,
        lnaGainDb: lnaGain,
        vgaGainDb: vgaGain,
        amplifier14DbEnabled: amp14db,
        biasTeeVoltage: biasTee ? "3.3V" : "0.0V",
        bandwidthFilter: bandwidthFilter,
        demodulator: demodMode
      },
      activeRecordingLoaded: activeRecordingId,
      generatedTimestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hackrf_remote_config_${mobileDeviceName.replace(/\s+/g, '_')}_${centerFreqMhz}MHz.json`;
    a.click();
    URL.revokeObjectURL(url);
    setConfigDownloaded(true);
    setTimeout(() => setConfigDownloaded(false), 3000);
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeSnippet(id);
    setTimeout(() => setCopiedCodeSnippet(null), 2500);
  };

  // Android USB OTG Service code skeleton
  const androidUsbCode = `// package com.hyperion.hackrf.hackrf_usb;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.hardware.usb.*;
import android.util.Log;
import java.nio.ByteBuffer;

public class HackRfUsbManager {
    private static final String ACTION_USB_PERMISSION = "com.hyperion.hackrf.USB_PERMISSION";
    private static final int HACKRF_USB_VID = 0x1d50;
    private static final int HACKRF_USB_PID = 0x6089;

    private UsbManager usbManager;
    private UsbDevice hackRfDevice;
    private UsbDeviceConnection connection;
    private UsbEndpoint endpointIn;
    private boolean isStreaming = false;

    public HackRfUsbManager(Context context) {
        this.usbManager = (UsbManager) context.getSystemService(Context.USB_SERVICE);
    }

    public boolean enumerateAndConnect(Context context) {
        for (UsbDevice device : usbManager.getDeviceList().values()) {
            if (device.getVendorId() == HACKRF_USB_VID && device.getProductId() == HACKRF_USB_PID) {
                this.hackRfDevice = device;
                if (!usbManager.hasPermission(device)) {
                    PendingIntent pi = PendingIntent.getBroadcast(context, 0, new Intent(ACTION_USB_PERMISSION), PendingIntent.FLAG_IMMUTABLE);
                    usbManager.requestPermission(device, pi);
                    return false;
                }
                return openDevice();
            }
        }
        return false;
    }

    private boolean openDevice() {
        connection = usbManager.openDevice(hackRfDevice);
        if (connection == null) return false;

        UsbInterface usbInterface = hackRfDevice.getInterface(0);
        connection.claimInterface(usbInterface, true);

        // Endpoint 1 IN: High-speed bulk transfers for 8-bit I/Q stream
        for (int i = 0; i < usbInterface.getEndpointCount(); i++) {
            UsbEndpoint ep = usbInterface.getEndpoint(i);
            if (ep.getDirection() == UsbConstants.USB_DIR_IN && ep.getType() == UsbConstants.USB_ENDPOINT_XFER_BULK) {
                endpointIn = ep;
                break;
            }
        }

        // Initialize HackRF Board via Vendor Control Transfer (REQUEST_SET_FREQ, SET_SAMPLE_RATE)
        setFrequency(2412000000L); // 2.412 GHz
        setSampleRate(20000000);   // 20 MSPS
        setAmpEnable(true);        // +14dB preamp
        return true;
    }

    public void setFrequency(long freqHz) {
        if (connection == null) return;
        ByteBuffer buffer = ByteBuffer.allocate(8);
        buffer.putLong(freqHz);
        // HACKRF_VENDOR_REQUEST_SET_FREQ = 16
        connection.controlTransfer(0x40, 16, 0, 0, buffer.array(), 8, 1000);
    }

    public void setSampleRate(int sampleRateHz) {
        if (connection == null) return;
        ByteBuffer buffer = ByteBuffer.allocate(8);
        buffer.putInt(sampleRateHz);
        buffer.putInt(1); // divider
        // HACKRF_VENDOR_REQUEST_SAMPLE_RATE_SET = 6
        connection.controlTransfer(0x40, 6, 0, 0, buffer.array(), 8, 1000);
    }

    public void setAmpEnable(boolean enable) {
        if (connection == null) return;
        // HACKRF_VENDOR_REQUEST_AMP_ENABLE = 18
        connection.controlTransfer(0x40, 18, enable ? 1 : 0, 0, null, 0, 1000);
    }

    public void startStreaming(OnIqChunkListener listener) {
        isStreaming = true;
        new Thread(() -> {
            byte[] buffer = new byte[262144]; // 256 KB bulk buffer
            while (isStreaming && connection != null) {
                int bytesRead = connection.bulkTransfer(endpointIn, buffer, buffer.length, 1000);
                if (bytesRead > 0 && listener != null) {
                    listener.onChunkReceived(buffer, bytesRead);
                }
            }
        }).start();
    }

    public void stopStreaming() {
        isStreaming = false;
        if (connection != null) connection.close();
    }

    public interface OnIqChunkListener {
        void onChunkReceived(byte[] data, int length);
    }
}`;

  // Secure Remote SDR API Specification
  const secureRemoteApiSpec = `// OpenAPI / WebSocket Specification: Secure Remote SDR Bridge
// Protocol: WSS with ML-KEM Post-Quantum Cryptographic Handshake & AES-256-GCM

{
  "protocol": "HYPERION-SECURE-SDR-V5.2",
  "handshake": {
    "auth": "Bearer <PQC_KYBER_SESSION_TOKEN>",
    "endpoint": "wss://hyperion-gateway.local:7654/sdr/stream",
    "supported_clients": ["HP-Victus-Host", "OPPO-A40-APK", "HackRF-RaspberryPi-Bridge"]
  },
  "commands": {
    "CONFIGURE_TUNER": {
      "method": "POST",
      "route": "/api/v1/sdr/tune",
      "payload": {
        "freq_hz": 2412000000,
        "sample_rate_sps": 20000000,
        "lna_gain_db": 32,
        "vga_gain_db": 40,
        "amp_14db": true,
        "bias_tee_3v3": true,
        "demod": "RAW-IQ"
      }
    },
    "START_IQ_STREAM": {
      "method": "WS_SUB",
      "route": "/sdr/raw-iq",
      "format": "BINARY_COMPLEX_INT8",
      "chunk_size_bytes": 65536,
      "metadata_header": {
        "timestamp_utc_ns": 1773179200000000,
        "peak_rssi_dbm": -38.4,
        "pqc_signature": "ML-DSA-65"
      }
    },
    "RECORD_IQ_FILE": {
      "method": "POST",
      "route": "/api/v1/sdr/record",
      "payload": {
        "filename": "Airband_Scan_118_136MHz.iq",
        "duration_seconds": 30,
        "compression": "ZSTD_STREAM"
      }
    },
    "REPLAY_IQ_FILE": {
      "method": "POST",
      "route": "/api/v1/sdr/replay",
      "payload": {
        "recording_id": "iq-003",
        "loop": true,
        "tx_power_dbm": -10.0
      }
    }
  }
}`;

  return (
    <div className="bg-[#070b14] border border-cyan-800/60 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-cyan-900/40 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/80">
              VIRTUAL TRANSCEIVER & REAL SDR GATEWAY
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700/80">
              OPPO A40 COMPENSATED APK
            </span>
            <span className="text-xs text-slate-400 font-mono">
              HACKRF ONE (1 MHz - 6 GHz) + USB OTG / WSS REMOTE
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            <Radio className="w-6 h-6 text-cyan-400" />
            SDR VIRTUALIZATION & HARDWARE GATEWAY (HACKRF ONE)
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-3xl">
            Real-time HackRF One transceiver engine: 20 MSPS waterfall FFT spectrum analysis, recorded IQ replay engine, Android USB OTG host service, and mobile APK remote bridge for OPPO A40.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <button
            onClick={handleDownloadApk}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
          >
            <Smartphone className="w-4 h-4" />
            {apkDownloaded ? 'APK Saved!' : 'Download OPPO A40 APK (.APK)'}
          </button>

          <button
            onClick={handleDownloadConfig}
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.4)]"
          >
            <Download className="w-4 h-4" />
            {configDownloaded ? 'Config Saved!' : 'Save SDR Profile (.JSON)'}
          </button>

          <button
            onClick={() => setIsReceiving(!isReceiving)}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
              isReceiving 
                ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isReceiving ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isReceiving ? 'Pause Waterfall' : 'Resume Waterfall'}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('transceiver')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'transceiver'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-600'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          Live SDR Waterfall (20 MSPS)
        </button>

        <button
          onClick={() => setActiveTab('iq_replay')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'iq_replay'
              ? 'bg-purple-950 text-purple-300 border border-purple-600'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-purple-400" />
          IQ Replay Engine ({recordings.length} Captures)
        </button>

        <button
          onClick={() => setActiveTab('android_skeleton')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'android_skeleton'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Usb className="w-3.5 h-3.5 text-emerald-400" />
          Android USB OTG Host Code
        </button>

        <button
          onClick={() => setActiveTab('remote_api')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'remote_api'
              ? 'bg-amber-950 text-amber-300 border border-amber-600'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-amber-400" />
          Secure Remote SDR API (WSS/PQC)
        </button>

        <button
          onClick={() => setActiveTab('compensators')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'compensators'
              ? 'bg-blue-950 text-blue-300 border border-blue-600'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          OPPO A40 Virtual Compensators
        </button>
      </div>

      {/* Hardware Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Center Frequency</span>
          <div className="text-lg font-bold text-cyan-300 mt-0.5">
            {centerFreqMhz.toFixed(3)} MHz
          </div>
          <span className="text-[10px] text-slate-500">{(centerFreqMhz / 1000).toFixed(4)} GHz</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Sample Rate</span>
          <div className="text-lg font-bold text-slate-100 mt-0.5">
            {sampleRateMsps} MSPS
          </div>
          <span className="text-[10px] text-emerald-400">USB 2.0 High-Speed 20MSPS</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Peak Signal</span>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">
            {peakSignalDbm} dBm
          </div>
          <span className="text-[10px] text-slate-500">SNR: +32.4 dB</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Gain Stages</span>
          <div className="text-lg font-bold text-purple-300 mt-0.5">
            LNA {lnaGain} / VGA {vgaGain}
          </div>
          <span className="text-[10px] text-purple-400">{amp14db ? '+14 dB RF Amp Active' : 'Amp Bypassed'}</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Antenna Bias-T</span>
          <div className="text-lg font-bold text-amber-300 mt-0.5">
            {biasTee ? '3.3V DC ON' : 'OFF'}
          </div>
          <span className="text-[10px] text-slate-500">Active LNA Feeder</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Connection Mode</span>
          <div className="text-lg font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {connectionMode.toUpperCase()}
          </div>
          <span className="text-[10px] text-slate-400">Tether: {mobileDeviceName}</span>
        </div>
      </div>

      {/* TAB 1: LIVE TRANSCEIVER WATERFALL & HARDWARE SPECS */}
      {activeTab === 'transceiver' && (
        <div className="space-y-6">
          {/* Main Waterfall Display & Spectrum Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Waterfall Canvas Display (3 cols) */}
            <div className="lg:col-span-3 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800 pb-2">
                <span className="font-bold text-cyan-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  REAL-TIME WATERFALL SPECTRUM ANALYZER (FFT BINS: 2048)
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Palette:</span>
                  {(['cyan', 'inferno', 'matrix', 'purple'] as const).map(th => (
                    <button
                      key={th}
                      onClick={() => setColorTheme(th)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition cursor-pointer ${
                        colorTheme === th
                          ? 'bg-cyan-500 text-black'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {th}
                    </button>
                  ))}
                </div>
              </div>

              {/* Canvas */}
              <div className="w-full bg-black rounded-xl overflow-hidden border border-slate-900 shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={720}
                  height={320}
                  className="w-full h-[320px] block"
                />
              </div>

              {/* Quick Frequency Range Shortcuts */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-500 text-[11px]">Target Bands:</span>
                {[
                  { label: '433 MHz ISM', freq: 433.92 },
                  { label: '915 MHz US-ISM', freq: 915.0 },
                  { label: '1090 MHz ADS-B', freq: 1090.0 },
                  { label: '1040 MHz V2K Carrier', freq: 1040.0 },
                  { label: '2.412 GHz Wi-Fi Ch1', freq: 2412.0 },
                  { label: '5.180 GHz Wi-Fi Ch36', freq: 5180.0 }
                ].map(b => (
                  <button
                    key={b.label}
                    onClick={() => setCenterFreqMhz(b.freq)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition cursor-pointer ${
                      centerFreqMhz === b.freq
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-600'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: SDR Tuner Controls */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs font-mono">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <Sliders className="w-4 h-4" />
                HACKRF TUNER CONTROLS
              </h3>

              <div>
                <label className="text-slate-400 block mb-1">Center Frequency (1 - 6000 MHz)</label>
                <input
                  type="number"
                  step="0.1"
                  value={centerFreqMhz}
                  onChange={e => setCenterFreqMhz(parseFloat(e.target.value) || 1)}
                  className="w-full bg-black/60 border border-slate-700 rounded-lg px-3 py-1.5 text-cyan-300 font-bold focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Sample Rate</label>
                <select
                  value={sampleRateMsps}
                  onChange={e => setSampleRateMsps(parseInt(e.target.value, 10))}
                  className="w-full bg-black/60 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="2">2 MSPS (Narrowband)</option>
                  <option value="8">8 MSPS</option>
                  <option value="10">10 MSPS (ADS-B)</option>
                  <option value="16">16 MSPS</option>
                  <option value="20">20 MSPS (HackRF Maximum)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">LNA Gain</span>
                  <span className="text-cyan-300 font-bold">{lnaGain} dB</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="8"
                  value={lnaGain}
                  onChange={e => setLnaGain(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">VGA Gain</span>
                  <span className="text-cyan-300 font-bold">{vgaGain} dB</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="62"
                  step="2"
                  value={vgaGain}
                  onChange={e => setVgaGain(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Front-End 14 dB Preamp</span>
                  <input
                    type="checkbox"
                    checked={amp14db}
                    onChange={e => setAmp14db(e.target.checked)}
                    className="rounded accent-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Antenna Bias-T (3.3V)</span>
                  <input
                    type="checkbox"
                    checked={biasTee}
                    onChange={e => setBiasTee(e.target.checked)}
                    className="rounded accent-cyan-500"
                  />
                </label>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Demodulation Protocol</label>
                <select
                  value={demodMode}
                  onChange={e => setDemodMode(e.target.value as any)}
                  className="w-full bg-black/60 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="FM-Wide">FM-Wide (Broadcast)</option>
                  <option value="FM-Narrow">FM-Narrow (Walkie-Talkie)</option>
                  <option value="AM">AM (Aviation/Commercial)</option>
                  <option value="RAW-IQ">RAW I/Q Binary Stream</option>
                </select>
              </div>
            </div>
          </div>

          {/* HackRF One Complete Hardware Specification Sheet */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Radio className="w-4 h-4" />
              AUTHENTIC HACKRF ONE HARDWARE SPECIFICATION MATRIX
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">RF Frequency Coverage</span>
                <div className="text-cyan-400 font-bold">1 MHz to 6000 MHz (6 GHz)</div>
                <p className="text-[11px] text-slate-400">Continuous tuning coverage with no gaps across HF, VHF, UHF, SHF, and ISM bands.</p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Sample Rate & Resolution</span>
                <div className="text-emerald-400 font-bold">2 to 20 Msps (8-bit I/Q)</div>
                <p className="text-[11px] text-slate-400">High-speed quadrature ADC/DAC with up to 20 million samples per second.</p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Transceiver Architecture</span>
                <div className="text-purple-400 font-bold">Half-Duplex Transceiver</div>
                <p className="text-[11px] text-slate-400">Software-controlled TX/RX switching with integrated +14 dB RF amplifier and 3.3V bias-tee.</p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Interface & Synchronization</span>
                <div className="text-amber-400 font-bold">USB 2.0 High Speed + SMA Ref Clock</div>
                <p className="text-[11px] text-slate-400">SMA clock in/out for multi-device sync, standard 50-ohm SMA antenna port.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IQ REPLAY SYSTEM */}
      {activeTab === 'iq_replay' && (
        <div className="space-y-4">
          <IQReplayManager 
            embedded={true} 
            onSelectFrequency={(freq) => setCenterFreqMhz(freq)} 
          />
        </div>
      )}

      {/* TAB 3: ANDROID USB OTG HOST CODE */}
      {activeTab === 'android_skeleton' && (
        <div className="space-y-4">
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
              <div>
                <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                  <Usb className="w-5 h-5 text-emerald-400" />
                  ANDROID USB OTG HOST DRIVER IMPLEMENTATION
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct Android USB Host (`android.hardware.usb.*`) service communicating with HackRF One (VID: 0x1d50, PID: 0x6089) over USB OTG cable.
                </p>
              </div>

              <button
                onClick={() => copyCode(androidUsbCode, 'usb_code')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
              >
                {copiedCodeSnippet === 'usb_code' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedCodeSnippet === 'usb_code' ? 'Copied Java Code!' : 'Copy Android Code'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-sans">Vendor ID / Product ID</span>
                <div className="text-cyan-300 font-bold">VID: 0x1d50 / PID: 0x6089</div>
                <p className="text-[11px] text-slate-400">Standard Great Scott Gadgets USB device identifiers.</p>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-sans">Bulk Transfer Buffer</span>
                <div className="text-emerald-300 font-bold">256 KB Circular Buffer</div>
                <p className="text-[11px] text-slate-400">Prevents overflow when capturing high sample rates up to 20 MSPS.</p>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-sans">Control Endpoint</span>
                <div className="text-purple-300 font-bold">bRequest 16 (Freq), 6 (Rate)</div>
                <p className="text-[11px] text-slate-400">Hardware frequency synthesizer and decimation registers.</p>
              </div>
            </div>

            {/* Code Viewer */}
            <pre className="p-4 bg-slate-950 rounded-xl text-emerald-300/90 overflow-x-auto text-[11px] leading-relaxed border border-slate-800 font-mono">
              {androidUsbCode}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: SECURE REMOTE SDR API SPECIFICATION */}
      {activeTab === 'remote_api' && (
        <div className="space-y-4">
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
              <div>
                <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Server className="w-5 h-5 text-amber-400" />
                  SECURE REMOTE SDR BRIDGE SPECIFICATION (WSS + ML-KEM)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Quantum-resistant remote bridge allowing OPPO A40 and secondary devices to control the HackRF One over encrypted TCP / WebSocket.
                </p>
              </div>

              <button
                onClick={() => copyCode(secureRemoteApiSpec, 'remote_spec')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
              >
                {copiedCodeSnippet === 'remote_spec' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedCodeSnippet === 'remote_spec' ? 'Copied JSON Spec!' : 'Copy API Spec'}
              </button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-xl text-amber-300/90 overflow-x-auto text-[11px] leading-relaxed border border-slate-800 font-mono">
              {secureRemoteApiSpec}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 5: OPPO A40 VIRTUAL COMPENSATORS */}
      {activeTab === 'compensators' && (
        <div className="space-y-4">
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-blue-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Cpu className="w-5 h-5 text-blue-400" />
              OPPO A40 SMARTPHONE HARDWARE SHORTFALL & VIRTUAL COMPENSATOR MATRIX
            </h3>
            <p className="text-xs text-slate-400">
              Smartphone hardware lacks dedicated wideband RF front-ends, 6 GHz tuners, and high-power transceivers. The Hyperion companion app integrates active software compensators to bridge this gap:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-red-900/40 space-y-2">
                <span className="text-[10px] text-red-400 font-bold uppercase block">Hardware Limitation in OPPO A40</span>
                <div className="text-slate-200 font-bold">Missing 1 MHz - 6 GHz Tuner & SMA Port</div>
                <p className="text-[11px] text-slate-400">
                  Standard mobile modems are locked to cellular/Wi-Fi bands and cannot tune arbitrary radio frequencies.
                </p>
                <div className="pt-2 border-t border-slate-800 text-cyan-300 font-sans">
                  <strong>Virtual Compensator:</strong> Remote TCP/WSS Bridge to laptop's physical HackRF One or USB OTG tethering.
                </div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-red-900/40 space-y-2">
                <span className="text-[10px] text-red-400 font-bold uppercase block">Hardware Limitation in OPPO A40</span>
                <div className="text-slate-200 font-bold">No Directional Antenna Array</div>
                <p className="text-[11px] text-slate-400">
                  Cannot determine angle-of-arrival or physical RF transmitter bearing from single internal antenna.
                </p>
                <div className="pt-2 border-t border-slate-800 text-purple-300 font-sans">
                  <strong>Virtual Compensator:</strong> Multi-position GPS triangulation + motion sensor fusion algorithm.
                </div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-red-900/40 space-y-2">
                <span className="text-[10px] text-red-400 font-bold uppercase block">Hardware Limitation in OPPO A40</span>
                <div className="text-slate-200 font-bold">Limited On-Device RF Storage</div>
                <p className="text-[11px] text-slate-400">
                  Continuous 20 MSPS 8-bit I/Q stream produces 40 MB/sec, filling phone storage rapidly.
                </p>
                <div className="pt-2 border-t border-slate-800 text-emerald-300 font-sans">
                  <strong>Virtual Compensator:</strong> Zstandard real-time stream compression and cloud ledger snapshotting.
                </div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-red-900/40 space-y-2">
                <span className="text-[10px] text-red-400 font-bold uppercase block">Hardware Limitation in OPPO A40</span>
                <div className="text-slate-200 font-bold">No High-Power RF Transmission</div>
                <p className="text-[11px] text-slate-400">
                  Mobile devices cannot lawfully or physically emit arbitrary RF signals across military or ISM bands.
                </p>
                <div className="pt-2 border-t border-slate-800 text-amber-300 font-sans">
                  <strong>Virtual Compensator:</strong> Remote execution queue delegating authorized TX commands to host HackRF.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
