import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    const { user, setUser, setShowUserLogin } = useAppContext()

    const logout = async () => {
        setUser(null)
        window.location.href = '/'
    }

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative">
            {/* Logo */}
            <NavLink to="/">
                <img className="h-9" src={assets.logo} alt="logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex justify-between items-center flex-grow ml-10">
                {/* Links */}
                <div className="flex items-center space-x-6">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/products">Products</NavLink>
                    <NavLink to="/about">About Us</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                </div>

                {/* Search Bar */}
                <div className="hidden lg:flex items-center border border-gray-300 rounded-full px-3 py-1 ml-6 w-[250px]">
                    <input
                        className="flex-grow bg-transparent outline-none placeholder-gray-500 text-sm"
                        type="text"
                        placeholder="Search products"
                    />
                    <img src={assets.search_icon} alt="search" className="w-4 h-4" />
                </div>

                {/* Cart + Login */}
                <div className="flex items-center space-x-4 ml-6">
                    <NavLink to="/cart">
                        <div className="relative cursor-pointer">
                            <img src={assets.nav_cart_icon} alt="cart" className="w-6 opacity-80" />
                            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary-500 w-[18px] h-[18px] rounded-full">
                                {useAppContext().cart.length || 0}
                            </button>
                        </div>
                    </NavLink>

                    {!user ? (
                        <NavLink to="/login">
                            <button
                                className="cursor-pointer px-6 py-2 bg-primary-500 hover:bg-primary-dull transition text-white rounded-full text-sm"
                            >
                                Login
                            </button>
                        </NavLink>
                    ) : (
                        <div className="relative group">
                            <img src={assets.profile_icon} className="w-10 cursor-pointer" alt="profile" />
                            <ul className="absolute hidden group-hover:block top-12 right-0 bg-white shadow-md rounded-md text-sm z-50 w-48">
                                <li className="border-b border-gray-100">
                                    <div className="px-4 py-2 font-medium text-gray-800">{user.name}</div>
                                </li>
                                <li>
                                    <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-100">My Orders</NavLink>
                                </li>
                                <li>
                                    <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setOpen(!open)} aria-label="Menu" className="sm:hidden">
                <img src={assets.menu_icon} alt="menu" />
            </button>

            {/* Mobile Menu */}
            {open && (
                <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col gap-2 px-5 text-sm flex sm:hidden z-50">
                    <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
                    <NavLink to="/products" onClick={() => setOpen(false)}>All Product</NavLink>
                    <NavLink to="/about" onClick={() => setOpen(false)}>About Us</NavLink>
                    <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
                    <NavLink to="/cart" onClick={() => setOpen(false)}>Cart</NavLink>
                    {user && <NavLink to="/profile" onClick={() => setOpen(false)}>My Profile</NavLink>}
                    {user && <NavLink to="/profile" onClick={() => setOpen(false)}>My Orders</NavLink>}

                    {!user ? (
                        <NavLink to="/login">
                            <button
                                onClick={() => setOpen(false)}
                                className="cursor-pointer px-6 py-2 mt-2 bg-primary-500 hover:bg-primary-dull transition text-white rounded-full text-sm"
                            >
                                Login
                            </button>
                        </NavLink>
                    ) : (
                        <button
                            onClick={logout}
                            className="cursor-pointer px-6 py-2 mt-2 bg-primary-500 hover:bg-primary-dull transition text-white rounded-full text-sm"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Navbar
