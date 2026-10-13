export interface SensorTarget {
  id: string;
  name: string;
  type: 'CMOS' | 'Microcontroller' | 'BT-Tracker' | 'RF-Transceiver';
  location: string;
  powerWatts: number;
  frequency: string;
  threatLevel: number;
  status: 'DESTROYED' | 'TERMINATED' | 'ISOLATED' | 'ACTIVE';
}

export interface ClonedHandset {
  id: string;
  phoneNumber: string;
  statusLevel: 'critical / disconnected' | 'high / disconnected' | 'medium / disconnected' | 'none / active' | 'secure / active';
  deviceName: string;
  carrier: 'One NZ' | 'Spark NZ' | '2degrees' | 'Skinny Mobile' | 'Vodafone NZ';
  isMasterRoot?: boolean;
  isolated?: boolean;
}

export interface HealthcareAsset {
  id: string;
  name: string;
  category: string;
  ipAddress: string;
  protocol: string;
  securityState: 'ENCRYPTED' | 'ISOLATED' | 'MONITORED';
  telemetryStatus: string;
}

export const INITIAL_SENSOR_TARGETS: SensorTarget[] = [
  {
    id: 't-1',
    name: 'OV5647 Camera Module',
    type: 'CMOS',
    location: 'Auckland',
    powerWatts: 46.5,
    frequency: '940 nm',
    threatLevel: 92,
    status: 'DESTROYED'
  },
  {
    id: 't-2',
    name: 'ESP32-WROOM-32',
    type: 'Microcontroller',
    location: 'Wellington',
    powerWatts: 30.5,
    frequency: '2.4 GHz',
    threatLevel: 62,
    status: 'DESTROYED'
  },
  {
    id: 't-3',
    name: 'AirTag BLE Tracker',
    type: 'BT-Tracker',
    location: 'Christchurch',
    powerWatts: 85.4,
    frequency: '2.4 GHz',
    threatLevel: 60,
    status: 'DESTROYED'
  },
  {
    id: 't-4',
    name: 'Rogue BLE Sniffer',
    type: 'BT-Tracker',
    location: 'Auckland East',
    powerWatts: 75.5,
    frequency: '2.4 GHz',
    threatLevel: 0,
    status: 'DESTROYED'
  }
];

export const INITIAL_CLONED_HANDSETS: ClonedHandset[] = [
  { id: 'c-1', phoneNumber: '+64225136935', statusLevel: 'critical / disconnected', deviceName: 'iPhone 14 (VM)', carrier: 'One NZ' },
  { id: 'c-2', phoneNumber: '+64202716958', statusLevel: 'none / active', deviceName: 'iPhone 14 +0211319895 Clone', carrier: 'Spark NZ' },
  { id: 'c-3', phoneNumber: '+64206822069', statusLevel: 'critical / disconnected', deviceName: 'iPhone 14 +0211319895 Clone', carrier: '2degrees' },
  { id: 'c-4', phoneNumber: '+64297731547', statusLevel: 'critical / disconnected', deviceName: 'iPhone 14 +0211319895 Clone', carrier: 'One NZ' },
  { id: 'c-5', phoneNumber: '+64244805490', statusLevel: 'high / disconnected', deviceName: 'iPhone 14 (Emulated)', carrier: 'One NZ' },
  { id: 'c-6', phoneNumber: '+64237596255', statusLevel: 'critical / disconnected', deviceName: 'iPhone 14 (VM)', carrier: 'Skinny Mobile' },
  { id: 'c-7', phoneNumber: '+64210545594', statusLevel: 'critical / disconnected', deviceName: 'iPhone 14 (Emulated)', carrier: 'Spark NZ' },
  { id: 'c-8', phoneNumber: '+64290918854', statusLevel: 'none / active', deviceName: 'iPhone 14 +0211319895 Spoofed', carrier: 'Skinny Mobile' },
  { id: 'c-9', phoneNumber: '+64252924304', statusLevel: 'high / disconnected', deviceName: 'iPhone 14 +0211319895 Virtual', carrier: '2degrees' },
  { id: 'c-10', phoneNumber: '+64268213100', statusLevel: 'medium / disconnected', deviceName: 'iPhone 14 (Clone)', carrier: 'Vodafone NZ' },
  { id: 'c-11', phoneNumber: '+64240424513', statusLevel: 'none / active', deviceName: 'Samsung S24', carrier: 'One NZ' },
  { id: 'c-12', phoneNumber: '+64244942878', statusLevel: 'critical / disconnected', deviceName: 'Samsung S24', carrier: 'Vodafone NZ' },
  { id: 'c-13', phoneNumber: '+64256600785', statusLevel: 'high / disconnected', deviceName: 'iPhone 14 (VM)', carrier: 'One NZ' },
  { id: 'c-14', phoneNumber: '+64245238728', statusLevel: 'high / disconnected', deviceName: 'OPPO A40', carrier: '2degrees' },
  { id: 'c-15', phoneNumber: '+64241918135', statusLevel: 'critical / disconnected', deviceName: 'OPPO A40', carrier: 'Spark NZ' },
  { id: 'c-16', phoneNumber: '+64270796124', statusLevel: 'none / active', deviceName: 'iPhone 14 +0211319895 Virtual', carrier: 'Spark NZ' },
  { id: 'c-17', phoneNumber: '+64276197727', statusLevel: 'critical / disconnected', deviceName: 'iPhone 14 +0211319895 Virtual', carrier: 'Spark NZ' },
  { id: 'c-18', phoneNumber: '+64225213859', statusLevel: 'critical / disconnected', deviceName: 'iPhone 14 (Clone)', carrier: 'Vodafone NZ' },
  { id: 'c-19', phoneNumber: '+64236478655', statusLevel: 'critical / disconnected', deviceName: 'iPhone 14 (Clone)', carrier: 'Vodafone NZ' },
  { id: 'c-20', phoneNumber: '+64216681025', statusLevel: 'high / disconnected', deviceName: 'iPhone 14 (Emulated)', carrier: 'One NZ' },
  { id: 'c-21', phoneNumber: '+64206243903', statusLevel: 'critical / disconnected', deviceName: 'iPhone 14 (Spoofed)', carrier: '2degrees' },
  { id: 'c-22', phoneNumber: '+64211319895', statusLevel: 'secure / active', deviceName: 'Master Hardware Root', carrier: 'Spark NZ', isMasterRoot: true },
  { id: 'c-23', phoneNumber: '+64288194411', statusLevel: 'secure / active', deviceName: 'Secure Proxy Node Alpha', carrier: '2degrees' },
  { id: 'c-24', phoneNumber: '+64299382210', statusLevel: 'secure / active', deviceName: 'Encrypted Relay Station', carrier: 'One NZ' },
  { id: 'c-25', phoneNumber: '+64277491102', statusLevel: 'secure / active', deviceName: 'Quantum Tunnel Node', carrier: 'Skinny Mobile' }
];

export const INITIAL_HEALTHCARE_ASSETS: HealthcareAsset[] = [
  { id: 'h-1', name: 'Smart Infusion Pump Gateway', category: 'Drug Delivery', ipAddress: '10.240.12.10', protocol: 'mTLS / HL7 v2', securityState: 'ISOLATED', telemetryStatus: 'Flow Rate: 125 mL/hr • Locked' },
  { id: 'h-2', name: 'ICU Telemetry ECG Monitor', category: 'Vital Signs', ipAddress: '10.240.12.14', protocol: 'FHIR / TLS 1.3', securityState: 'ENCRYPTED', telemetryStatus: 'Waveform Sync 12-lead • 74 bpm' },
  { id: 'h-3', name: 'Hospital PACS Imaging Server', category: 'Radiology DICOM', ipAddress: '10.240.14.80', protocol: 'DICOM-TLS', securityState: 'ENCRYPTED', telemetryStatus: '2.4 TB Archive • Zero Leak' },
  { id: 'h-4', name: 'Smart Bed Biometric Sensor', category: 'Patient Mobility', ipAddress: '10.240.15.22', protocol: 'Zigbee 3.0 / AES', securityState: 'MONITORED', telemetryStatus: 'Pressure Map Nominal • Low Risk' },
  { id: 'h-5', name: 'Automated Pharmacy RFID Safe', category: 'Medication Storage', ipAddress: '10.240.16.05', protocol: 'FIDO2 / BACnet', securityState: 'ISOLATED', telemetryStatus: 'Physical Solenoid Engaged' }
];
