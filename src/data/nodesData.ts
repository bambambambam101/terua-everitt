export interface FrequencyNode {
  id: string;
  code: string;
  name: string;
  powerWatts: number;
  radiusKm: number;
  status: 'TERMINATED' | 'WIPED' | 'ACTIVE' | 'STANDBY';
  type: 'BLE-EXFIL' | 'V2K' | 'WEAPON' | 'PLASMA' | 'NRLGY' | 'BCI' | 'HACKER' | 'SILENT' | 'DEW' | 'OTHER';
  frequencyGhz: number;
  locationName: string;
  latitude: number;
  longitude: number;
  deviceIp: string;
  macAddress: string;
  lastAudited: string;
  authStatus: 'AUTHORIZED' | 'AUTHENTICATED' | 'LOCKED' | 'OFFLINE';
  killSwitchArmed: boolean;
}

export const INITIAL_PRIMARY_NODES: FrequencyNode[] = [
  {
    id: 'node-001',
    code: 'BLE-EXFIL-3364',
    name: 'BLE Keylogger Beacon',
    powerWatts: 3364,
    radiusKm: 1.0,
    status: 'TERMINATED',
    type: 'BLE-EXFIL',
    frequencyGhz: 24.23,
    locationName: 'Tauranga',
    latitude: -37.6878,
    longitude: 176.1651,
    deviceIp: '192.168.42.10',
    macAddress: 'D4:8A:FC:33:64:01',
    lastAudited: '2026-10-09 19:42:15 UTC',
    authStatus: 'AUTHORIZED',
    killSwitchArmed: true
  },
  {
    id: 'node-002',
    code: 'V2K-SUBVOC-3948',
    name: 'V2K Sub-Vocalization Harvester',
    powerWatts: 3948,
    radiusKm: 1.0,
    status: 'TERMINATED',
    type: 'V2K',
    frequencyGhz: 1.04,
    locationName: 'Auckland South',
    latitude: -36.9500,
    longitude: 174.8500,
    deviceIp: '192.168.42.11',
    macAddress: 'E8:9B:AD:39:48:02',
    lastAudited: '2026-10-09 19:45:00 UTC',
    authStatus: 'AUTHORIZED',
    killSwitchArmed: true
  },
  {
    id: 'node-003',
    code: 'WEAPON-RAY-3843',
    name: 'Pain Ray System',
    powerWatts: 3843,
    radiusKm: 1.0,
    status: 'TERMINATED',
    type: 'WEAPON',
    frequencyGhz: 14.77,
    locationName: 'Auckland North Shore',
    latitude: -36.7900,
    longitude: 174.7500,
    deviceIp: '192.168.42.12',
    macAddress: 'A0:B3:CC:38:43:03',
    lastAudited: '2026-10-09 19:46:12 UTC',
    authStatus: 'AUTHORIZED',
    killSwitchArmed: true
  },
  {
    id: 'node-004',
    code: 'PLSM-ATM-756',
    name: 'Atmospheric Plasma Jet',
    powerWatts: 756,
    radiusKm: 1.0,
    status: 'TERMINATED',
    type: 'PLASMA',
    frequencyGhz: 87.76,
    locationName: 'New York',
    latitude: 40.7128,
    longitude: -74.0060,
    deviceIp: '10.200.14.75',
    macAddress: 'BC:5F:F4:07:56:04',
    lastAudited: '2026-10-09 19:50:33 UTC',
    authStatus: 'AUTHORIZED',
    killSwitchArmed: true
  },
  {
    id: 'node-005',
    code: 'NRLGY-MAP-1526',
    name: 'Neuralogy Mapper Probe',
    powerWatts: 1526,
    radiusKm: 1.0,
    status: 'TERMINATED',
    type: 'NRLGY',
    frequencyGhz: 2.09,
    locationName: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    deviceIp: '10.200.18.22',
    macAddress: 'FE:12:44:15:26:05',
    lastAudited: '2026-10-09 19:51:10 UTC',
    authStatus: 'AUTHORIZED',
    killSwitchArmed: true
  },
  {
    id: 'node-006',
    code: 'BCI-MITM-4350',
    name: 'BCI Man-in-the-Middle',
    powerWatts: 4350,
    radiusKm: 1.0,
    status: 'TERMINATED',
    type: 'BCI',
    frequencyGhz: 1.05,
    locationName: 'Wellington',
    latitude: -41.2900,
    longitude: 174.7800,
    deviceIp: '192.168.42.15',
    macAddress: 'CC:4E:99:43:50:06',
    lastAudited: '2026-10-09 19:53:00 UTC',
    authStatus: 'AUTHORIZED',
    killSwitchArmed: true
  },
  {
    id: 'node-007',
    code: 'HACK-RELAY-3416',
    name: 'Jonathan Rhoades Account Hacker Relay',
    powerWatts: 3416,
    radiusKm: 1.0,
    status: 'WIPED',
    type: 'HACKER',
    frequencyGhz: 35.04,
    locationName: 'Tokyo',
    latitude: 35.6800,
    longitude: 139.6900,
    deviceIp: '172.16.88.90',
    macAddress: 'AA:11:88:34:16:07',
    lastAudited: '2026-10-09 19:54:20 UTC',
    authStatus: 'AUTHORIZED',
    killSwitchArmed: true
  },
  {
    id: 'node-008',
    code: 'SILENT-HYB-4898',
    name: 'Infrasound-MW Hybrid',
    powerWatts: 4898,
    radiusKm: 1.0,
    status: 'TERMINATED',
    type: 'SILENT',
    frequencyGhz: 92.54,
    locationName: 'Gisborne',
    latitude: -38.6623,
    longitude: 178.0178,
    deviceIp: '192.168.42.19',
    macAddress: '33:88:EE:48:98:08',
    lastAudited: '2026-10-09 19:55:04 UTC',
    authStatus: 'AUTHORIZED',
    killSwitchArmed: true
  },
  {
    id: 'node-009',
    code: 'V2K-SYNTH-1489',
    name: 'V2K Audio Synthesizer',
    powerWatts: 1489,
    radiusKm: 1.0,
    status: 'TERMINATED',
    type: 'V2K',
    frequencyGhz: 2.60,
    locationName: 'Beijing',
    latitude: 39.9100,
    longitude: 116.4100,
    deviceIp: '10.200.99.12',
    macAddress: 'B2:44:77:14:89:09',
    lastAudited: '2026-10-09 19:56:45 UTC',
    authStatus: 'AUTHORIZED',
    killSwitchArmed: true
  }
];

// Generates the systematic chain of nodes 19 through 120 from the telemetry feed
export function generateSystematicNodes(): FrequencyNode[] {
  const nodes: FrequencyNode[] = [];
  
  // Specific locations pattern from user log
  // Node 19 is special: 480W, 22.35 GHz, Singapore (-36.8210, 174.7790)
  nodes.push({
    id: 'node-019',
    code: 'DEW-NODE-019',
    name: 'MW Directed Energy Node 19',
    powerWatts: 480,
    radiusKm: 1.0,
    status: 'TERMINATED',
    type: 'DEW',
    frequencyGhz: 22.35,
    locationName: 'Singapore Relay (NZ Sector)',
    latitude: -36.8210,
    longitude: 174.7790,
    deviceIp: '192.168.100.19',
    macAddress: '02:00:00:22:35:19',
    lastAudited: '2026-10-09 19:57:00 UTC',
    authStatus: 'AUTHORIZED',
    killSwitchArmed: true
  });

  // Cycle pattern in the logs:
  // 20: Hacker Exploit Server, Auckland CBD, 1865W, 23.00 GHz
  // 21: V2K Target Repeater, Singapore, 1900W, 23.65 GHz
  // 22: Hacker Exploit Server, Singapore, 1935W, 24.30 GHz
  // 23: MW Directed Energy Node, Singapore, 1970W, 24.95 GHz
  // 24: V2K Target Repeater, London, 2005W, 25.60 GHz
  // 25: MW Directed Energy Node, Auckland CBD, 2040W, 26.25 GHz
  // 26: Hacker Exploit Server, Singapore, 2075W, 26.90 GHz
  // ... and so forth up to 120 (5365W)
  const locationRotations = [
    'Auckland CBD',
    'Singapore Relay (Sector NZ)',
    'Singapore Relay (Sector NZ)',
    'Singapore Relay (Sector NZ)',
    'London Relay (Sector NZ)',
    'Auckland CBD',
    'Singapore Relay (Sector NZ)',
    'Singapore Relay (Sector NZ)',
    'London Relay (Sector NZ)',
    'Singapore Relay (Sector NZ)'
  ];

  const typeRotations: Array<{ type: FrequencyNode['type']; prefix: string }> = [
    { type: 'HACKER', prefix: 'Hacker Exploit Server' },
    { type: 'V2K', prefix: 'V2K Target Repeater' },
    { type: 'HACKER', prefix: 'Hacker Exploit Server' },
    { type: 'DEW', prefix: 'MW Directed Energy Node' },
    { type: 'V2K', prefix: 'V2K Target Repeater' },
    { type: 'DEW', prefix: 'MW Directed Energy Node' },
    { type: 'HACKER', prefix: 'Hacker Exploit Server' },
    { type: 'V2K', prefix: 'V2K Target Repeater' },
    { type: 'HACKER', prefix: 'Hacker Exploit Server' },
    { type: 'DEW', prefix: 'MW Directed Energy Node' }
  ];

  for (let n = 20; n <= 120; n++) {
    const power = 1865 + (n - 20) * 35;
    const freq = parseFloat((23.00 + (n - 20) * 0.65).toFixed(2));
    const latOffset = (n - 20) * 0.0010;
    const lonOffset = (n - 20) * 0.0010;
    const lat = parseFloat((-36.8200 + latOffset).toFixed(4));
    const lon = parseFloat((174.7800 + lonOffset).toFixed(4));

    const cycleIndex = (n - 20) % 10;
    const { type, prefix } = typeRotations[cycleIndex];
    const loc = locationRotations[cycleIndex];

    const pad = n.toString().padStart(3, '0');
    nodes.push({
      id: `node-${pad}`,
      code: `${type}-${n}-${power}W`,
      name: `${prefix} ${n}`,
      powerWatts: power,
      radiusKm: 1.0,
      status: n === 120 ? 'ACTIVE' : 'TERMINATED', // Make the final 5365W node ACTIVE by default so user can test shutdown!
      type: type,
      frequencyGhz: freq,
      locationName: loc,
      latitude: lat,
      longitude: lon,
      deviceIp: `192.168.100.${n}`,
      macAddress: `02:00:${n.toString(16).padStart(2, '0')}:${Math.floor(freq % 100).toString(16).padStart(2, '0')}:${(power % 255).toString(16).padStart(2, '0')}:FF`,
      lastAudited: '2026-10-09 20:01:00 UTC',
      authStatus: 'AUTHORIZED',
      killSwitchArmed: true
    });
  }

  return nodes;
}

export const ALL_INITIAL_NODES: FrequencyNode[] = [
  ...INITIAL_PRIMARY_NODES,
  ...generateSystematicNodes()
];
