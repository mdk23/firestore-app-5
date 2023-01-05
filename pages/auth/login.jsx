import React, { useEffect } from 'react'
import {FcGoogle} from 'react-icons/fc';
import {BsPeopleFill} from 'react-icons/bs';
import {GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { useRouter } from 'next/router';
import {useAuthState} from 'react-firebase-hooks/auth';

function Login() {
    
    const route =useRouter();
    const [user,loading]= useAuthState(auth);
    
    //Sign in with Google
    const googleProvider=new GoogleAuthProvider();

    const google_Login=async()=>{
        try{
            const result= await signInWithPopup(auth,googleProvider);
            console.log(result.user);
            route.push('/');
             
        }catch(error) { console.log('Error: '+ error)}
    };

    
    useEffect(()=>{
        if(user){route.push('/')}
        else{
            console.log('Login')
        }
    },[user])

    return (
    <div className='shadow-2xl mt-32 py-10 text-gray-700 rounded-lg'>
        
        <h2 className='flex  gap-2 text-2xl font-medium m-2'>
                Join Today <BsPeopleFill className='text-2xl mt-1'/>
        </h2>
        
        <div className='py-4 m-2'>
            <h3 className='py-4'>Sign in with one of the Providers</h3>
            <button onClick={()=>google_Login()} className=' text-white bg-gray-700 w-full font-semibold rounded-lg flex align-middle p-4 gap-2' >
                <FcGoogle className='text-2xl'/> Sign in with Google 
            </button>
        </div>
        
    </div>
  )
}

export default Login