Team Task Manager (Ethara AI Project)

1. Project Overview
-------------------
The Team Task Manager is a full-stack web application designed to streamline project and employee management. It provides role-based access control with distinct interfaces for Administrators and Employees. The system allows for efficient assignment of tasks, tracking of project deadlines, and real-time status updates.

2. Technology Stack
-------------------
- Frontend: React.js (Vite), React Router for navigation, Custom CSS for styling.
- Backend: Node.js, Express.js.
- Database: MongoDB.
- Authentication: JSON Web Tokens (JWT) managed securely via browser cookies.
- Deployment: 
  - Frontend hosted on Vercel (with custom vercel.json for SPA routing).
  - Backend hosted on Render (https://ethara-ai-project.onrender.com).

3. Key Features & Functionality
-------------------------------
[Admin Dashboard]
- Secure Login: Access restricted via JWT.
- Employee Management: Add new employees to the company database.
- Project Creation: Create new projects and assign initial tasks, roles, and deadlines.
- Company Dashboard (All Projects View): View all ongoing projects. Expand any project to see a grid of assigned employees.
- Dynamic CRUD Operations on Project Teams:
  - Add Employee: Inline form to add a new team member to an existing project.
  - Edit Details: Inline editing of an employee's role, task, deadline, and status.
  - Remove Employee: Safely remove an employee from a specific project.
- View All Employees: A centralized view of all company personnel.

[Employee Dashboard]
- Secure Login: Employees log in to view their specific assignments.
- Task Tracking: Displays only the tasks assigned to the logged-in user.
- Status Updates: Employees can update their task progress (Pending, In Progress, Completed).

4. API Endpoints Integrated
---------------------------
[Authentication]
- POST /auth/adminlogin: Authenticate an administrator.
- POST /api/emplogin: Authenticate an employee.

[Admin Operations]
- POST /auth/addemployees: Register a new employee.
- POST /auth/admintasks: Create a new project.
- GET /auth/getallprojects: Fetch all company projects.
- GET /auth/getallemp: Fetch all company employees.
- POST /auth/addemp: Assign an employee to an existing project.
- PUT /auth/empupdate: Update an employee's specific task/role inside a project.
- PATCH /auth/deleteemp: Remove an employee from a project.

[Employee Operations]
- GET /api/fetchtasks: Fetch tasks for the logged-in employee.
- PUT /api/taskstatus: Update the status of a specific task.

5. Technical Highlights
-----------------------
- State Management: Efficient use of React hooks (useState, useEffect) to manage active UI states (toggling forms, inline edits) without unnecessary re-renders.
- Error Handling: Granular error capturing from the backend to display exact validation or process errors directly in the UI.
- Single Page Application Routing: Configured vercel.json rewrites to ensure direct URL navigation (e.g., /admin-login) works flawlessly without 404 errors in production.
- UI/UX: Custom responsive CSS utilizing Grid and Flexbox for intuitive layouts, dynamic status badges, and inline editing forms.

6. Setup & Run Instructions (Local)
-----------------------------------
1. Clone the repository.
2. Navigate to the frontend directory: `cd frontend/my-app`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. The application will be running at http://localhost:5173
