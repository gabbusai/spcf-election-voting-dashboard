import React, { useState } from 'react'
import TitleSection from './TitleSection';
import { useAuthContext } from '../utils/AuthContext';
import { links } from '../utils/RouteLinks';
import OptionLink from './OptionLink';
import { FiChevronsRight } from 'react-icons/fi';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

function ToggleClose({open, setOpen}){
    return(
        <button className="absolute bottom-0 left-0 right-0 border-t
        border-slate-300 transition-colors hover-bg:slate-100"
        onClick={() => setOpen((pv) => !pv)}
        >
            <div className="flex items-center p-2">
                <div
                layout
                className="grid size-10 place-content-center text-lg">
                    <FiChevronsRight 
                    className={`transition-transform ${open && 'rotate-180'}`}/>
                </div>
                {open && <span className='text-xs font-medium'>Hide</span>}
            </div>
        </button>
    )
}

function SideNav() {
    const [open, setOpen] =useState(true);
    const { user, token, setUser, setToken } = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState('dashboard');

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logoutUser(token);  // Call your logout function
            setUser(null);            // Clear the user context
            setToken(null);           // Clear the token
            navigate('/');            // Redirect to the home page
        } catch (error) {
            console.error("Error logging out:", error.message || error);
            // Optionally display an error message to the user
        }finally{
            setLoading(false);
        }
    };


  return (
    <motion.nav className='sticky top-0 h-screen shrink-0 border-r border-slate-400
    bg-white p-2'
    layout="true"
    style={{ 
        width: open ? '225px' : 'fit-content'
     }}>
      <TitleSection open={open} user={user}/>
      <div className="space-y-1">
            {
                links.map((link, index) => (
                    <Link
                    to={link.path}
                    key={index}
                    >
                    <OptionLink
                        key={index}
                        Icon={link.icon} 
                        title={link.title} 
                        selected={selected}
                        setSelected={setSelected}
                        notifs={0}
                        routeLink={link.path}
                        open={open}
                    />
                    </Link>
                ))
            }
            <ToggleClose open={open} setOpen={setOpen}/>
        </div>
    </motion.nav>
  )
}

export default SideNav
