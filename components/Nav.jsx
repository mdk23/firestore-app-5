import Link from 'next/link'
import React from 'react'

import { auth } from '../utils/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import Image from 'next/image'

export default function Nav() {

  const [user,loading]= useAuthState(auth);
  const imgUrl =async()=>await user.photoURL;
  //console.log(user);

  return (
    <nav className='flex justify-between items-center py-10'>
      <Link href='/'>
          <button className='text-lg font-medium'>Creative Minds </button>
      </Link>
        
        <ul className='flex items-center gap-10'>
          {!user && (
            <Link className='py-2 px-4 text-sm bg-cyan-600 text-white rounded-lg font-medium ml-8' href={'/auth/login'}>
              Join Now
            </Link>
          )}
 
           {user &&(
              <div className='flex items-center gap-6'>
                <Link href='/posts'>
                  <button className='font-medium bg-cyan-600 text-white py-2 px-4 rounded-lg'>Post </button>
                </Link>
                
                <Link href='/dashboard'>
                    {/*<img src={user.photoURL}  alt="Profile Picture" referrerPolicy='no-referrer' 
                    className='w-12 rounded-full cursor-pointer'/>*/}

                    <picture className='flex rounded-full p-3 border-2 border-slate-200'>
                      <img src={user.photoURL} alt="Landscape picture" width={60} height={30} referrerPolicy='no-referrer'  />
                    </picture>

                </Link>
              </div>
           )} 
        </ul>

    </nav>
  )
}

