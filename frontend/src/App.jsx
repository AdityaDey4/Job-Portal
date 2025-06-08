import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from "./components/admin/CompanyCreate.jsx"
import CompanySetup from './components/admin/CompanySetup.jsx'
import AdminJobs from './components/admin/AdminJobs.jsx'
import PostJob from './components/admin/PostJob.jsx'
import Applicant from './components/admin/Applicant.jsx'
import ProtectedRoute from './components/admin/ProtectedRoute.jsx'
import SavedJobs from './components/SavedJobs.jsx'
import EditJob from './components/admin/EditJob.jsx'
import ForgetPassword from './components/auth/ForgetPassword.jsx'
import ChangePassword from './components/auth/ChangePassword.jsx'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  { 
    path : "/forgetPassword",
    element : <ForgetPassword />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <ProtectedRoute allowedRoles={["student"]}><Profile /></ProtectedRoute>
  },
  {
    path : "/savedJobs",
    element : <ProtectedRoute allowedRoles={["student"]}><SavedJobs /></ProtectedRoute>
  },
  {
    path:"/admin/companies",
    element: <ProtectedRoute allowedRoles={["recruiter"]}><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute allowedRoles={["recruiter"]}><CompanyCreate/></ProtectedRoute>
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute allowedRoles={["recruiter"]}><CompanySetup/></ProtectedRoute>
  },
  {
    path:"/admin/jobs",
    element:<ProtectedRoute allowedRoles={["recruiter"]}><AdminJobs/></ProtectedRoute>
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute allowedRoles={["recruiter"]}><PostJob/></ProtectedRoute>
  },
  {
    path:"/admin/jobs/:id/edit",
    element:<ProtectedRoute allowedRoles={["recruiter"]}><EditJob/></ProtectedRoute>
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute allowedRoles={["recruiter"]}><Applicant/></ProtectedRoute>
  },
  { 
    path : "/changePassword",
    element : <ProtectedRoute allowedRoles={["student", "recruiter"]}><ChangePassword /></ProtectedRoute>
  },
])

function App() {

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App

