# SecureLife Insurance PLC — CRM Frontend

A modern, responsive web application for SecureLife Insurance PLC's Customer Relationship Management (CRM) system.

The frontend provides both the public-facing insurance website and the internal CRM dashboard used by management and insurance advisors.

---

## 🚀 Project Overview

SecureLife Insurance PLC is a life insurance company offering:

- Individual life insurance
- Family protection plans
- Savings-linked policies
- Critical illness coverage

This application provides a digital platform where customers can explore insurance plans and submit inquiries, while internal staff can manage leads, advisors, insurance plans, and customer follow-ups.

---

## ✨ Features

### Public Website

- Responsive landing page
- Company introduction
- Insurance plan overview
- Basic, Gold and Premium plans
- Plan benefits
- Coverage information
- Eligibility criteria
- "Get a Free Quote" form
- "Talk to an Advisor" form
- Responsive navigation
- Modern UI
- Smooth animations

### CRM Dashboard

- Dashboard overview
- Lead management
- Lead sheet
- Lead status tracking
- Advisor management
- Advisor details
- Advisor workload tracking
- Assigned leads
- Insurance plan management
- User authentication
- Role-based access
- Responsive dashboard

### Advisor Management

Administrators can:

- Create advisors
- View advisors
- View advisor details
- Update advisor information
- Activate/deactivate advisors
- View assigned leads
- Monitor advisor lead capacity
- Track advisor performance

### Lead Management

The CRM supports the following lead workflow:

```text
NEW
 ↓
ASSIGNED
 ↓
CONTACTED
 ↓
QUALIFIED
 ↓
PROPOSAL
 ↓
CONVERTED


A lead can also be marked:

LOST
Automatic Advisor Assignment

When a customer submits a lead through the public website, the backend can automatically assign the lead to an available advisor based on advisor workload.

Example:

Advisor A → 8 leads
Advisor B → 3 leads
Advisor C → 6 leads


New Lead
   ↓
Advisor B
🛠️ Technology Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
Next.js App Router
Fetch API
Responsive Design
Backend

The frontend communicates with a separate Express.js backend API.

Next.js
   ↓
REST API
   ↓
Express.js
   ↓
MongoDB
📁 Project Structure

The project follows the Next.js App Router architecture.

securelife-crm-frontend/
│
├── app/
│   │
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── plans/
│   │   └── page.tsx
│   │
│   ├── quote/
│   │   └── page.tsx
│   │
│   └── dashboard/
│       │
│       ├── page.tsx
│       │
│       ├── leads/
│       │   ├── page.tsx
│       │   └── [id]/
│       │       └── page.tsx
│       │
│       ├── advisors/
│       │   ├── page.tsx
│       │   └── [id]/
│       │       └── page.tsx
│       │
│       ├── plans/
│       │   └── page.tsx
│       │
│       └── users/
│           └── page.tsx
│
├── components/
│   │
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   ├── LeadTable.tsx
│   ├── AdvisorCard.tsx
│   ├── PlanCard.tsx
│   └── StatusBadge.tsx
│
├── lib/
│   │
│   └── api.ts
│
├── public/
│   └── images/
│
├── .env.local
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md

The exact structure may vary depending on additional components and pages implemented during development.

⚙️ Requirements

Before running the frontend, install:

Node.js 20 or newer
npm
Git

Check your versions:

node -v
npm -v
git --version
📥 Installation

Clone the repository:

git clone https://github.com/YOUR_USERNAME/securelife-crm-frontend.git

Move into the project:

cd securelife-crm-frontend

Install dependencies:

npm install
🔐 Environment Variables

Create:

.env.local

Add:

NEXT_PUBLIC_API_URL=http://localhost:5000/api

For example:

NEXT_PUBLIC_API_URL=http://localhost:5000/api

The frontend uses this variable to communicate with the Express backend.

▶️ Run Development Server

Start the development server:

npm run dev

Open:

http://localhost:3000
🏗️ Production Build

Create a production build:

npm run build

Start the production server:

npm start
🔗 Backend Connection

The frontend communicates with the backend through REST APIs.

Example:

Frontend
http://localhost:3000


        ↓


Backend API
http://localhost:5000/api


        ↓


MongoDB

Example API calls:

GET    /api/plans
POST   /api/leads
GET    /api/leads
GET    /api/advisors
POST   /api/advisors
GET    /api/advisors/:id
PUT    /api/advisors/:id
DELETE /api/advisors/:id
PUT    /api/leads/:id/assign
🔑 Authentication

The CRM dashboard uses authentication to protect internal functionality.

Authentication flow:

User
 ↓
Login
 ↓
Backend authentication
 ↓
Token
 ↓
Frontend stores authentication token
 ↓
Protected CRM routes

Public pages do not require authentication.

CRM pages require authentication.

👥 User Roles

The system is designed to support different user roles.

Example:

ADMIN
ADVISOR
STAFF
ADMIN

Can:

Manage users
Manage advisors
Manage insurance plans
View leads
Assign leads
View dashboard
ADVISOR

Can:

View assigned leads
Update lead status
Follow up with customers
View customer information
STAFF

Can:

View leads
Manage customer information
Assist with CRM operations
📊 Lead Workflow

The CRM uses a structured sales pipeline.

Customer visits website
        ↓
Submits Free Quote
        ↓
Lead created
        ↓
Insurance plan recommendation
        ↓
Advisor assignment
        ↓
Advisor contacts customer
        ↓
CONTACTED
        ↓
QUALIFIED
        ↓
PROPOSAL
        ↓
CONVERTED

If the customer does not proceed:

LOST
👨‍💼 Advisor Management

The advisor page provides:

Advisor name
Employee ID
Email
Phone
Specialization
Active status
Maximum lead capacity
Current lead count

Example:

Sarah Fernando
Employee ID: ADV002


Family Protection


Email:
sarah@securelife.lk


Phone:
0722222222


Lead Capacity:
7 / 20
📋 Advisor Details

The advisor details page displays:

Advisor profile
Contact information
Specialization
Lead capacity
Lead statistics
Assigned leads
Lead status
Recommended insurance plan

Example:

Total Leads     7
New             1
Contacted       2
Qualified       2
Converted       1
🛡️ Security Considerations

The frontend follows basic security practices:

Authentication for CRM pages
Environment variables for API configuration
No hard-coded API secrets
Protected internal routes
Input validation
HTTPS in production
Secure backend communication

Never store private API keys in:

NEXT_PUBLIC_*

Only public configuration values should use NEXT_PUBLIC_.

📱 Responsive Design

The application is designed for:

Desktop
Laptop
Tablet
Mobile

The CRM dashboard adapts to different screen sizes.

🚀 Deployment

The frontend can be deployed using platforms such as:

Vercel
Netlify
Cloudflare Pages

For production, update:

NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api

Example:

NEXT_PUBLIC_API_URL=https://securelife-api.example.com/api
🧪 Testing

Before deployment, test:

Public Website
[ ] Landing page
[ ] Navigation
[ ] Insurance plans
[ ] Plan comparison
[ ] Quote form
[ ] Form validation
[ ] Mobile responsiveness
CRM
[ ] Login
[ ] Dashboard
[ ] Lead list
[ ] Lead details
[ ] Advisor list
[ ] Advisor details
[ ] Create advisor
[ ] Edit advisor
[ ] Insurance plans
[ ] User management
API Integration
[ ] GET plans
[ ] POST lead
[ ] GET leads
[ ] GET advisors
[ ] POST advisor
[ ] PUT advisor
[ ] GET advisor details
[ ] Assign lead
📌 Future Improvements

Possible future enhancements:

Advanced dashboard analytics
Lead conversion charts
Advisor performance ranking
Search and filtering
Lead activity timeline
Email notifications
SMS notifications
Customer communication history
Appointment scheduling
AI-powered lead scoring
AI insurance plan recommendations
Automated follow-up reminders
Export leads to Excel/PDF
👨‍💻 Development

This project was developed as an IT internship assignment for:

SecureLife Insurance PLC

The application demonstrates:

Full-stack web development
CRM design
REST API integration
Authentication
Lead management
Insurance plan management
Advisor management
Responsive UI development
AI-assisted software development
📄 License

This project was created for educational and internship evaluation purposes.
