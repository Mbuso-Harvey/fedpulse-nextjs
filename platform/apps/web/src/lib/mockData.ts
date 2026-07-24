import { DepartmentProfile, SupplierProfile, ExpiringContract, CaptureItem } from './types';

export const DEPARTMENTS: DepartmentProfile[] = [
  {
    id: 'dept-dod',
    name: 'Department of Defense (DOD)',
    code: 'DOD-01',
    totalValue: 142500000000,
    contractCount: 8420,
    topSuppliers: [
      { name: 'Lockheed Martin', value: 38200000000, share: 26.8 },
      { name: 'General Dynamics', value: 24100000000, share: 16.9 },
      { name: 'Booz Allen Hamilton', value: 18500000000, share: 13.0 },
      { name: 'Leidos', value: 14200000000, share: 10.0 },
      { name: 'CACI International', value: 11800000000, share: 8.3 }
    ],
    topCategories: [
      { category: 'Cybersecurity & C4ISR', value: 45200000000 },
      { category: 'Cloud & Systems Integration', value: 38100000000 },
      { category: 'Logistics & Supply Chain', value: 29400000000 },
      { category: 'R&D / Advanced Analytics', value: 29800000000 }
    ],
    renewalExposure: { urgent: 24, soon: 68, watch: 142 },
    spendingTrend: [
      { year: '2022', amount: 122.4 },
      { year: '2023', amount: 131.0 },
      { year: '2024', amount: 138.2 },
      { year: '2025', amount: 142.5 }
    ],
    subAgencies: [
      { name: 'US Air Force', spending: 48500000000, contracts: 2410 },
      { name: 'US Army', spending: 42100000000, contracts: 2850 },
      { name: 'US Navy / Marines', spending: 36200000000, contracts: 2100 },
      { name: 'DARPA & Defense Agencies', spending: 15700000000, contracts: 1060 }
    ]
  },
  {
    id: 'dept-dhs',
    name: 'Department of Homeland Security (DHS)',
    code: 'DHS-02',
    totalValue: 34800000000,
    contractCount: 2950,
    topSuppliers: [
      { name: 'CACI International', value: 6800000000, share: 19.5 },
      { name: 'Peraton', value: 5200000000, share: 14.9 },
      { name: 'SAIC', value: 4400000000, share: 12.6 },
      { name: 'Guidehouse', value: 3100000000, share: 8.9 },
      { name: 'Accenture Federal', value: 2800000000, share: 8.0 }
    ],
    topCategories: [
      { category: 'Border Security Systems', value: 12400000000 },
      { category: 'IT Modernization & Zero Trust', value: 10800000000 },
      { category: 'Biometric Analytics & AI', value: 6200000000 },
      { category: 'Facilities Management', value: 5400000000 }
    ],
    renewalExposure: { urgent: 12, soon: 34, watch: 88 },
    spendingTrend: [
      { year: '2022', amount: 28.5 },
      { year: '2023', amount: 31.2 },
      { year: '2024', amount: 33.0 },
      { year: '2025', amount: 34.8 }
    ],
    subAgencies: [
      { name: 'CISA (Cybersecurity & Infrastructure)', spending: 11200000000, contracts: 840 },
      { name: 'CBP (Customs & Border Protection)', spending: 9800000000, contracts: 920 },
      { name: 'FEMA', spending: 8100000000, contracts: 680 },
      { name: 'TSA', spending: 5700000000, contracts: 510 }
    ]
  },
  {
    id: 'dept-va',
    name: 'Department of Veterans Affairs (VA)',
    code: 'VA-03',
    totalValue: 28400000000,
    contractCount: 3120,
    topSuppliers: [
      { name: 'Oracle Cerner', value: 5400000000, share: 19.0 },
      { name: 'Booz Allen Hamilton', value: 3900000000, share: 13.7 },
      { name: 'Aptive Environmental (SDVOSB)', value: 2800000000, share: 9.8 },
      { name: 'Cognosante', value: 2100000000, share: 7.4 },
      { name: 'Halfaker & Associates', value: 1800000000, share: 6.3 }
    ],
    topCategories: [
      { category: 'EHR & Health IT Modernization', value: 11500000000 },
      { category: 'Medical Equipment & Logistics', value: 8200000000 },
      { category: 'Clinical Support Services', value: 4800000000 },
      { category: 'Claims Processing Automation', value: 3900000000 }
    ],
    renewalExposure: { urgent: 18, soon: 41, watch: 95 },
    spendingTrend: [
      { year: '2022', amount: 22.1 },
      { year: '2023', amount: 24.8 },
      { year: '2024', amount: 26.5 },
      { year: '2025', amount: 28.4 }
    ],
    subAgencies: [
      { name: 'VHA (Veterans Health Admin)', spending: 18200000000, contracts: 1980 },
      { name: 'VBA (Veterans Benefits Admin)', spending: 6400000000, contracts: 710 },
      { name: 'NCA (Cemetery Admin) & OIT', spending: 3800000000, contracts: 430 }
    ]
  },
  {
    id: 'dept-hhs',
    name: 'Department of Health & Human Services (HHS)',
    code: 'HHS-04',
    totalValue: 31200000000,
    contractCount: 2780,
    topSuppliers: [
      { name: 'General Dynamics IT', value: 4800000000, share: 15.4 },
      { name: 'Deloitte Consulting', value: 4100000000, share: 13.1 },
      { name: 'Leidos', value: 3600000000, share: 11.5 },
      { name: 'Palantir Technologies', value: 2200000000, share: 7.0 },
      { name: 'LMI', value: 1900000000, share: 6.1 }
    ],
    topCategories: [
      { category: 'Bio-Surveillance & NIH Data Platforms', value: 10400000000 },
      { category: 'Medicare/Medicaid Systems', value: 9200000000 },
      { category: 'FDA Regulatory Automation', value: 6100000000 },
      { category: 'Public Health Infrastructure', value: 5500000000 }
    ],
    renewalExposure: { urgent: 8, soon: 28, watch: 76 },
    spendingTrend: [
      { year: '2022', amount: 25.8 },
      { year: '2023', amount: 27.9 },
      { year: '2024', amount: 29.4 },
      { year: '2025', amount: 31.2 }
    ],
    subAgencies: [
      { name: 'CMS (Medicare/Medicaid)', spending: 12800000000, contracts: 920 },
      { name: 'NIH (National Institutes of Health)', spending: 9400000000, contracts: 1100 },
      { name: 'CDC & FDA', spending: 9000000000, contracts: 760 }
    ]
  }
];

export const SUPPLIERS: SupplierProfile[] = [
  {
    id: 'sup-leidos',
    name: 'Leidos, Inc.',
    totalContractValue: 18400000000,
    marketShare: 12.8,
    influenceScore: 94,
    contractCount: 1420,
    isTeamingPartnerCandidate: true,
    setAsideCapabilities: ['Large Business'],
    clearances: ['TS/SCI', 'Secret', 'Top Secret'],
    coreCompetencies: ['Full-Scale Cloud Integration', 'Cybersecurity Ops', 'Defense Health IT', 'Intelligence Analytics'],
    departmentFootprint: [
      { deptName: 'DOD', value: 14200000000, share: 77.2 },
      { deptName: 'HHS', value: 3600000000, share: 19.5 },
      { deptName: 'DHS', value: 600000000, share: 3.3 }
    ],
    location: 'Reston, VA',
    contactPerson: 'Director of Teaming Alliances',
    contactEmail: 'teaming@leidos.com'
  },
  {
    id: 'sup-booz',
    name: 'Booz Allen Hamilton',
    totalContractValue: 22400000000,
    marketShare: 15.6,
    influenceScore: 98,
    contractCount: 1890,
    isTeamingPartnerCandidate: true,
    setAsideCapabilities: ['Large Business'],
    clearances: ['TS/SCI Polygraph', 'TS/SCI', 'Secret'],
    coreCompetencies: ['AI/ML Command Systems', 'Zero Trust Cyber', 'Management Consulting', 'Defense Modernization'],
    departmentFootprint: [
      { deptName: 'DOD', value: 18500000000, share: 82.5 },
      { deptName: 'VA', value: 3900000000, share: 17.5 }
    ],
    location: 'McLean, VA',
    contactPerson: 'Federal Partnerships Office',
    contactEmail: 'partnerships@boozallen.com'
  },
  {
    id: 'sup-apex',
    name: 'Apex Vanguard Solutions (SDVOSB)',
    totalContractValue: 840000000,
    marketShare: 2.1,
    influenceScore: 82,
    contractCount: 64,
    isTeamingPartnerCandidate: true,
    setAsideCapabilities: ['SDVOSB', 'Service-Disabled Veteran'],
    clearances: ['TS/SCI', 'Secret'],
    coreCompetencies: ['DevSecOps', 'Tactical Cloud Architecture', 'VA Health Records Integration', 'Cyber Threat Hunting'],
    departmentFootprint: [
      { deptName: 'VA', value: 520000000, share: 61.9 },
      { deptName: 'DOD', value: 320000000, share: 38.1 }
    ],
    location: 'Arlington, VA',
    contactPerson: 'Marcus Vance, VP Business Development',
    contactEmail: 'mvance@apexvanguard.com'
  },
  {
    id: 'sup-cyber8a',
    name: 'CyberShield 8(a) Alliance',
    totalContractValue: 410000000,
    marketShare: 1.4,
    influenceScore: 78,
    contractCount: 42,
    isTeamingPartnerCandidate: true,
    setAsideCapabilities: ['8(a)', 'SDB', 'Small Disadvantaged'],
    clearances: ['Top Secret', 'Secret'],
    coreCompetencies: ['CISA Cyber Incident Response', 'Identity Access Management', 'Zero Trust Architecture'],
    departmentFootprint: [
      { deptName: 'DHS', value: 280000000, share: 68.3 },
      { deptName: 'HHS', value: 130000000, share: 31.7 }
    ],
    location: 'Huntsville, AL',
    contactPerson: 'Elena Rostova, CEO & Founder',
    contactEmail: 'erostova@cybershield8a.com'
  },
  {
    id: 'sup-hubzone',
    name: 'Aegis Tech HUBZone Systems',
    totalContractValue: 360000000,
    marketShare: 1.1,
    influenceScore: 75,
    contractCount: 38,
    isTeamingPartnerCandidate: true,
    setAsideCapabilities: ['HUBZone', 'WOSB', 'Woman-Owned'],
    clearances: ['Secret', 'Public Trust'],
    coreCompetencies: ['Data Center Consolidation', 'Enterprise Help Desk', 'Cloud Migration & FinOps'],
    departmentFootprint: [
      { deptName: 'VA', value: 210000000, share: 58.3 },
      { deptName: 'DHS', value: 150000000, share: 41.7 }
    ],
    location: 'Baltimore, MD',
    contactPerson: 'Sarah Jenkins, Capture Manager',
    contactEmail: 'sjenkins@aegistechhub.com'
  }
];

export const EXPIRING_CONTRACTS: ExpiringContract[] = [
  {
    id: 'cnt-001',
    referenceNumber: 'FA8730-21-C-0042',
    title: 'Air Force C2ISR Cloud Modernization & Zero Trust Infrastructure',
    department: 'Department of Defense (DOD)',
    subAgency: 'US Air Force (AFMC)',
    incumbent: 'Leidos, Inc.',
    value: 184000000,
    expirationDate: '2026-09-15',
    daysLeft: 54,
    status: 'Urgent',
    naicsCode: '541512 - Computer Systems Design',
    setAside: 'Full & Open',
    description: 'Re-compete for multi-cloud DevSecOps pipeline, multi-domain command & control integration, and continuous authority to operate (cATO) compliance.',
    pwinEstimate: 78
  },
  {
    id: 'cnt-002',
    referenceNumber: '70RTTO22F0000019',
    title: 'CISA Cyber Threat Hunting & Automated Response Engine (CTHARE)',
    department: 'Department of Homeland Security (DHS)',
    subAgency: 'CISA',
    incumbent: 'CACI International',
    value: 92000000,
    expirationDate: '2026-10-30',
    daysLeft: 99,
    status: 'Expiring Soon',
    naicsCode: '541519 - Other Computer Related Services',
    setAside: 'SDVOSB Set-Aside Target',
    description: 'Federal-wide threat intelligence ingest, AI-driven malware sandbox triage, and continuous diagnostic and mitigation (CDM) sensor management.',
    pwinEstimate: 84
  },
  {
    id: 'cnt-003',
    referenceNumber: '36C10B21C0089',
    title: 'VA Telehealth Analytics & Clinical Decision Support System',
    department: 'Department of Veterans Affairs (VA)',
    subAgency: 'VHA Office of Connected Care',
    incumbent: 'Aptive Environmental',
    value: 65000000,
    expirationDate: '2026-11-20',
    daysLeft: 120,
    status: 'Expiring Soon',
    naicsCode: '541511 - Custom Computer Programming',
    setAside: 'SDVOSB Mandatory',
    description: 'Real-time telemetry processing from 1.2M veteran home monitoring devices, automated triage alerts, and EHR integration with Oracle Cerner.',
    pwinEstimate: 62
  },
  {
    id: 'cnt-004',
    referenceNumber: 'HHSP233202100014I',
    title: 'NIH BioData Catalyst Cloud Infrastructure & AI Pipeline',
    department: 'Department of Health & Human Services (HHS)',
    subAgency: 'National Institutes of Health (NIH)',
    incumbent: 'General Dynamics IT',
    value: 128000000,
    expirationDate: '2027-01-15',
    daysLeft: 176,
    status: 'Watch',
    naicsCode: '541715 - R&D in Physical/Engineering Sciences',
    setAside: 'Full & Open',
    description: 'Petabyte-scale genomic repository storage, federated AI workspace compute, and secure multi-institutional researcher authentication.',
    pwinEstimate: 71
  },
  {
    id: 'cnt-005',
    referenceNumber: '47QTCA21D0089',
    title: 'GSA Enterprise AI & Data Governance Automation Task Order',
    department: 'General Services Administration (GSA)',
    subAgency: 'Federal Acquisition Service (FAS)',
    incumbent: 'Booz Allen Hamilton',
    value: 48000000,
    expirationDate: '2027-03-31',
    daysLeft: 251,
    status: 'Tracked',
    naicsCode: '541611 - Administrative Management Consulting',
    setAside: '8(a) Competitive',
    description: 'Machine learning for federal procurement spend analysis, vendor risk management algorithms, and natural language contract auditing.',
    pwinEstimate: 88
  }
];

export const CAPTURE_PIPELINE_ITEMS: CaptureItem[] = [
  {
    id: 'cap-101',
    title: 'CISA Cyber Threat Hunting Re-compete (CTHARE)',
    referenceNumber: '70RTTO22F0000019',
    agency: 'DHS / CISA',
    value: 92000000,
    stage: 'teaming',
    winProbability: 84,
    recommendation: 'TEAM',
    teamingPartner: 'Apex Vanguard Solutions (SDVOSB)',
    owner: 'Sarah Jenkins',
    dueDate: '2026-09-30',
    assignedTeam: ['Sarah Jenkins (Capture Lead)', 'David Kim (Solution Architect)', 'Rachel Torres (Proposal Director)'],
    nextMilestone: 'Execute Teaming Agreement & SDVOSB Joint Venture Docs',
    riskCount: 2,
    notes: 'Primary SDVOSB partner confirmed. High synergy on zero trust threat telemetry.'
  },
  {
    id: 'cap-102',
    title: 'Air Force C2ISR Cloud Modernization',
    referenceNumber: 'FA8730-21-C-0042',
    agency: 'DOD / Air Force',
    value: 184000000,
    stage: 'proposal',
    winProbability: 78,
    recommendation: 'BID',
    teamingPartner: 'Leidos (Incumbent Sub Strategy)',
    owner: 'Markus Vance',
    dueDate: '2026-08-28',
    assignedTeam: ['Markus Vance (Lead)', 'Lt. Col. (Ret) Greg Harris (SME)', 'Elena Rostova (Tech Lead)'],
    nextMilestone: 'Red Team Proposal Review & Cost Rate Finalization',
    riskCount: 1,
    notes: 'Draft Volume 1 Technical completed. Price proposal competitive at 8.2% margin.'
  },
  {
    id: 'cap-103',
    title: 'VA Telehealth Analytics Platform',
    referenceNumber: '36C10B21C0089',
    agency: 'Department of Veterans Affairs',
    value: 65000000,
    stage: 'qualification',
    winProbability: 62,
    recommendation: 'TEAM',
    teamingPartner: 'Aegis Tech HUBZone Systems',
    owner: 'Rachel Torres',
    dueDate: '2026-10-15',
    assignedTeam: ['Rachel Torres', 'Dr. Aris Thorne (Health IT)'],
    nextMilestone: 'Gate 1 Bid/No-Bid Decision Review',
    riskCount: 3,
    notes: 'Checking incumbent performance gaps in EHR sync to build differentiator.'
  },
  {
    id: 'cap-104',
    title: 'GSA Enterprise Procurement AI Engine',
    referenceNumber: '47QTCA21D0089',
    agency: 'GSA FAS',
    value: 48000000,
    stage: 'submitted',
    winProbability: 88,
    recommendation: 'BID',
    teamingPartner: 'CyberShield 8(a) Prime',
    owner: 'David Kim',
    dueDate: '2026-07-10',
    assignedTeam: ['David Kim', 'Sarah Jenkins'],
    nextMilestone: 'Awaiting Contracting Officer BAFO / Clarification Questions',
    riskCount: 0,
    notes: 'Proposal submitted ahead of deadline. Oral presentation prepped.'
  }
];

export const MOCK_CONTRACTS = EXPIRING_CONTRACTS;
export const DEPARTMENT_STATS = DEPARTMENTS;
export const SUPPLIER_STATS = SUPPLIERS;
