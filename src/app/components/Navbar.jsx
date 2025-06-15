'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FaRegSun, FaRegMoon } from "react-icons/fa";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { dark, light} from '@clerk/themes'


const Navbar = () => {
    const path = usePathname();
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <div className="navbar shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <Link href="/" className={path === '/' ? 'text-primary font-bold underline' : ''}>Home</Link>
                        </li>
                        <li>
                            <Link href="/about" className={path === '/about' ? 'text-primary font-bold underline' : ''}>About</Link>
                        </li>
                        <li>
                            <Link href="/projects" className={path === '/projects' ? 'text-primary font-bold underline' : ''}>Projects</Link>
                        </li>
                    </ul>
                </div>
                <Link href={'/'}>
                    <h1 className="text-xl">daisyUI</h1>
                </Link>
                <form className="ml-16">
                    <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </form>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link href="/" className={path === '/' ? 'text-primary font-bold underline' : ''}>Home</Link>
                    </li>
                    <li>
                        <Link href="/about" className={path === '/about' ? 'text-primary font-bold underline' : ''}>About</Link>
                    </li>
                    <li>
                        <Link href="/projects" className={path === '/projects' ? 'text-primary font-bold underline' : ''}>Projects</Link>
                    </li>
                </ul>
            </div>

            <div className="navbar-end flex items-center gap-3">
                {/* Theme toggle button */}
                <button
                    className="btn"
                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                >
                    {resolvedTheme === 'dark' ? <FaRegSun /> : <FaRegMoon />}
                </button>

                {/* Clerk Auth */}
                <SignedIn>
                    <UserButton
                        signOutRedirectUrl="/"
                        appearance={{
                            baseTheme: resolvedTheme === 'light' ? light : dark,
                        }}
                    />

                </SignedIn>

                <SignedOut>
                    <Link href={'/sign-in'}>
                    <button className='btn'>Sign In</button>
                    </Link>
                </SignedOut>
            </div>
        </div>
    );
};

export default Navbar;
