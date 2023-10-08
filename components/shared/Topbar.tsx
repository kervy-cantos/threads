import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { OrganizationSwitcher, SignOutButton, SignedIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const Topbar = () => {


    return (
        <nav className='topbar'>
            <Link href="/" className='flex items-center gap-4'>
                <Image src="/assets/maritthreads.png" alt="logo" width={180} height={180} />
            </Link>

            <div className='flex items-center gap-1'>
                <div className='block md:hidden'>
                    <SignedIn>
                        <SignOutButton>
                            <div className='flex cursor-pointer'>
                                <Image src='/assets/logout.svg' alt='logout' width={24} height={24} />
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div>
                <OrganizationSwitcher

                    appearance={{
                        baseTheme: dark,
                        elements: {
                            organizationSwitcherTrigger: "py-2 px-4"
                        }

                    }}
                />
            </div>
        </nav>
    )
}

export default Topbar