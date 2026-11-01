import type { Cert, CertId } from '../types/content';

// Prüfungsnummern und -bereiche hier aktuell halten (Exam Guides der Hersteller prüfen, wenn neue Versionen erscheinen).
export const certs: Record<CertId, Cert> = {
  ccna: {
    id: 'ccna', name: 'Cisco CCNA', exam: '200-301', vendor: 'Cisco',
    domains: [
      { id: '1', name: 'Network Fundamentals' },
      { id: '2', name: 'Network Access' },
      { id: '3', name: 'IP Connectivity' },
      { id: '4', name: 'IP Services' },
      { id: '5', name: 'Security Fundamentals' },
      { id: '6', name: 'Automation and Programmability' },
    ],
  },
  netplus: {
    id: 'netplus', name: 'CompTIA Network+', exam: 'N10-009', vendor: 'CompTIA',
    domains: [
      { id: '1', name: 'Networking Concepts' },
      { id: '2', name: 'Network Implementation' },
      { id: '3', name: 'Network Operations' },
      { id: '4', name: 'Network Security' },
      { id: '5', name: 'Network Troubleshooting' },
    ],
  },
  az900: {
    id: 'az900', name: 'Azure Fundamentals', exam: 'AZ-900', vendor: 'Microsoft',
    domains: [
      { id: 'concepts', name: 'Describe cloud concepts' },
      { id: 'architecture', name: 'Describe Azure architecture and services' },
      { id: 'governance', name: 'Describe Azure management and governance' },
    ],
  },
  az104: {
    id: 'az104', name: 'Azure Administrator', exam: 'AZ-104', vendor: 'Microsoft',
    domains: [
      { id: 'identity', name: 'Manage Azure identities and governance' },
      { id: 'storage', name: 'Implement and manage storage' },
      { id: 'compute', name: 'Deploy and manage Azure compute resources' },
      { id: 'network', name: 'Implement and manage virtual networking' },
      { id: 'monitor', name: 'Monitor and maintain Azure resources' },
    ],
  },
  'aws-saa': {
    id: 'aws-saa', name: 'AWS Solutions Architect – Associate', exam: 'SAA-C03', vendor: 'AWS',
    domains: [
      { id: 'secure', name: 'Design Secure Architectures' },
      { id: 'resilient', name: 'Design Resilient Architectures' },
      { id: 'performant', name: 'Design High-Performing Architectures' },
      { id: 'cost', name: 'Design Cost-Optimized Architectures' },
    ],
  },
};
