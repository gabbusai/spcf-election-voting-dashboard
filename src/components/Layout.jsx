import React, { useEffect } from 'react';
import NavBar from './NavBar';
import { Outlet, useNavigate } from 'react-router-dom'; // Import Outlet
import { Toaster } from 'react-hot-toast';
import { AuthContext, useAuthContext } from '../utils/AuthContext';
import SideNav from './SideNav';

function MainLayout() {
  const {token, user} = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    if(!token || !user){
      console.log('not logged in')
      navigate('/login')
    }
  })
  return (
    <div className='relative w-screen flex bg-indigo-50 '>
      <div className="sticky top-0">
      <Toaster/>
      <SideNav />
      </div>
      <div className="w-full">
        <Outlet />
      </div> 
    </div>
  );
}

export default MainLayout;