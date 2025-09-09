import Link from "next/link";

export default function Button({children, onClick, disabled = false, className="",variant="default",href,isActive = false,...props
}){
    const baseButtonStyle = "w-min rounded-2xl transition text-[16px] font-bold";
    
    const baseVariants = {
        default: "bg-white text-blue-900 hover:bg-gray-200 disabled:opacity-50 px-4 py-2",
        secondary: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 px-4 py-2",
        danger: "bg-red-500 text-white hover:bg-red-600 disabled:opacity-50",
        text: "bg-transparent text-white hover:bg-gray-600 disabled:opacity-50 text-[24px]",
    };

    const activeVariants = {
        default: "bg-blue-700",
        secondary: "bg-gray-700",
        danger: "bg-red-700",
        text: "relative flex flex-col items-center after:content-[''] after:w-1/2 after:absolute after:h-1 after:bg-red-500 after:bottom-[-6px] after:rounded-sm after:left-1/2 after:-translate-x-1/2",
    };

    const variantStyle = baseVariants[variant];
    const activeStyle = isActive ? activeVariants[variant] : "";

    const combinedClasses = `${baseButtonStyle} ${variantStyle} ${activeStyle} ${className}`;

    if(href){
        return(
            <Link href={href} className={combinedClasses} {...props}>
                {children}
            </Link>
        )
    }
        
    return <button onClick={onClick} disabled={disabled} className={combinedClasses} {...props}>{children}</button>
}