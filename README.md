# Sri Gowthami Multi-Campus Admission Management System

An enterprise-grade, full-stack admission management portal designed with Apple/Linear-inspired SaaS layout principles. The portal serves as a unified console managing student enrolments, prospective enquiries (CRM), document verification checklists, notification feeds, reporting, and AI-assisted counselling.

---

## 🎨 Design Philosophy & Architecture

* **Visual Theme**: Minimalist high-contrast dark palette (`#0F0F11`) with emerald accents (`#10B981`) and sleek frosted-glass panels (`.glass-panel`).
* **Adaptive Multi-Role Dashboard**: A single route (`/dashboard`) dynamically presents analytical, workspace, or application progress desks depending on the active cookie-session role (**Super Admin, Counsellor, Faculty, Student, or Parent**).
* **Zero-Config Persistent Sandbox**: Automatically runs locally without external dependencies (Clerk, PostgreSQL, OpenAI, Cloudinary). It persists leads, remarks, uploads, and chat history using a local JSON file (`prisma/mock_db_data.json`).

---

## 📂 Project Directory Structure

```
internship/
├── prisma/
│   ├── schema.prisma            # Prisma relational database structures
│   └── mock_db_data.json        # Simulated database file (Persists CRUD operations)
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Global shell wrapper & meta definitions
│   │   ├── page.tsx             # Marketing landing page
│   │   ├── globals.css          # CSS design tokens, scrollbars, HSL colors
│   │   ├── auth/                # Custom auth views with Simulation Login bypass
│   │   ├── dashboard/           # Multi-role dashboard (Financials, analytics, trackers)
│   │   ├── leads/               # CRM Leads list, filters, assignments, status changes
│   │   ├── counsellors/         # Workspace follow-up desk, call logger, remarks log
│   │   ├── applications/        # Applications tracking checklists & verification drawers
│   │   ├── campuses/            # Affiliated educational centers registry
│   │   ├── programs/            # Program streams roster (MPC, BiPC, B.Sc, ITI, etc.)
│   │   ├── courses/             # Courses catalog & AI Course Advisor assessments
│   │   ├── reports/             # Reporting dashboard with CSV analytical downloader
│   │   ├── settings/            # Portal adjustments & sandbox clean dials
│   │   └── api/                 # REST endpoints (CRM, verify, notifications, AI)
│   ├── components/
│   │   ├── layout-wrapper.tsx   # Omit navigation sidebar on landing/auth screens
│   │   ├── dashboard-nav.tsx    # Role-based sidebar menu
│   │   ├── main-header.tsx      # Notifications bell & Role Session Switcher
│   │   └── chatbot-window.tsx   # Floating AI Admissions Assistant widget
│   └── lib/
│       ├── db.ts                # Database coordinator (Prisma vs local JSON MockDB)
│       ├── mock-db.ts           # Mock database seeding & operations helper
│       ├── auth-session.ts      # Active session cookie switchers
│       ├── ai-service.ts        # AI engine (OpenAI API vs expert heuristics parser)
│       └── utils.ts             # Tailwind class merging & date formatters
├── .env                         # Sandbox configuration parameters
├── tailwind.config.ts           # Styling configurations
└── tsconfig.json                # TypeScript settings
```

---

## 🔗 Database Relationships (schema.prisma)

The schema defines relational constraints across thirteen entities:
1. **User**: Standard user profiles with system roles (`SUPER_ADMIN`, `COUNSELLOR`, `FACULTY`, `STUDENT`, `PARENT`).
2. **Campus**: Multi-campus listings (Schools, Junior Colleges, Degree Colleges, ITI programs).
3. **Program**: Program blocks under campuses.
4. **Course**: Specific classes/courses (MPC 1st Year, B.Sc CS Honours, Fitter Trade Theory) with fees and eligibility.
5. **Lead**: CRM enquiries storing status (`NEW` to `ADMITTED`), lead sources, and counsellor assignments.
6. **Application**: Core application folders linked to document verification nodes and AI evaluations.
7. **Document**: Digital certificates (Aadhaar, SSC marks memo, TC, photo) with status checkers.
8. **Admission**: Confirmed student enrolment tickets tracking tuition fee dues and paid amounts.
9. **CounsellorNote**: Remarks logs submitted during enquiries.
10. **ActivityLog**: History of actions performed on candidate CRM folders.
11. **Notification**: Notification alerts.
12. **Report**: Generated admissions audit registers.

---

## 🛠️ API Endpoint Specifications

| Endpoint | Method | Input Parameters / Body | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/leads` | **GET** | `?id`, `?query`, `?campusId`, `?status` | Loads leads checklist / details |
| `/api/leads` | **POST** | `{ studentName, parentName, mobile, email, campusId, programId, courseId }` | Registers new prospective lead |
| `/api/leads` | **PATCH** | `{ id, status, counsellorId }` OR `{ id, note, authorId }` | Modifies status / assigns counsellor / appends comments |
| `/api/applications`| **GET** | `?id`, `?campusId`, `?status` | Loads applications index or folder details |
| `/api/applications`| **PATCH** | `{ id, status, aiSummary, aiRiskFlags, aiRecommendation }` | Saves verification status / caches AI summaries |
| `/api/documents` | **POST** | `{ name, url, applicationId }` | Submits candidate certificate files |
| `/api/documents` | **PATCH** | `{ id, status, rejectionReason }` | Verification audit (Approve / Reject files) |
| `/api/ai/chat` | **POST** | `{ message, history }` | Queries floating admissions chatbot guide |
| `/api/ai/recommend`| **POST** | `{ academicBackground, interests, careerGoals }` | Queries advisor matching course list |
| `/api/ai/summary` | **POST** | `{ applicationId }` | Scans credentials, flags risks, checks scholarships |
| `/api/reports` | **GET** | - | Fetches past audit compilation lists |
| `/api/reports` | **POST** | `{ title, type, format, generatedBy }` | Spawns custom audit log registers |
| `/api/notifications`| **GET** | `?userId` | Fetches user alerts |
| `/api/notifications`| **POST** | `?userId` | Marks all alerts as read |
| `/api/settings` | **POST** | - | Wipes sandbox database and re-seeds |

---

## 🚀 Sandbox Simulation & Live Production Setup

### Sandbox Run Instructions
1. Run `npm install --legacy-peer-deps` to fetch packages.
2. Build the application using `npm run build`.
3. Start local server using `npm run dev`.
4. Open [http://localhost:3000](http://localhost:3000). Click **Admin Portal** or navigate directly to `/auth/sign-in` to switch mock accounts instantly!

### Switching to Live Production Modes
To wire up real cloud databases, credentials, file stores, and LLM providers, configure the following values inside your production environment:
1. **NeonDB / PostgreSQL**:
   * Change `provider = "postgresql"` in `prisma/schema.prisma` (currently pointing to postgresql driver).
   * Update `DATABASE_URL` in `.env` to point to your live PostgreSQL database connection string.
   * Run `npx prisma db push` to generate tables.
   * Change `NEXT_PUBLIC_MOCK_ENV` in `.env` to `"false"`.
2. **Clerk Authentication**:
   * Update your Clerk project variables `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `.env`.
   * Follow Next.js Clerk guidelines to wrap root layouts in `<ClerkProvider>` and secure endpoints.
3. **Cloudinary Uploads**:
   * Provide `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `.env`.
   * Integrate Cloudinary Next.js upload widgets inside the document uploader files.
4. **OpenAI Assistant**:
   * Add your `OPENAI_API_KEY` to `.env`.
   * The AI scan reports, course recommenders, and floating guide chatbot will dynamically switch from our offline rule-based heuristics engine to live GPT-4o-mini completions!
#   i n t e r n s h i p  
 