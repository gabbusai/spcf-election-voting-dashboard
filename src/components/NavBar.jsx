import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../utils/AuthContext';
import { logoutUser } from '../utils/api'; // Adjust this import

function NavBar() {
    const { user, token, setUser, setToken } = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const links = [
        { name: 'Home', path: '/' },
        { name: 'Create', path: '/create' },
    ];

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

    // Add login/register links only if no user is logged in
    if (!user || Object.keys(user).length === 0) {
        links.push(
            { name: 'Login', path: '/login' },
            //{ name: 'Register', path: '/register' }
        );
    } else {
        // If user is logged in, add a logout link
        links.push({ name: 'Logout', path: '/logout', onClick: handleLogout });
    }
    
    if(loading){
        return <div>Loading...</div>;
    }

    return (
        <div className='w-screen h-32 bg-zinc-950 flex items-center'>
            {links.map((item) => (
                <Link 
                    key={item.name}
                    to={item.path}
                    className="w-32 text-center text-white"
                    onClick={item.onClick ? item.onClick : undefined} // Add the onClick for logout
                >
                    {item.name}
                </Link>
            ))}
        </div>
    );
}

export default NavBar;
