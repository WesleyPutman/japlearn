'use client'

import { defaultConfig } from 'next/dist/server/config-shared'
import Image from 'next/image'

const Logo = () => {
    return (
        <div className='relative w-12 h-12'>
            <Image src="/logo.svg" alt="Logo" layout="fill" objectFit="contain" />
        </div>
    )
}
export default Logo