// src/mock/initialData.js

export const initialCustomers = [
  {
    id: "cust-1",
    name: "Aravind Swaminathan",
    email: "aravind.s@innovatetech.io",
    phone: "+91 98450 11223",
    company: "InnovateTech Labs",
    location: "Bengaluru, Karnataka",
    status: "Active", // Active | Inactive | Lead
    assignedEmployee: "Priya Sharma",
    createdDate: "2026-01-15T09:30:00.000Z",
    notes: [
      {
        id: "note-1",
        author: "Priya Sharma",
        content: "Initial onboarding call completed. Client requested enterprise pricing tier.",
        createdAt: "2026-01-16T10:00:00.000Z",
      },
    ],
    activities: [
      {
        id: "act-1",
        type: "Created",
        description: "Customer profile created in system.",
        timestamp: "2026-01-15T09:30:00.000Z",
      },
    ],
  },
  {
    id: "cust-2",
    name: "Meera Krishnan",
    email: "meera.k@zenithcorp.com",
    phone: "+91 97110 44556",
    company: "Zenith Retail Corp",
    location: "Hyderabad, Telangana",
    status: "Active",
    assignedEmployee: "Vikram Mehta",
    createdDate: "2026-02-04T14:20:00.000Z",
    notes: [],
    activities: [
      {
        id: "act-2",
        type: "Created",
        description: "Customer profile created from qualified lead.",
        timestamp: "2026-02-04T14:20:00.000Z",
      },
    ],
  },
  {
    id: "cust-3",
    name: "Rohan Kulkarni",
    email: "rohan@cloudscale.net",
    phone: "+91 99200 88990",
    company: "CloudScale Systems",
    location: "Pune, Maharashtra",
    status: "Inactive",
    assignedEmployee: "Ananya Rao",
    createdDate: "2026-02-18T11:45:00.000Z",
    notes: [],
    activities: [],
  },
  {
    id: "cust-4",
    name: "Sneha Patel",
    email: "sneha.p@apexglobal.in",
    phone: "+91 98800 33441",
    company: "Apex Global Logistics",
    location: "Chennai, Tamil Nadu",
    status: "Active",
    assignedEmployee: "Priya Sharma",
    createdDate: "2026-03-02T16:10:00.000Z",
    notes: [],
    activities: [],
  },
];

export const initialLeads = [
  {
    id: "lead-1",
    name: "Devendra Verma",
    email: "devendra@fintechhub.in",
    phone: "+91 98220 77112",
    company: "FinTech Hub",
    location: "Mumbai, Maharashtra",
    status: "New", // New | Contacted | Follow-up | Qualified | Converted | Lost
    assignedEmployee: "Priya Sharma",
    source: "Website Form",
    createdDate: "2026-03-01T08:00:00.000Z",
  },
  {
    id: "lead-2",
    name: "Divya Nair",
    email: "divya.n@greentech.org",
    phone: "+91 94470 55667",
    company: "GreenTech Ventures",
    location: "Kochi, Kerala",
    status: "Contacted",
    assignedEmployee: "Vikram Mehta",
    source: "LinkedIn Outreach",
    createdDate: "2026-03-03T11:15:00.000Z",
  },
  {
    id: "lead-3",
    name: "Karthik Raja",
    email: "karthik.r@omnisolutions.co",
    phone: "+91 97900 12345",
    company: "Omni Solutions",
    location: "Chennai, Tamil Nadu",
    status: "Qualified",
    assignedEmployee: "Ananya Rao",
    source: "Referral",
    createdDate: "2026-03-04T13:40:00.000Z",
  },
  {
    id: "lead-4",
    name: "Shalini Saxena",
    email: "shalini@brightpath.edu",
    phone: "+91 98100 99887",
    company: "BrightPath Academy",
    location: "Delhi, NCR",
    status: "Follow-up",
    assignedEmployee: "Priya Sharma",
    source: "Cold Call",
    createdDate: "2026-03-05T09:20:00.000Z",
  },
];

export const initialTasks = [
  {
    id: "task-1",
    title: "Schedule product demo for Apex Global",
    description: "Prepare customized demo slides for logistics integration module.",
    assignedTo: "Priya Sharma",
    customerId: "cust-4",
    leadId: null,
    priority: "High", // Low | Medium | High
    status: "Todo", // Todo | In Progress | Completed
    dueDate: "2026-09-05",
    createdAt: "2026-03-05T10:00:00.000Z",
  },
  {
    id: "task-2",
    title: "Follow up with Devendra on pricing",
    description: "Send standard quote breakdown for 50 user seats.",
    assignedTo: "Priya Sharma",
    customerId: null,
    leadId: "lead-1",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-09-03",
    createdAt: "2026-03-04T14:30:00.000Z",
  },
  {
    id: "task-3",
    title: "Contract review for InnovateTech",
    description: "Verify SLA terms with legal team before final signature.",
    assignedTo: "Vikram Mehta",
    customerId: "cust-1",
    leadId: null,
    priority: "High",
    status: "Completed",
    dueDate: "2026-03-02",
    createdAt: "2026-02-28T09:15:00.000Z",
  },
];

export const availableEmployees = [
  "Priya Sharma",
  "Vikram Mehta",
  "Ananya Rao",
  "Suresh Nair",
];