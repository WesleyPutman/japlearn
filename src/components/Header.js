'use client'

import dynamic from "next/dynamic";

const Nav = dynamic(() => import("./Nav"))

const Header = () =>{

    return (
        <header className="w-full mt-8 mb-8">
           <Nav />
        </header>
    )
}

export default Header
