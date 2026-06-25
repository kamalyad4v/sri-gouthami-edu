import fs from 'fs';
import path from 'path';

// Define TS Types representing the database models
export type Role = 'SUPER_ADMIN' | 'COUNSELLOR' | 'FACULTY' | 'STUDENT' | 'PARENT';

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'INTERESTED'
  | 'DOCUMENTS_PENDING'
  | 'APPLICATION_SUBMITTED'
  | 'VERIFIED'
  | 'ADMITTED'
  | 'REJECTED';

export type DocStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  clerkUserId?: string | null;
  createdAt: string;
}

export interface Campus {
  id: string;
  name: string;
  type: string;
  address: string;
}

export interface Program {
  id: string;
  name: string;
  duration: string;
  campusId: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  fees: number;
  programId: string;
}

export interface Lead {
  id: string;
  studentName: string;
  parentName: string;
  mobile: string;
  email: string;
  address: string;
  leadSource: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  campusId: string;
  programId: string;
  courseId: string;
  counsellorId: string | null;
}

export interface Document {
  id: string;
  name: string; // "Aadhaar", "SSC Memo", "Intermediate Memo", "Transfer Certificate", "Photo"
  url: string;
  status: DocStatus;
  rejectionReason?: string | null;
  applicationId: string;
  createdAt: string;
}

export interface Application {
  id: string;
  applicationNo: string;
  studentId: string;
  parentId: string | null;
  campusId: string;
  programId: string;
  courseId: string;
  status: LeadStatus;
  aiSummary: string | null;
  aiRiskFlags: string | null;
  aiRecommendation: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Admission {
  id: string;
  admissionNo: string;
  feesPaid: number;
  totalFees: number;
  applicationId: string;
  admittedAt: string;
}

export interface CounsellorNote {
  id: string;
  note: string;
  authorId: string;
  leadId: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  userId: string;
  leadId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  createdAt: string;
}

export interface Report {
  id: string;
  title: string;
  type: string;
  format: string;
  generatedBy: string;
  url: string;
  createdAt: string;
}

export interface MockDatabase {
  users: User[];
  campuses: Campus[];
  programs: Program[];
  courses: Course[];
  leads: Lead[];
  applications: Application[];
  documents: Document[];
  admissions: Admission[];
  counsellorNotes: CounsellorNote[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  reports: Report[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'prisma', 'mock_db_data.json');

// Core seed data
const initialCampuses: Campus[] = [
  { id: 'cam-1', name: 'Sri Gowthami School (Kakinada)', type: 'School', address: 'Main Road, Kakinada' },
  { id: 'cam-2', name: 'Sri Gowthami Junior College (Rajahmundry)', type: 'Junior College', address: 'Danavaipeta, Rajahmundry' },
  { id: 'cam-3', name: 'Sri Gowthami Degree College (Amalapuram)', type: 'Degree College', address: 'Subhash Nagar, Amalapuram' },
  { id: 'cam-4', name: 'Sri Gowthami ITI (Visakhapatnam)', type: 'ITI Program', address: 'Gajuwaka, Visakhapatnam' },
];

const initialPrograms: Program[] = [
  { id: 'prg-1', name: 'Primary Education (Class 1-5)', duration: '5 Years', campusId: 'cam-1' },
  { id: 'prg-2', name: 'Secondary Education (Class 6-10)', duration: '5 Years', campusId: 'cam-1' },
  { id: 'prg-3', name: 'Intermediate (MPC)', duration: '2 Years', campusId: 'cam-2' },
  { id: 'prg-4', name: 'Intermediate (BiPC)', duration: '2 Years', campusId: 'cam-2' },
  { id: 'prg-5', name: 'B.Sc Computer Science', duration: '3 Years', campusId: 'cam-3' },
  { id: 'prg-6', name: 'B.Com Computer Applications', duration: '3 Years', campusId: 'cam-3' },
  { id: 'prg-7', name: 'ITI Electrician', duration: '2 Years', campusId: 'cam-4' },
  { id: 'prg-8', name: 'ITI Fitter', duration: '2 Years', campusId: 'cam-4' },
];

const initialCourses: Course[] = [
  { id: 'crs-1', name: 'Class 5 Standard Curriculum', description: 'Elementary education covering Math, Science, and Social Studies.', eligibility: 'Class 4 Pass', fees: 25000, programId: 'prg-1' },
  { id: 'crs-2', name: 'Class 10 Board Program', description: 'Board preparation curriculum aligned to CBSE/State Board.', eligibility: 'Class 9 Pass', fees: 35000, programId: 'prg-2' },
  { id: 'crs-3', name: 'MPC 1st Year', description: 'Mathematics, Physics, Chemistry stream preparation for competitive exams like JEE/EAPCET.', eligibility: 'Class 10 Pass', fees: 45000, programId: 'prg-3' },
  { id: 'crs-4', name: 'BiPC 1st Year', description: 'Biology, Physics, Chemistry stream preparation for NEET/EAPCET.', eligibility: 'Class 10 Pass', fees: 48000, programId: 'prg-4' },
  { id: 'crs-5', name: 'B.Sc CS (Honours)', description: 'Undergraduate course specializing in Algorithms, Databases, Web Technologies, and AI.', eligibility: 'Intermediate (10+2) MPC Pass', fees: 60000, programId: 'prg-5' },
  { id: 'crs-6', name: 'B.Com Computers', description: 'Modern commerce course with practical instruction on accounting software and coding.', eligibility: 'Intermediate Pass (Any stream)', fees: 50000, programId: 'prg-6' },
  { id: 'crs-7', name: 'Electrician Trade Theory & Practical', description: 'Electrical installations, safety protocols, and wiring systems.', eligibility: 'Class 10 Pass', fees: 20000, programId: 'prg-7' },
  { id: 'crs-8', name: 'Fitter Engineering & Drawing', description: 'Mechanical assembly, machining, and engineering drawing.', eligibility: 'Class 10 Pass', fees: 18000, programId: 'prg-8' },
];

const initialUsers: User[] = [
  { id: 'usr-1', email: 'admin@gowthami.edu', name: 'Sri Devi (Director)', role: 'SUPER_ADMIN', clerkUserId: 'clerk_admin', createdAt: new Date().toISOString() },
  { id: 'usr-2', email: 'counsellor.rama@gowthami.edu', name: 'Rama Rao', role: 'COUNSELLOR', clerkUserId: 'clerk_counsellor_1', createdAt: new Date().toISOString() },
  { id: 'usr-3', email: 'counsellor.sita@gowthami.edu', name: 'Sita Kumari', role: 'COUNSELLOR', clerkUserId: 'clerk_counsellor_2', createdAt: new Date().toISOString() },
  { id: 'usr-4', email: 'faculty.krishna@gowthami.edu', name: 'Prof. Krishna Rao', role: 'FACULTY', clerkUserId: 'clerk_faculty_1', createdAt: new Date().toISOString() },
  { id: 'usr-5', email: 'student.aditya@gmail.com', name: 'Aditya Varma', role: 'STUDENT', clerkUserId: 'clerk_student_1', createdAt: new Date().toISOString() },
  { id: 'usr-6', email: 'parent.srinivas@gmail.com', name: 'Srinivas Varma', role: 'PARENT', clerkUserId: 'clerk_parent_1', createdAt: new Date().toISOString() },
];

const initialLeads: Lead[] = [
  {
    id: 'ld-1',
    studentName: 'Aditya Varma',
    parentName: 'Srinivas Varma',
    mobile: '9848022338',
    email: 'student.aditya@gmail.com',
    address: 'Suryaraopeta, Kakinada',
    leadSource: 'Google Search Ad',
    status: 'APPLICATION_SUBMITTED',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    campusId: 'cam-3',
    programId: 'prg-5',
    courseId: 'crs-5',
    counsellorId: 'usr-2',
  },
  {
    id: 'ld-2',
    studentName: 'Divya Sri',
    parentName: 'Prasad Rao',
    mobile: '8123456789',
    email: 'divya.sri@gmail.com',
    address: 'Kovvur Road, Rajahmundry',
    leadSource: 'Newspaper Ad',
    status: 'NEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    campusId: 'cam-2',
    programId: 'prg-3',
    courseId: 'crs-3',
    counsellorId: 'usr-2',
  },
  {
    id: 'ld-3',
    studentName: 'Tarun Kumar',
    parentName: 'Venkata Ramana',
    mobile: '9900112233',
    email: 'tarun.k@gmail.com',
    address: 'Jagannaickpur, Kakinada',
    leadSource: 'Walk-in Enquiry',
    status: 'CONTACTED',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    campusId: 'cam-1',
    programId: 'prg-2',
    courseId: 'crs-2',
    counsellorId: 'usr-3',
  },
  {
    id: 'ld-4',
    studentName: 'Harsha Vardhan',
    parentName: 'Narayana Murthy',
    mobile: '9440556677',
    email: 'harsha.v@gmail.com',
    address: 'Gajuwaka, Visakhapatnam',
    leadSource: 'Education Fair',
    status: 'INTERESTED',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    campusId: 'cam-4',
    programId: 'prg-7',
    courseId: 'crs-7',
    counsellorId: 'usr-3',
  },
  {
    id: 'ld-5',
    studentName: 'Kavitha Reddy',
    parentName: 'Mohan Reddy',
    mobile: '9177665544',
    email: 'kavitha.r@gmail.com',
    address: 'Amalapuram Bypass',
    leadSource: 'Referral',
    status: 'ADMITTED',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    campusId: 'cam-3',
    programId: 'prg-6',
    courseId: 'crs-6',
    counsellorId: 'usr-2',
  },
];

const initialApplications: Application[] = [
  {
    id: 'app-1',
    applicationNo: 'SG-2026-BScCS-001',
    studentId: 'usr-5',
    parentId: 'usr-6',
    campusId: 'cam-3',
    programId: 'prg-5',
    courseId: 'crs-5',
    status: 'APPLICATION_SUBMITTED',
    aiSummary: 'Applicant Aditya Varma holds standard qualification. Score sheets show 9.2 GPA in SSC and 91% in Intermediate. Recommended for Admission.',
    aiRiskFlags: 'No significant risk flags. Aadhaar and Intermediate memo match identity.',
    aiRecommendation: 'PROCEED: Fast-track candidate. Highly eligible for merit scholarship.',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const initialDocuments: Document[] = [
  { id: 'doc-1', name: 'Aadhaar Card', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=60', status: 'APPROVED', applicationId: 'app-1', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'doc-2', name: 'SSC Memo (10th)', url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=60', status: 'APPROVED', applicationId: 'app-1', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'doc-3', name: 'Intermediate Memo (12th)', url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=60', status: 'PENDING', applicationId: 'app-1', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'doc-4', name: 'Transfer Certificate', url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=60', status: 'PENDING', applicationId: 'app-1', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'doc-5', name: 'Student Photo', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60', status: 'APPROVED', applicationId: 'app-1', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
];

const initialAdmissions: Admission[] = [
  {
    id: 'adm-1',
    admissionNo: 'ADM-2026-005',
    feesPaid: 15000.0,
    totalFees: 50000.0,
    applicationId: 'app-1',
    admittedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const initialCounsellorNotes: CounsellorNote[] = [
  { id: 'nt-1', note: 'Called candidate, they requested details about scholarship slots and campus placements.', authorId: 'usr-2', leadId: 'ld-1', createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'nt-2', note: 'Sent prospectus via WhatsApp. Candidate confirmed they will visit campus this Friday.', authorId: 'usr-2', leadId: 'ld-1', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
];

const initialLogs: ActivityLog[] = [
  { id: 'lg-1', action: 'Lead Assigned to Rama Rao', userId: 'usr-1', leadId: 'ld-1', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'lg-2', action: 'Status changed to Contacted', userId: 'usr-2', leadId: 'ld-1', createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'lg-3', action: 'Status changed to Interested', userId: 'usr-2', leadId: 'ld-1', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'lg-4', action: 'Status changed to Application Submitted', userId: 'usr-2', leadId: 'ld-1', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
];

const initialNotifications: Notification[] = [
  { id: 'nf-1', title: 'New Application', message: 'Student Aditya Varma submitted a new application SG-2026-BScCS-001', isRead: false, userId: 'usr-1', createdAt: new Date().toISOString() },
  { id: 'nf-2', title: 'Pending Verifications', message: 'You have documents waiting for verification.', isRead: false, userId: 'usr-2', createdAt: new Date().toISOString() },
];

const initialReports: Report[] = [
  { id: 'rp-1', title: 'Campus Enquiries Analysis Q2', type: 'Campus', format: 'PDF', generatedBy: 'Sri Devi', url: '#', createdAt: new Date().toISOString() },
];

const fallbackDb: MockDatabase = {
  users: initialUsers,
  campuses: initialCampuses,
  programs: initialPrograms,
  courses: initialCourses,
  leads: initialLeads,
  applications: initialApplications,
  documents: initialDocuments,
  admissions: initialAdmissions,
  counsellorNotes: initialCounsellorNotes,
  activityLogs: initialLogs,
  notifications: initialNotifications,
  reports: initialReports,
};

// Sync functions to load/save JSON file
export function getMockDb(): MockDatabase {
  if (!fs.existsSync(path.dirname(DB_FILE_PATH))) {
    fs.mkdirSync(path.dirname(DB_FILE_PATH), { recursive: true });
  }

  if (!fs.existsSync(DB_FILE_PATH)) {
    saveMockDb(fallbackDb);
    return fallbackDb;
  }

  try {
    const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse mock database, falling back to initial data', error);
    return fallbackDb;
  }
}

export function saveMockDb(db: MockDatabase) {
  try {
    if (!fs.existsSync(path.dirname(DB_FILE_PATH))) {
      fs.mkdirSync(path.dirname(DB_FILE_PATH), { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write to mock database JSON file', error);
  }
}
