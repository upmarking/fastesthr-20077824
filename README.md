# FastestHR

FastestHR is a modern, production-grade, multi-tenant SaaS Human Resource Management System (HRMS) built for scalability, speed, and elegance. This professional dashboard simplifies HR operations from recruitment to payroll, all in one sleek interface.

## 🚀 Key Modules

- **Dashboard**: Centralized hub with real-time analytics and role-specific views.
- **Employee Management**: Comprehensive directory for managing profiles, departments, and designations.
- **Attendance & Leave**: Automated tracking for attendance with a streamlined leave application and approval workflow.
- **Recruitment**: Full recruitment pipeline from job posting to offer letter generation.
- **Payroll**: Automated salary calculations, payslip generation, and tax management.
- **Performance**: Goal setting, reviews, and feedback management.
- **Learning Management**: Training modules and internal knowledge base.
- **Reports**: Advanced data export (PDF/CSV) and visual insights.
- **Settings & RBAC**: Granular permission matrix for Super Admin, Company Admin, and User roles.

## 🛠 Tech Stack

FastestHR is built using a modern, performant stack:

- **Frontend**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) + [TanStack Query v5](https://tanstack.com/query/v5)
- **Backend Infrastructure**: [Supabase](https://supabase.com/) (Postgres DB, Authentication, Storage, Real-time)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Testing**: [Vitest](https://vitest.dev/) & [Playwright](https://playwright.dev/)

## 🎨 Design System

- **Indigo Primary**: A professional indigo-based aesthetic (`#4F46E5`).
- **Dark Mode**: Native support with a seamless theme toggle.
- **Responsive**: Mobile-first design that scales perfectly to desktop and tablet.
- **Typography**: Optimized with the **Inter** font family for maximum readability.

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Supabase Account](https://app.supabase.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/upmarking/fastesthr-20077824.git
   cd fastest-hr
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles the application for production.
- `npm run lint`: Perfroms linting checks using ESLint.
- `npm run test`: Runs the test suite with Vitest.
- `npm run preview`: Previews the production build locally.

---

Built with ❤️ by the FastestHR Team.
