import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import MainLayout from './components/Layout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AuthContextProvider from './utils/AuthContext.jsx'
import Logout from './pages/Logout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Elections from './pages/Elections.jsx'
import PositionsCandidates from './pages/PositionsCandidates.jsx'
import Voters from './pages/Voters.jsx'
import DepartmentsRoles from './pages/Departments/DepartmentsRoles.jsx'
import Users from './pages/Users.jsx'
import ElectionsListPage from './pages/SubPages/ElectionsListPage.jsx'
import ElectionDetailsPage from './pages/SubPages/ElectionDetailsPage.jsx'
import ElectionsCreatePage from './pages/SubPages/ElectionsCreatePage.jsx'
import CampaignPage from './pages/CampaignPage.jsx'
import DepartmentsId from './pages/Departments/DepartmentsId.jsx'
import ElectionsReport from './pages/Elections/ElectionsReport.jsx'
import ElectionsResultsId from './pages/Elections/ElectionsResultsId.jsx'
import ElectionsReportsList from './pages/Elections/ElectinReportsList.jsx'
import Feedbacks from './pages/Feedbacks/Feedbacks.jsx'
import ElectionVoterStatus from './pages/Elections/ElectionVoterStatus.jsx'
const queryClient = new QueryClient({
  defaultOptions: {
      queries: {
        //refetchInterval: 1000, // Automatically refetch data every second
        retry: 5,
      },
    },
});

const router = createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage />,
    },

    {element: <MainLayout />, // Use MainLayout as the wrapper for your routes
    children: [
      { path: '/', element: <Dashboard /> },

      { path: '/elections-management', element: <Elections /> },
      {path: '/elections/all', element :<ElectionsListPage/> },
      {path: '/elections/:id', element :<ElectionDetailsPage/> },
      {path: '/elections/create', element :<ElectionsCreatePage/> },
      {path: '/elections/reports-list', element :<ElectionsReportsList/> },
      {path: '/elections/reports/:id', element :<ElectionsReport/> },
      {path: '/elections/results/:id', element :<ElectionsResultsId/> },
      {path: '/elections/voters/:id', element :<ElectionVoterStatus/> },

      { path: '/positions-candidates', element: <PositionsCandidates /> },

      { path: '/campaign-posts', element: <CampaignPage />},
      { path: '/voters-management', element: <Voters /> },

      { path: '/departments-roles', element: <DepartmentsRoles /> },
      { path: '/departments/:id', element: <DepartmentsId /> },
      
      { path: '/feedbacks', element: <Feedbacks /> },

      { path: '/logout', element: <Logout /> },
      { path: '/register', element: <Logout /> },
    ],
  }

]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  </StrictMode>,
);