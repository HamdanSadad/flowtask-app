# FlowTask 🚀

FlowTask is a modern, interactive, and fully responsive full-stack task management application designed to help users organize their workflow efficiently. With a sleek UI and smooth animations, it offers a premium user experience across all devices.

## ✨ Features

*   **User Authentication:** Secure registration and login using JWT.
*   **Project Management:** Create, edit, and categorize projects with custom colors and a selection of 15+ icons (Folder, Briefcase, GraduationCap, Dumbbell, Pizza, etc.).
*   **Task Management:** Add tasks to specific projects, set priorities, deadlines, and track completion status.
*   **Activity History:** View recently completed tasks and clear history.
*   **Admin Panel:** Administrators can manage user accounts, change roles (User/Admin), edit passwords, and delete users.
*   **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop screens with an intuitive hamburger menu and sliding sidebar.
*   **High Security:** Implements Anti-XSS validation preventing malicious symbols in inputs, keeping the database secure.
*   **Smooth Animations:** Powered by GSAP and Framer Motion for a dynamic, live-feeling interface.

## 🛠️ Tech Stack

**Frontend:**
*   React 19 + Vite
*   TypeScript
*   Tailwind CSS (Styling)
*   GSAP (Micro-animations)
*   Lucide React (Icons)
*   Axios

**Backend:**
*   Node.js & Express
*   TypeScript
*   Prisma ORM
*   PostgreSQL
*   JSON Web Token (JWT) & bcryptjs

---

## 💻 Local Development Setup

To run this project locally, you will need **Node.js** and a **PostgreSQL** database.

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Rename `.env.example` to `.env` and fill in your PostgreSQL `DATABASE_URL` and `JWT_SECRET`.
4. Run Prisma database migrations to create tables:
   ```bash
   npx prisma migrate dev
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(Server will run on http://localhost:5000)*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Rename `.env.example` to `.env` and ensure `VITE_API_URL` is pointing to your backend (e.g., `http://localhost:5000/api`).
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *(App will run on http://localhost:5173)*

---

## ☁️ Deployment

This project is built using a Monorepo structure, making it easy to deploy on modern cloud platforms.

*   **Frontend:** Deployed on **Vercel** (Set Root Directory to `frontend`).
*   **Backend:** Deployed on **Render.com** (Set Root Directory to `backend`, use `npm install && npx prisma generate && npx tsc` for build, and `npm start` to run).
*   **Database:** Hosted on **Neon.tech** (PostgreSQL).

---
*Built with ❤️ for better productivity.*
