export interface SettingItem {
  id: string;
  name: string;
  category: string;
  value: string | number | boolean;
  type: 'toggle' | 'slider' | 'select' | 'input';
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
  description: string;
  target: 'HP Victus' | 'Oppo A40' | 'Virtual VM' | 'HackRF One' | 'Global';
}

// 25 Core Hardware & Virtual VM Hypervisor Options
export const VM_HYPERVISOR_25_OPTIONS: SettingItem[] = [
  { id: 'vm-01', name: 'QEMU Micro-VM Hardware Assist', category: 'Virtual Hardware', value: true, type: 'toggle', description: 'Enforce hardware-level virtualization via KVM/VT-x extensions on HP Victus AMD Ryzen/Intel core.', target: 'HP Victus' },
  { id: 'vm-02', name: 'Firecracker MicroVM Fast-Boot', category: 'Virtual Hardware', value: true, type: 'toggle', description: 'Spawn isolated sub-5ms micro-VM sandboxes for untrusted binary execution.', target: 'Virtual VM' },
  { id: 'vm-03', name: 'PCIe IOMMU Direct Pass-Through', category: 'Virtual Hardware', value: true, type: 'toggle', description: 'Isolate discrete GPU and SDR controllers from host memory addressing space.', target: 'HP Victus' },
  { id: 'vm-04', name: 'Discrete TPM 2.0 Virtual V-TPM', category: 'Virtual Hardware', value: 'Sealed-PCR-07', type: 'select', options: ['Sealed-PCR-07', 'Strict-Attestation', 'FIPS-140-3'], description: 'Cryptographically bridge physical TPM keys into virtualized container memory.', target: 'HP Victus' },
  { id: 'vm-05', name: 'Virtual CPU Core Pinning', category: 'Compute Allocation', value: 8, type: 'slider', min: 2, max: 16, unit: 'Cores', description: 'Dedicated CPU thread affinity for real-time SDR DSP and Grover cryptanalysis.', target: 'HP Victus' },
  { id: 'vm-06', name: 'DRAM Memory Shield Enclave', category: 'Memory Sandbox', value: 16, type: 'slider', min: 4, max: 32, unit: 'GB', description: 'Hardware-encrypted RAM enclave using AMD SEV / Intel SGX technology.', target: 'HP Victus' },
  { id: 'vm-07', name: 'NVMe Virtual Storage Striping', category: 'Storage', value: 'AES-XTS-512', type: 'select', options: ['AES-XTS-512', 'Kyber-Sealed', 'ChaCha20-Poly1305'], description: 'Zero-trace ephemeral RAM disk for swap and intermediate cryptographic states.', target: 'Virtual VM' },
  { id: 'vm-08', name: 'Direct DMA Bus Guard', category: 'Bus Isolation', value: true, type: 'toggle', description: 'Block rogue DMA requests from peripheral interfaces and docking ports.', target: 'HP Victus' },
  { id: 'vm-09', name: 'Virtual USB 3.0 Host Controller', category: 'Peripheral Bridge', value: true, type: 'toggle', description: 'Dedicated USB 3.0 bridge isolated for HackRF One high-speed sample streaming.', target: 'HackRF One' },
  { id: 'vm-10', name: 'Baseband Hardware Hypervisor', category: 'Mobile Radio', value: true, type: 'toggle', description: 'Quarantine cellular baseband modem requests inside hardware TEE.', target: 'Oppo A40' },
  { id: 'vm-11', name: 'Hypervisor Inter-Process Zero-Copy', category: 'IPC Fabric', value: true, type: 'toggle', description: 'Shared memory ring buffers with cryptographic access control tokens.', target: 'Virtual VM' },
  { id: 'vm-12', name: 'GPU Compute CUDA/ROCm Sandbox', category: 'Acceleration', value: true, type: 'toggle', description: 'Run lattice matrix vector multiplications directly inside protected GPU context.', target: 'HP Victus' },
  { id: 'vm-13', name: 'Kernel Page Table Isolation (KPTI)', category: 'CPU Hardening', value: true, type: 'toggle', description: 'Mitigate Meltdown/Spectre CPU branch speculative execution side-channels.', target: 'HP Victus' },
  { id: 'vm-14', name: 'Nested Virtualization Layer 2', category: 'Hypervisor', value: true, type: 'toggle', description: 'Support nested Docker/Podman containers within QEMU virtualization instances.', target: 'Virtual VM' },
  { id: 'vm-15', name: 'Virtual BIOS Sure Start Self-Heal', category: 'Firmware', value: true, type: 'toggle', description: 'HP Sure Start hardware BIOS microcode state monitor with auto-restore.', target: 'HP Victus' },
  { id: 'vm-16', name: 'Isolated VFIO Network Interface', category: 'Networking', value: 'Bridge-SR-IOV', type: 'select', options: ['Bridge-SR-IOV', 'MACVTAP-Isolated', 'Tor-QKD-Tunnel'], description: 'Direct virtual network interface with zero host-OS packet visibility.', target: 'Virtual VM' },
  { id: 'vm-17', name: 'Live Snapshot Rollback on Threat', category: 'Autonomous Recovery', value: true, type: 'toggle', description: 'Instant microsecond RAM state rollback upon malware signature detection.', target: 'Virtual VM' },
  { id: 'vm-18', name: 'Virtual COM/UART Diagnostic Port', category: 'Serial Telemetry', value: 'Baud-921600', type: 'select', options: ['Baud-115200', 'Baud-921600', 'Optical-Airgap'], description: 'Isolated serial stream for raw telemetry logging and forensic trace capture.', target: 'HP Victus' },
  { id: 'vm-19', name: 'Real-Time Clock (RTC) Drift Shield', category: 'Timing Precision', value: true, type: 'toggle', description: 'Hardware timestamp counter synchronization for microsecond arbitrage accuracy.', target: 'Virtual VM' },
  { id: 'vm-20', name: 'Hardware RNG Entropy Feeder', category: 'Entropy Source', value: true, type: 'toggle', description: 'Pass quantum thermal noise and TPM TRNG directly to guest cryptographic seeds.', target: 'Global' },
  { id: 'vm-21', name: 'Virtual Sound Card Null Sink', category: 'Audio Hardening', value: true, type: 'toggle', description: 'Intercept and neutralize acoustic keyloggers and ultrasonic beacon carriers.', target: 'HP Victus' },
  { id: 'vm-22', name: 'Memory Scrub on Guest Exit', category: 'Forensic Scrub', value: true, type: 'toggle', description: 'Overwrites guest RAM pages with DoD 5220.22-M zero patterns upon shutdown.', target: 'Virtual VM' },
  { id: 'vm-23', name: 'Anti-Forensics Cold-Boot Guard', category: 'Anti-Forensics', value: true, type: 'toggle', description: 'Scrambles memory bus keys immediately if power loss or lid tampering occurs.', target: 'HP Victus' },
  { id: 'vm-24', name: 'Isolated Display DRM Compositor', category: 'Graphics Guard', value: true, type: 'toggle', description: 'Hardware overlay protection preventing third-party apps from screen capturing.', target: 'HP Victus' },
  { id: 'vm-25', name: 'Hypervisor Health Heartbeat Watchdog', category: 'Reliability', value: 100, type: 'slider', min: 10, max: 500, unit: 'ms', description: 'Hardware watchdog timer triggering self-kill if hypervisor state hangs.', target: 'Virtual VM' }
];

// 25 Trade Secret, Anti-Reverse Engineering & Self-Obfuscation Settings
export const TRADE_SECRET_25_SETTINGS: SettingItem[] = [
  { id: 'ts-01', name: 'Strict Device Lock: HP Victus Only', category: 'Hardware Identity', value: true, type: 'toggle', description: 'Refuses execution unless physical HP Victus motherboard UUID and SMBIOS match.', target: 'HP Victus' },
  { id: 'ts-02', name: 'Continuous Binary Self-Hashing (SHA-512)', category: 'Integrity Seal', value: true, type: 'toggle', description: 'Dynamically hashes runtime memory pages every 250ms; self-destructs if modified.', target: 'Global' },
  { id: 'ts-03', name: 'Polymorphic Instruction Mutation', category: 'Obfuscation', value: true, type: 'toggle', description: 'Rewrites in-memory function call opcodes with cryptographic JIT permutations.', target: 'Global' },
  { id: 'ts-04', name: 'Anti-Debugging Hook Detection', category: 'Anti-RE', value: true, type: 'toggle', description: 'Terminates process if ptrace, x64dbg, IDA Pro, Ghidra, or Frida hooks are detected.', target: 'HP Victus' },
  { id: 'ts-05', name: 'Reverse-Engineering Trapdoor Injection', category: 'Counter-Offensive', value: true, type: 'toggle', description: 'Injects deceptive fake cryptographic keys and honeypot pointers into memory dumps.', target: 'Global' },
  { id: 'ts-06', name: 'Automated Host System Decompiler', category: 'Host Analysis', value: true, type: 'toggle', description: 'Audits host OS kernel drivers for unauthorized telemetry and backdoors.', target: 'HP Victus' },
  { id: 'ts-07', name: 'Zero-Trace Binary Shredder', category: 'Anti-Forensics', value: true, type: 'toggle', description: 'Instantly scrubs disk sectors with 7-pass random bit patterns upon exit.', target: 'Global' },
  { id: 'ts-08', name: 'Intel/AMD Microcode Signature Audit', category: 'Hardware Trust', value: true, type: 'toggle', description: 'Verifies CPU microcode rev version to prevent rogue hypervisor installations.', target: 'HP Victus' },
  { id: 'ts-09', name: 'Oppo A40 TEE Remote Attestation', category: 'Mobile Trust', value: true, type: 'toggle', description: 'Validates cryptographic hardware certificate chains on connected Oppo A40.', target: 'Oppo A40' },
  { id: 'ts-10', name: 'Dynamic String Decryption on Demand', category: 'Obfuscation', value: true, type: 'toggle', description: 'Encrypted strings decrypted only at the exact instruction of execution, then wiped.', target: 'Global' },
  { id: 'ts-11', name: 'Timing Defense against Single-Stepping', category: 'Anti-RE', value: true, type: 'toggle', description: 'Calculates RDTSC cycles between instructions to identify debugger pauses.', target: 'HP Victus' },
  { id: 'ts-12', name: 'Virtual Machine Escape Blocker', category: 'Sandbox Guard', value: true, type: 'toggle', description: 'Prevents guest VM exploitation into host ring-0 kernel memory.', target: 'Virtual VM' },
  { id: 'ts-13', name: 'Obfuscated Galois Field Arithmetic', category: 'Cryptanalysis IP', value: true, type: 'toggle', description: 'Protects proprietary GF(2) and Grover oracle algorithms from disassembly.', target: 'Global' },
  { id: 'ts-14', name: 'Air-Gap Beacon Detector', category: 'RF Security', value: true, type: 'toggle', description: 'Monitors acoustic, optical, and electromagnetic radiation leakage from laptop screen.', target: 'HP Victus' },
  { id: 'ts-15', name: 'Hardware Keystroke Scrambler', category: 'Anti-Keylogger', value: true, type: 'toggle', description: 'Injects synthetic hardware interrupts to defeat hardware/software keyloggers.', target: 'HP Victus' },
  { id: 'ts-16', name: 'DNS Leaks & WebRTC Nullifier', category: 'Network IP', value: true, type: 'toggle', description: 'Forces all browser sockets into hardened QKD-backed encrypted proxies.', target: 'Global' },
  { id: 'ts-17', name: 'Process Camouflage & Cloaking', category: 'OS Stealth', value: 'System-Idle-Daemon', type: 'select', options: ['System-Idle-Daemon', 'svchost-Proxy', 'Victus-Cooling-Svc'], description: 'Masks executable name and process headers in Windows Task Manager.', target: 'HP Victus' },
  { id: 'ts-18', name: 'Zero-Allocation Memory Pool', category: 'Memory Safety', value: true, type: 'toggle', description: 'Eliminates OS heap fragmentation and prevents memory inspection leaks.', target: 'Virtual VM' },
  { id: 'ts-19', name: 'Self-Compacting Garbage Shredder', category: 'Runtime Defense', value: true, type: 'toggle', description: 'Immediately zeroes out transient cryptographic keys in browser memory.', target: 'Global' },
  { id: 'ts-20', name: 'BIOS Option ROM Authenticator', category: 'Firmware Trust', value: true, type: 'toggle', description: 'Scans GPU, NIC, and storage option ROMs for malicious persistence implants.', target: 'HP Victus' },
  { id: 'ts-21', name: 'Trade Secret Intellectual Property Watermark', category: 'IP Protection', value: 'MIL-SPEC-7709', type: 'input', description: 'Embeds steganographic non-removable cryptographic signature into build assets.', target: 'Global' },
  { id: 'ts-22', name: 'Side-Channel Power Analysis Damping', category: 'Hardware Shield', value: true, type: 'toggle', description: 'Randomizes compute load to smooth CPU power consumption spikes.', target: 'HP Victus' },
  { id: 'ts-23', name: 'Kernel Syscall Hook Annihilator', category: 'Rootkit Defense', value: true, type: 'toggle', description: 'Re-maps native SSDT and kernel entry vectors to original pristine binaries.', target: 'HP Victus' },
  { id: 'ts-24', name: 'Anti-Memory Cold Boot Scramble', category: 'Physical Security', value: true, type: 'toggle', description: 'Auto-zeroizes memory buses if laptop orientation or chassis switch triggers.', target: 'HP Victus' },
  { id: 'ts-25', name: 'Emergency Vault Purge Switch', category: 'Fail-Safe', value: true, type: 'toggle', description: 'Single-click irreversible zeroization of all logs, balances, and keys.', target: 'Global' }
];

// 25 Threat Absorbers & Exploit Vacuum Options
export const THREAT_ABSORBER_25_OPTIONS: SettingItem[] = [
  { id: 'abs-01', name: 'ARP Spoofing & Cache Poison Absorber', category: 'MITM Absorbers', value: true, type: 'toggle', description: 'Intercepts unauthorized ARP replies, absorbs spoofed packets, and feeds entropy to yield.', target: 'Global' },
  { id: 'abs-02', name: 'SSL / TLS Strip Attack Absorber', category: 'MITM Absorbers', value: true, type: 'toggle', description: 'Enforces HSTS and converts downgrade attempts into authenticated Kyber sessions.', target: 'Global' },
  { id: 'abs-03', name: 'Rogue Wi-Fi Evil Twin Absorber', category: 'MITM Absorbers', value: true, type: 'toggle', description: 'Detects duplicate BSSIDs and broadcasts de-auth counter-pulses.', target: 'HackRF One' },
  { id: 'abs-04', name: 'DNS Cache Poisoning Nullifier', category: 'MITM Absorbers', value: true, type: 'toggle', description: 'Validates DNSSEC signatures and reroutes recursive queries via QKD VPN.', target: 'Global' },
  { id: 'abs-05', name: 'BGP Route Hijack Neutralizer', category: 'MITM Absorbers', value: true, type: 'toggle', description: 'Detects autonomous system route discrepancies and switches to satellite relays.', target: 'Global' },
  { id: 'abs-06', name: 'Zero-Day RCE Exploit Vacuum', category: 'Malware Absorbers', value: true, type: 'toggle', description: 'Traps shellcode payloads inside micro-VM enclaves and extracts exploit signatures.', target: 'Virtual VM' },
  { id: 'abs-07', name: 'Buffer Overflow Return-Address Guard', category: 'Malware Absorbers', value: true, type: 'toggle', description: 'Hardware shadow stack enforcement preventing ROP/JOP chain execution.', target: 'HP Victus' },
  { id: 'abs-08', name: 'Heap Spraying & Use-After-Free Absorber', category: 'Malware Absorbers', value: true, type: 'toggle', description: 'Randomizes heap allocation cookies and detects unauthorized pointer reuse.', target: 'Virtual VM' },
  { id: 'abs-09', name: 'Format String Vulnerability Quencher', category: 'Malware Absorbers', value: true, type: 'toggle', description: 'Validates print format string tokens at compiler and runtime levels.', target: 'Global' },
  { id: 'abs-10', name: 'DLL Preloading / Hijacking Shield', category: 'Malware Absorbers', value: true, type: 'toggle', description: 'Restricts dynamic library paths strictly to authenticated Windows System32 signatures.', target: 'HP Victus' },
  { id: 'abs-11', name: 'Ransomware Mass-Encryption Interceptor', category: 'Ransomware Shield', value: true, type: 'toggle', description: 'Monitors file modification velocity; freezes offending processes in 0.2ms.', target: 'HP Victus' },
  { id: 'abs-12', name: 'Shadow Copy & VSS Deletion Blocker', category: 'Ransomware Shield', value: true, type: 'toggle', description: 'Locks volume shadow copies with hardware TPM-backed write-once credentials.', target: 'HP Victus' },
  { id: 'abs-13', name: 'Cryptographic Key Exfiltration Sniffer', category: 'Ransomware Shield', value: true, type: 'toggle', description: 'Detects outbound transmission of AES/RSA keys and terminates command sockets.', target: 'Global' },
  { id: 'abs-14', name: 'Master Boot Record (MBR) Guard', category: 'Ransomware Shield', value: true, type: 'toggle', description: 'Prevents bootloader wipers (HermeticWiper, NotPetya) from modifying sector 0.', target: 'HP Victus' },
  { id: 'abs-15', name: 'Pegasus Zero-Click iMessage/SMS Absorber', category: 'Spyware Absorbers', value: true, type: 'toggle', description: 'Sandboxes rich media parsers and disables FORCEDENTRY JBIG2 vulnerabilities.', target: 'Oppo A40' },
  { id: 'abs-16', name: 'Predator / Cytrox WebKit Sandbox', category: 'Spyware Absorbers', value: true, type: 'toggle', description: 'Quarantines untrusted URLs in ephemeral disposable container instances.', target: 'Oppo A40' },
  { id: 'abs-17', name: 'Baseband Over-the-Air Silent SMS Trap', category: 'Spyware Absorbers', value: true, type: 'toggle', description: 'Blocks Type-0 stealth SMS pings used for cellular geolocation tracking.', target: 'Oppo A40' },
  { id: 'abs-18', name: 'Camera & Microphone Bus Hardware Interlock', category: 'Spyware Absorbers', value: true, type: 'toggle', description: 'Hardware-enforced zero-signal gating when camera/mic are not actively user-invoked.', target: 'HP Victus' },
  { id: 'abs-19', name: 'Keylogger Acoustic & Polling Defeater', category: 'Spyware Absorbers', value: true, type: 'toggle', description: 'Scrambles scan-codes with randomized jitter to confuse timing keyloggers.', target: 'HP Victus' },
  { id: 'abs-20', name: 'BLE Tracking Beacon & AirTag Filter', category: 'Spyware Absorbers', value: true, type: 'toggle', description: 'Silences rogue Bluetooth advertising frames and alerts on proximity trackers.', target: 'HackRF One' },
  { id: 'abs-21', name: 'Infrasound / Ultrasonic Carrier Mute', category: 'Spectrum Absorber', value: true, type: 'toggle', description: 'Applies band-stop DSP notch filters at 18-24 kHz and <20 Hz frequencies.', target: 'Global' },
  { id: 'abs-22', name: 'V2K Microwave Synthetic Voice Quencher', category: 'Spectrum Absorber', value: true, type: 'toggle', description: 'Transmits phase-inverted acoustic and RF signals to cancel Frey-effect pulses.', target: 'HackRF One' },
  { id: 'abs-23', name: 'Directed Energy Weapon (DEW) RF Deflector', category: 'Spectrum Absorber', value: true, type: 'toggle', description: 'Detects high-power RF spikes in 1-95 GHz band and triggers thermal shielding.', target: 'Global' },
  { id: 'abs-24', name: 'Supply Chain Component Serial Validator', category: 'Hardware Trust', value: true, type: 'toggle', description: 'Validates serial numbers of PCIe SSD, RAM, and Wi-Fi card against factory manifest.', target: 'HP Victus' },
  { id: 'abs-25', name: 'Threat Energy-to-Compute Converter', category: 'Autonomous Engine', value: true, type: 'toggle', description: 'Reroutes neutralized attack vectors into Grover oracle hashing pipelines.', target: 'Global' }
];

// 25 SDR & Virtual HackRF One Transceiver Parameters
export const SDR_HACKRF_25_PARAMETERS: SettingItem[] = [
  { id: 'sdr-01', name: 'RF Frequency Center Tuner', category: 'Tuner Core', value: 2412, type: 'slider', min: 1, max: 6000, unit: 'MHz', description: 'Tuning range spans 1 MHz up to 6.0 GHz covering HF, VHF, UHF, SHF, and Wi-Fi/BLE bands.', target: 'HackRF One' },
  { id: 'sdr-02', name: 'Sample Rate (Bandwidth)', category: 'Tuner Core', value: 20, type: 'select', options: ['2', '8', '10', '16', '20'], unit: 'MSPS', description: 'High-speed quadrature I/Q sampling rate over USB 3.0 virtual controller.', target: 'HackRF One' },
  { id: 'sdr-03', name: 'LNA Low-Noise Amplifier Gain', category: 'Gain Stages', value: 32, type: 'slider', min: 0, max: 40, unit: 'dB', description: 'First stage receiver amplifier in 8 dB steps for faint RF signal detection.', target: 'HackRF One' },
  { id: 'sdr-04', name: 'VGA Baseband Variable Gain', category: 'Gain Stages', value: 40, type: 'slider', min: 0, max: 62, unit: 'dB', description: 'Baseband amplifier gain in 2 dB steps adjusting dynamic range before ADC.', target: 'HackRF One' },
  { id: 'sdr-05', name: 'RF Preamp 14 dB Enable', category: 'Gain Stages', value: true, type: 'toggle', description: 'Front-end MAX2837 internal amplifier for extreme sensitivity.', target: 'HackRF One' },
  { id: 'sdr-06', name: 'Antenna Port DC Bias-T (3.3V)', category: 'Antenna Power', value: true, type: 'toggle', description: 'Supplies 3.3V DC power (up to 50mA) to active external antennas and downconverters.', target: 'HackRF One' },
  { id: 'sdr-07', name: 'Operating Mode (Half-Duplex)', category: 'Transceiver State', value: 'RX-WATERFALL', type: 'select', options: ['RX-WATERFALL', 'TX-JAMMER', 'SWEEP-SCAN', 'STANDBY'], description: 'Transceiver operating configuration.', target: 'HackRF One' },
  { id: 'sdr-08', name: 'Baseband Filter Bandwidth', category: 'Filtering', value: '15 MHz', type: 'select', options: ['1.75 MHz', '2.5 MHz', '5 MHz', '10 MHz', '15 MHz', '20 MHz', '28 MHz'], description: 'Analog low-pass filter preventing alias signals into ADC.', target: 'HackRF One' },
  { id: 'sdr-09', name: 'FFT Window Size (Bins)', category: 'Waterfall DSP', value: 2048, type: 'select', options: ['512', '1024', '2048', '4096', '8192'], description: 'Spectral resolution bins for the live real-time waterfall display.', target: 'HackRF One' },
  { id: 'sdr-10', name: 'Waterfall Color Palette', category: 'Waterfall DSP', value: 'Neon-Cyan', type: 'select', options: ['Neon-Cyan', 'Inferno', 'Jet-Military', 'Matrix-Green', 'Purple-Decay'], description: 'Visual spectrum power density mapping theme.', target: 'HackRF One' },
  { id: 'sdr-11', name: 'Peak Signal Threshold', category: 'Spectrum Detection', value: -45, type: 'slider', min: -100, max: -10, unit: 'dBm', description: 'Threshold power level triggering automatic signal recording and classification.', target: 'HackRF One' },
  { id: 'sdr-12', name: 'Demodulation Protocol', category: 'DSP Audio', value: 'FM-Wide', type: 'select', options: ['RAW-IQ', 'FM-Wide', 'FM-Narrow', 'AM-Envelope', 'USB-Upper', 'CW-Morse'], description: 'Real-time software demodulator feeding virtual audio sink.', target: 'HackRF One' },
  { id: 'sdr-13', name: 'TX Transmission Power', category: 'Transmitter', value: 14, type: 'slider', min: 0, max: 14, unit: 'dBm', description: 'Maximum output power level for defensive countermeasure pulses.', target: 'HackRF One' },
  { id: 'sdr-14', name: 'Frequency Correction (PPM)', category: 'Clock Calibration', value: 0.5, type: 'slider', min: -50, max: 50, unit: 'PPM', description: 'Crystal oscillator TCXO calibration for sub-hertz frequency locking.', target: 'HackRF One' },
  { id: 'sdr-15', name: 'Automatic Gain Control (AGC)', category: 'Gain Stages', value: true, type: 'toggle', description: 'Dynamic gain adaptation preventing ADC clipping on powerful signals.', target: 'HackRF One' },
  { id: 'sdr-16', name: 'Mobile APK Remote Link Port', category: 'Remote Gateway', value: 7654, type: 'input', description: 'Encrypted WebSocket port streaming I/Q samples to remote mobile APK.', target: 'Oppo A40' },
  { id: 'sdr-17', name: 'Mobile Remote Encryption', category: 'Remote Gateway', value: 'ML-KEM-1024', type: 'select', options: ['ML-KEM-1024', 'ChaCha20-Poly1305', 'AES-GCM-256'], description: 'Post-quantum key encapsulation for mobile tethered streaming.', target: 'Oppo A40' },
  { id: 'sdr-18', name: 'Sweep Scan Bandwidth / Sec', category: 'Fast Sweep', value: '20 GHz/s', type: 'select', options: ['5 GHz/s', '10 GHz/s', '20 GHz/s', '35 GHz/s'], description: 'Ultra-fast HackRF sweep scan mode across 0-6 GHz band.', target: 'HackRF One' },
  { id: 'sdr-19', name: 'Raw I/Q Recording Buffer', category: 'Data Capture', value: 'Ring-Buffer-500MB', type: 'select', options: ['Direct-to-Disk', 'Ring-Buffer-500MB', 'RAM-Enclave-1GB'], description: 'High-speed capture buffer for signal replay analysis.', target: 'Virtual VM' },
  { id: 'sdr-20', name: 'ADS-B 1090 MHz Flight Decoder', category: 'Protocol Decoding', value: true, type: 'toggle', description: 'Hardware Mode-S aviation transponder interrogator and telemetry tracker.', target: 'HackRF One' },
  { id: 'sdr-21', name: 'AIS 162 MHz Maritime Vessel Decoder', category: 'Protocol Decoding', value: true, type: 'toggle', description: 'Maritime transponder tracker for coastal surveillance.', target: 'HackRF One' },
  { id: 'sdr-22', name: 'ISM 433 MHz / 915 MHz IoT Sniffer', category: 'Protocol Decoding', value: true, type: 'toggle', description: 'Decodes wireless sensor, weather station, and telemetry packets.', target: 'HackRF One' },
  { id: 'sdr-23', name: 'Cellular GSM/LTE IMSI Catcher Blocker', category: 'Defensive SDR', value: true, type: 'toggle', description: 'Alerts when anomalous high-power 2G/4G tower beacons attempt connection.', target: 'HackRF One' },
  { id: 'sdr-24', name: 'V2K Microwave Frequency Interceptor', category: 'Defensive SDR', value: true, type: 'toggle', description: 'Tracks modulated RF pulses in 1.04 GHz - 14.77 GHz range.', target: 'HackRF One' },
  { id: 'sdr-25', name: 'Firmware Flash & CPLD Update Guard', category: 'Firmware Security', value: true, type: 'toggle', description: 'Protects HackRF LPC43xx flash and Xilinx CoolRunner-II CPLD from rogue bitstreams.', target: 'HackRF One' }
];
