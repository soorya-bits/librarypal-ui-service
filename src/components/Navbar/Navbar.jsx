import React from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { MdOutlineSegment } from 'react-icons/md'
import { useState, useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import config from '../../config'

const Navbar = () => {
    const USER_SERVICE_API_URL = config.USER_SERVICE_API_URL
    const { logout } = useAuth0()
    const navigate = useNavigate()
    const [showMenu, setShowMenu] = useState(false);
    const links = [
        {
            title: 'Home',
            link: '/',
        },
        {
            title: 'Books',
            link: '/books',
        },
        {
            title: 'About',
            link: '/about-us',
        },
       
    ]

    const [User, setUser] = useState({})
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [MobileNav, setMobileNav] = useState('hidden')   

    const handleLogout = () => {
        localStorage.removeItem('token')
        logout({ returnTo: window.location.origin }) 
        setIsLoggedIn(false)
    }

    const getUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('id'); // Assuming you store user ID after login
            const response = await axios.get(`${USER_SERVICE_API_URL}/get-user-info`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    id: userId
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
            // Optionally handle auth errors (401/404) here
        }
    }

    useEffect(() => {
        // Check if token exists in localStorage 
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            getUser();
        }
    }, [])

    return (
     <>
        <nav className='z-25 relative flex bg-zinc-600 text-white px-8 py-2  items-center justify-between'>
            <div className='flex items-center'>
                <h1 className='text-3xl font-serif'> LibraryPal</h1>
            </div>

        <div className='nav-links-bookexchange block md:flex align-items-center gap-4'>
            <div className='hidden md:flex gap-4'>
                {
                    links.map((items, i) => (
                        <Link to ={items.link} 
                            className='no-underline text-white hover:text-blue-200 transition-all duration-300 text-lg font-medium font-serif'
                            key={i}>
                            {items.title} 
                        </Link>
                    ))
                }
            <div>
        {
        isLoggedIn ? (
                    <>
                    <div className='nav-links-bookexchange block md:flex align-items-center gap-4'>
                        <Link to='/lend-books'
                            className='no-underline text-white hover:text-blue-200 transition-all duration-300 text-lg font-medium font-serif'
                        >
                            Lend Books
                        </Link>
                        <div 
                            style={{ position: 'relative', display: 'inline-block' }}
                        >
                            <p
                                className="no-underline text-white hover:text-blue-200 transition-all duration-300 text-lg font-medium font-serif flex items-center gap-2"
                                onClick={() => setShowMenu(!showMenu)} 
                                style={{ cursor: 'pointer', margin: 0 }}
                            >
                                <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4H1m3 4H1m3 4H1m3 4H1m6.071.286a3.429 3.429 0 1 1 6.858 0M4 1h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Zm9 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"></path>
                                </svg>
                                { User.username }
                            </p>
                            {showMenu && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0, 
                                    background: '#fff',
                                    border: '1px solid #ccc',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    zIndex: 1,
                                    display: 'flex',
                                    flexDirection: 'row-reverse',
                                    gap: '10px'
                                }}>
                                    <button 
                                        type="button" 
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                    >
                                        Logout
                                        <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                                        </svg>
                                    </button>

                                </div>
                            )}
                            </div>

                    </div>
                    </>
                ) : (
                    <div className='hidden md:flex gap-4'>
                        <Link 
                        to='/Login' 
                        className='no-underline text-white hover:text-blue-200 transition-all duration-300 text-lg font-medium font-serif'>
                            Login
                        </Link>
                    </div> 
                )}
                </div>
                </div>
            
      
        <button className='text-white text-2xl hover:text-zinc-400' onClick={()=> (MobileNav === 'hidden' ? setMobileNav('block') : setMobileNav('hidden'))}><MdOutlineSegment /></button>
        </div>
        </nav>
        <div 
            className ={`${MobileNav} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center`}>
            {links.map((items, i) => (
                    <Link to ={items.link} 
                        className={`${MobileNav} text-white text-3xl font-semibold mb-8 hover:text-blue-500 transition-all duration-300`}
                        key={i}
                        onClick={()=> (MobileNav === 'hidden' ? setMobileNav('block') : setMobileNav('hidden'))}>
                        {items.title} {" "}
                    </Link>
             ))}
            <Link 
            to='/Login' 
            className={`${MobileNav} px-2 py-2 border text-3xl border-blue-500 rounded text-white  hover:bg-white hover:text-zinc-800 transition-all duration-300`}>
                Login
            </Link> 
        </div>
    </>
  )
}

export default Navbar