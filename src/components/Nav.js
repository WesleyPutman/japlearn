import Link from "next/link";
import dynamic from "next/dynamic";

const Icon = dynamic(() => import("./Icon"));

const Nav = () => <nav>
    <ul className="flex justify-around items-center bg-blue-800 text-white py-4 px-7 rounded-2xl">
        <NavItem href="/*"><Icon name="home"/></NavItem>
        <NavItem href="/*"><Icon name="study"/></NavItem>
        <NavItem href="/*"><Icon name="hiragana"/></NavItem>
        <NavItem href="/*"><Icon name="profil"/></NavItem>
    </ul>
</nav>

export default Nav;

export const NavItem = ({ href, children }) => <li><Link href={href}>{children}</Link></li>