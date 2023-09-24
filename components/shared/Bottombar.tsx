"use client"

import { sidebarLinks } from '@/app/constants'
import { SignOutButton, SignedIn } from '@clerk/nextjs'
import Image from "next/image"
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import React from 'react'

const Bottombar = () => {

    const router = useRouter();
    const pathName = usePathname();
    return (
        <section className='bottombar'>
            <div className='bottombar_container'>
                {sidebarLinks.map((link) => {
                    const isActive = (pathName.includes(link.route) && link.route.length > 1) || pathName === link.route

                    return (

                        <Link href={link.route} key={link.label} className={`bottombar_link ${isActive && 'bg-primary-500'}`}>
                            <Image src={link.imgURL} alt={link.label} height={24} width={24} />
                            <p className="text-subtle-medium text-light-1 max-sm:hidden">{link.label.split(/\s+/)[0]}</p>
                        </Link>

                    )
                })}
            </div>
        </section>
    )
}

export default Bottombar