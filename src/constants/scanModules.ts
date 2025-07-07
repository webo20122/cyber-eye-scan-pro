
// This interface defines the structure for a single scan module configuration field
export interface ScanModuleConfigField {
  field_name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'array_string' | 'array_enum' | 'json_object' | 'json_array';
  description: string;
  optional: boolean;
  default?: any;
  placeholder?: string;
  options?: string[]; // For 'enum' and 'array_enum' types
  input_type?: 'text' | 'password' | 'textarea'; // For 'string' type
  condition?: { field: string; value: any }; // For conditional rendering based on another field's value
}

// This interface defines the structure for a single scan module
export interface ScanModuleDefinition {
  key: string; // Corresponds to the module name (e.g., 'network_scan' for 'enable_network_scan')
  name: string;
  description: string;
  category: string;
  icon: string; // Emoji or icon component name
  parameters: ScanModuleConfigField[];
}

export const SCAN_MODULE_DEFINITIONS: ScanModuleDefinition[] = [
  {
    key: 'network_scan',
    name: 'Network Scan',
    description: 'Nmap-based port scanning, OS/service detection, and vulnerability checks.',
    category: 'Network',
    icon: '🌐',
    parameters: [
      {
        field_name: 'scan_type',
        label: 'Scan Type',
        type: 'enum',
        description: 'Select the type of network scan to perform.',
        optional: false,
        options: ['SYN', 'TCP Connect', 'UDP', 'Comprehensive'],
        default: 'Comprehensive'
      },
      {
        field_name: 'specific_ports',
        label: 'Specific Ports (comma-separated)',
        type: 'string',
        description: 'A comma-separated list of ports to scan (e.g., "22,80,443"). Leave empty for common ports or full scan.',
        optional: true,
        default: ''
      },
      {
        field_name: 'timing_template',
        label: 'Timing Template',
        type: 'enum',
        description: 'Set the aggressiveness of the scan timing (T0-T5).',
        optional: true,
        options: ['T0 (Paranoid)', 'T1 (Sneaky)', 'T2 (Polite)', 'T3 (Normal)', 'T4 (Aggressive)', 'T5 (Insane)'],
        default: 'T3 (Normal)'
      },
      {
        field_name: 'enable_os_detection',
        label: 'Enable OS Detection',
        type: 'boolean',
        description: 'Attempt to detect the operating system of the target.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_service_version_detection',
        label: 'Enable Service Version Detection',
        type: 'boolean',
        description: 'Attempt to determine service versions running on open ports.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_script_scanning',
        label: 'Enable Script Scanning (NSE)',
        type: 'boolean',
        description: 'Run Nmap Scripting Engine (NSE) scripts for vulnerability detection and enumeration.',
        optional: true,
        default: false
      }
    ]
  }
];

// Export helper functions for working with scan modules
export const getScanModuleByKey = (key: string): ScanModuleDefinition | undefined => {
  return SCAN_MODULE_DEFINITIONS.find(module => module.key === key);
};

export const getScanModulesByCategory = (category: string): ScanModuleDefinition[] => {
  return SCAN_MODULE_DEFINITIONS.filter(module => module.category === category);
};

export const getAllCategories = (): string[] => {
  const categories = SCAN_MODULE_DEFINITIONS.map(module => module.category);
  return [...new Set(categories)];
};
