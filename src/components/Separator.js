'use client'

const Separator = () =>{

    return (
        <div className="flex items-center w-3/4 my-4 gap-4 before:content-[''] before:h-[2px] before:flex-1 before:bg-white after:content-[''] after:h-[2px] after:flex-1 after:bg-white">
            <div className="w-3 h-3 rounded-full bg-white"></div>
        </div>
    )
}

export default Separator