import React, { useEffect, useState } from 'react'
import Message from '../components/Message'
import { auth, db } from '../utils/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import {toast} from 'react-toastify'
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';

function Details() {
    
    const [user,loading]=useAuthState(auth);
    const router=useRouter();
    const routerData=router.query;  
    
    const [message,setMessage]=useState('')
    const [allmessages,setAllMessages]=useState([])

    const submitMessage=async (e)=>{
        e.preventDefault();

        //if(!user){return router.push('/auth/login');}
        if(!auth.currentUser){return router.push('/auth/login');}

        if(!message){
            toast.error('Message is Empty 😡',{theme:"dark" });
            return;
         }

         const docRef=doc(db,'posts',routerData.id); //documente reference in FireStore
         await updateDoc(docRef,{
            comments: arrayUnion({
              message,
              avatar:auth.currentUser.photoURL,
              userName:auth.currentUser.displayName,
              time:Timestamp.now(),  
            })
         });

         setMessage(" ");
    };


    const getComments=async()=>{
        const docRef=doc(db,'posts',routerData.id);
        const docSnap=await onSnapshot(docRef,(snapshot)=>{
            setAllMessages(snapshot.data().comments);
        })

        
    };

     useEffect(()=>{
        if(!router.isReady) return;
        getComments();
     },[router.isReady])   

    return (
    <div>

        <Message {...routerData}></Message>
        <div className='my-4'>
            
            <div className='flex gap-2'>
                <input className='bg-gray-800 w-full p-2 text-white rounded-lg' type='text' 
                placeholder='Send a message 🤔'  value={message}
                onChange={(e)=>setMessage(e.target.value)}/>
                <button className='bg-cyan-700 py-2 px-4 text-white  rounded-lg' onClick={(e)=>submitMessage(e)}> Submit</button>
            </div>

            <div className='py-6'>
                <h2 className='font-bold'>Comments</h2>
                {
                    allmessages?.map( (message,i)=>(
                            <div className='bg-white p-4 my-4 border-2' key={i}>
                                <div className='flex items-center gap-2 mb-4'>
                                    <img className='w-10 rounded-full' src={message.avatar} alt=''/>
                                    <h2> {message.userName}</h2>
                                </div>
                                <h2>{message.message}</h2>
                            </div>
                    )
                    )
                }     
            </div>

        </div>

    </div>
    
  )
}

export default Details