# Lernplan: Abdeckung der Prüfungsthemen

Ziel: Mit der App allein alle Prüfungsthemen lernen. Diese Liste ordnet jedes Thema aus den offiziellen Exam Guides einem Level zu.
✓ = vorhanden · ◐ = teilweise · ✗ = fehlt (Level geplant)

Stand: 2026-11-01. Exam Guides der Hersteller bei neuen Prüfungsversionen erneut abgleichen (Nummern in `src/content/certs.ts`).

## Cisco CCNA 200-301

| Bereich | Thema | Level | Stand |
|---|---|---|---|
| 1 Network Fundamentals | Geräterollen (Router, L2/L3-Switch, Firewall/IPS, AP, WLC, Endgeräte, Server, PoE) | A1, A3 | ✓ |
| | Architekturen (2-Tier/Collapsed Core, 3-Tier, Spine-Leaf, WAN, SOHO, On-Prem vs. Cloud) | A1 | ✓ |
| | Kabel, Glasfaser, Schnittstellenfehler (Duplex, Speed, CRC, Kollisionen) | A3 | ✓ |
| | TCP vs. UDP | A9 | ✗ |
| | IPv4, Subnetting, private Adressen | A4 | ✓ |
| | IPv6 (Adresstypen, EUI-64, SLAAC) | A5 | ✓ |
| | IP-Parameter am Client prüfen (Windows, macOS, Linux) | A4, A5 | ✓ |
| | WLAN-Grundlagen (Kanäle, SSID, RF, Verschlüsselung) | A10 | ✗ |
| | Virtualisierung (VMs, Container, VRF) | B2, A7 | ◐ (VRF in A7) |
| | Switching (MAC-Lernen, Aging, Flooding) | A3 | ✓ |
| 2 Network Access | VLANs, Voice-VLAN, Inter-VLAN-Routing | A6, A7 | ◐ |
| | Trunks, 802.1Q, Native VLAN | A6 | ✓ |
| | CDP und LLDP | A6 | ✓ |
| | EtherChannel (LACP) | A6 | ✓ |
| | RSTP, PortFast, BPDU Guard | A6 | ✓ |
| | WLAN-Architekturen, AP-Modi, WLC, Management-Zugänge | A10 | ✗ |
| 3 IP Connectivity | Routingtabelle, Longest Match, AD, Metrik | A7 | ✗ |
| | Statische Routen (Default, Netz, Host, Floating) IPv4/IPv6 | A7 | ✗ |
| | OSPFv2 Single Area | A7 | ✗ |
| | First Hop Redundancy (HSRP, VRRP) | A7 | ✗ |
| 4 IP Services | NAT/PAT, NTP, DHCP (inkl. Relay), DNS, SNMP, Syslog | A8 | ✗ |
| | QoS (Klassifizierung, Markierung, Queuing, Policing/Shaping) | A12 | ✗ |
| | SSH, TFTP/FTP | A8 | ✗ |
| 5 Security Fundamentals | Bedrohungen, Schwachstellen, Gegenmaßnahmen | A11 | ✗ |
| | Passwörter, MFA, Zertifikate, AAA (RADIUS/TACACS+) | A11 | ✗ |
| | VPN (Site-to-Site, Remote Access, IPsec) | A11, B5 | ◐ |
| | ACLs (Standard, Extended) | A11 | ✗ |
| | Layer-2-Sicherheit (Port Security, DHCP Snooping, DAI) | A11 | ✗ |
| | WPA2/WPA3 | A10 | ✗ |
| 6 Automation | Controller, SDN, Underlay/Overlay, KI im Netzbetrieb | A14 | ✗ |
| | REST-APIs, JSON, Ansible, Terraform | A14, B8 | ✗ |

## CompTIA Network+ N10-009

| Bereich | Thema | Level | Stand |
|---|---|---|---|
| 1 Concepts | OSI-Modell | A2 | ✓ |
| | Geräte und Appliances (inkl. NFV) | A1, B2 | ✓ |
| | Cloud-Konzepte (VPC, NSG, Gateways, Elastizität, Mandanten) | B1, B5 | ✓ |
| | Ports und Protokolle | A9 | ✗ |
| | Verkehrsarten (Unicast, Multicast, Anycast, Broadcast) | A4, A5 | ✓ |
| | Übertragungsmedien und Transceiver | A3 | ✓ |
| | Topologien und Architekturen | A1 | ✓ |
| | IPv4-Adressierung | A4 | ✓ |
| | Moderne Netze (SDN, SD-WAN, VXLAN, Zero Trust, SASE, IaC) | A12, A14, B6 | ✗ |
| 2 Implementation | Routing (statisch, dynamisch, FHRP, Subinterfaces) | A7 | ✗ |
| | Switching (VLANs, Trunks, STP, MTU) | A6, A3 | ✓ |
| | WLAN | A10 | ✗ |
| | Physische Installation (Racks, Strom, Klima) | A13 | ✗ |
| 3 Operations | Dokumentation, Lebenszyklus, Change Management | A13 | ✗ |
| | Monitoring (SNMP, Syslog, NetFlow, Baselines) | A13 | ✗ |
| | Disaster Recovery (RPO, RTO, MTTR, MTBF, Standorte) | A13, B11 | ✗ |
| | Dienste (DHCP, DNS, NTP, IPAM) | A8 | ✗ |
| | Zugriff und Management (VPN, SSH, Jump Box, Out-of-Band) | A11, A13 | ✗ |
| 4 Security | Konzepte (CIA, Verschlüsselung, PKI, IAM) | A11 | ✗ |
| | Angriffe (DoS, ARP-Spoofing, Phishing, Rogue AP …) | A11 | ✗ |
| | Schutzmaßnahmen (ACLs, NAC, Segmentierung, Härtung) | A11 | ✗ |
| 5 Troubleshooting | 7-Schritte-Methode | A15 | ✗ |
| | Kabel, Dienste, Performance, Werkzeuge | A15 | ✗ |

## Microsoft AZ-900

| Bereich | Thema | Level | Stand |
|---|---|---|---|
| Cloud concepts | Cloud-Modelle, Verbrauchsmodell, IaaS/PaaS/SaaS, Vorteile | B1 | ✓ |
| Architecture | Regionen, Zonen, Regionspaare, Hierarchie | B1, B3 | ✓ |
| | Compute (VMs, Scale Sets, App Service, Container, Functions, Virtual Desktop) | B3, B7, B8 | ◐ |
| | Netzwerk (VNet, Peering, VPN, ExpressRoute, DNS, Endpoints) | B3, B5 | ✓ |
| | Speicher (Dienste, Stufen, Redundanz, Migration mit AzCopy, Data Box, Migrate) | B3, B7 | ◐ |
| | Identität (Entra ID, SSO, MFA, Passwordless, External ID, Conditional Access) | B3, B6 | ◐ |
| | Sicherheit (RBAC, Zero Trust, Defense in Depth, Defender for Cloud) | B6 | ✗ |
| Management & governance | Kosten (Faktoren, Rechner, Cost Management, Tags) | B12 | ✗ |
| | Governance (Purview, Policy, Ressourcensperren) | B12 | ✗ |
| | Werkzeuge (Portal, Cloud Shell, CLI, PowerShell, Arc, ARM/Bicep) | B3, B10 | ◐ |
| | Monitoring (Advisor, Service Health, Monitor, Log Analytics, App Insights) | B11 | ✗ |

## Microsoft AZ-104

| Bereich | Thema | Level | Stand |
|---|---|---|---|
| Identity & governance | Benutzer, Gruppen, Lizenzen, Gäste, SSPR | B6 | ✗ |
| | RBAC (Rollen, Bereiche, eigene Rollen) | B3, B6 | ◐ |
| | Policy, Sperren, Tags, Verwaltungsgruppen, Kosten | B12 | ✗ |
| Storage | Zugriff (Schlüssel, SAS, Firewall, Entra-Auth für Files) | B7 | ✗ |
| | Konten, Redundanz, Objektreplikation, Verschlüsselung | B3, B7 | ◐ |
| | Blob (Stufen, Soft Delete, Versionierung, Lebenszyklus), Files | B7 | ✗ |
| Compute | ARM/Bicep | B10 | ✗ |
| | VMs, Datenträger, Verfügbarkeit, Scale Sets | B3, B2 | ◐ |
| | Container (ACR, ACI, Container Apps), App Service | B8, B9 | ✗ |
| Networking | VNets, Peering, UDR, NSG/ASG, Bastion, Endpoints, DNS, Load Balancer | B3, B5 | ✓ |
| Monitor & maintain | Monitor (Metriken, Logs, Alerts, Aktionsgruppen), Network Watcher | B11 | ✗ |
| | Backup, Site Recovery | B11 | ✗ |

## AWS SAA-C03

| Bereich | Thema | Level | Stand |
|---|---|---|---|
| Secure | IAM, Organizations, SCPs | B4 | ✓ |
| | Cognito, IAM Identity Center, Verbund | B6 | ✗ |
| | KMS, Secrets Manager, ACM, Verschlüsselung | B6 | ✗ |
| | Shield, WAF, GuardDuty, Macie, Inspector | B6 | ✗ |
| | VPC-Sicherheit (SG, NACL, Endpoints) | B4, B5 | ✓ |
| Resilient | Entkopplung (SQS, SNS, EventBridge, Step Functions) | B9 | ✗ |
| | Container (ECS, EKS, Fargate) und Lambda | B8, B9 | ✗ |
| | ELB, Auto Scaling, Route-53-Routingrichtlinien | B4, B5, B11 | ◐ |
| | DR-Strategien (Backup & Restore, Pilot Light, Warm Standby, Multi-Site) | B11 | ✗ |
| Performant | Speicher (EBS-Typen, EFS, FSx, S3-Klassen) | B4, B7 | ◐ |
| | Datenbanken (RDS, Aurora, DynamoDB, ElastiCache) | B7 | ✗ |
| | CloudFront, Global Accelerator | B5 | ✓ |
| | Daten (Kinesis, Athena, Glue, Redshift) | B7 | ✗ |
| Cost | Kaufmodelle (On-Demand, RI, Savings Plans, Spot) | B4 | ✓ |
| | Kostenwerkzeuge (Cost Explorer, Budgets), Datentransferkosten | B12 | ✗ |

## Geplante Level (Reihenfolge im Lernpfad)

Teil A: A7 Routing · A8 Netzwerkdienste · A9 TCP/UDP & Ports · A10 WLAN · A11 Netzwerksicherheit · A12 WAN, SD-WAN & QoS · A13 Betrieb & Monitoring · A14 Automatisierung · A15 Troubleshooting

Teil B: B6 Identität & Sicherheit · B7 Speicher & Datenbanken · B8 Container & Kubernetes · B9 Serverless & Integration · B10 Infrastructure as Code · B11 Monitoring, Backup & HA · B12 Kosten & Governance · B13 DevOps & CI/CD

Ergänzend: der **Service Desk** (Seite `/desk`) übt das Gelernte an echten Support-Tickets.
