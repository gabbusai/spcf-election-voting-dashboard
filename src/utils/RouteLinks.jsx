import { FaChartBar, FaPoll, FaLightbulb, FaSchool, FaUserTie, FaVoteYea } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { RiFeedbackFill } from "react-icons/ri";
export const links = [
    {   title: 'Dashboard', 
        path: '/',
        icon: <TbLayoutDashboardFilled />
    },

    {
        title: 'Elections Management', 
        path: '/elections-management', 
        subLinks: [
            { name: 'View All Elections', path: '/elections/all' },
            { name: 'Create New Election', path: '/elections/create' },
            { name: 'Election Reports', path: '/elections/reports' }
            
        ],
        icon: <FaChartBar />
    },
    { 
        title: 'Positions & Candidates', 
        path: '/positions-candidates', 
        subLinks: [
            { name: 'Manage Positions', path: '/positions-candidates/positions' },
            { name: 'View Candidates', path: '/positions-candidates/candidates' },
            { name: 'Add New Candidate', path: '/positions-candidates/add' },
            { name: 'Approve Candidates', path: '/positions-candidates/approve' }
        ],
        icon: <FaUserTie />
    },

    { 
        title: 'Campaign And Posts', 
        path: '/campaign-posts', 
        subLinks: [
            { name: 'Manage Posts', path: '/campaign-posts' },
        ],
        icon: <FaLightbulb />
    },

    { 
        title: 'Voter Management', 
        path: '/voters-management', 
        subLinks: [
            { name: 'Registered Voters', path: '/voters/all' },
            { name: 'Verify Voters', path: '/voters/verify' },
            { name: 'Bulk Upload Voters', path: '/voters/upload' },
            { name: 'Voter Participation', path: '/voters/participation' }
        ] ,
        icon: <FaVoteYea />
    },

    { 
        title: 'Departments & Roles', 
        path: '/departments-roles', 
        subLinks: [
            { name: 'Manage Departments', path: '/departments-roles/departments' },
            { name: 'User Roles', path: '/departments-roles/roles' },
            { name: 'Permission Settings', path: '/departments-roles/permissions' }
        ],
        icon: <FaSchool />
    },

    { 
        title: 'Feedbacks', 
        path: '/feedbacks', 
        subLinks: [
            { name: 'Admin Users', path: '/users/admins' },
            { name: 'Assign Roles', path: '/users/assign-roles' },
            { name: 'User Activity Logs', path: '/users/logs' },
            { name: 'User Analytics', path: '/analytics/users' },
        ],
        icon: <RiFeedbackFill />
    },
];