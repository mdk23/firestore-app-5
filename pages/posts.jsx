
import React, { useEffect,useState } from 'react'
import { auth, db } from '../utils/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import {toast} from 'react-toastify'

function Posts() {
    
    const [post,setPost]= useState({description:''})
    const [user,loading]=useAuthState(auth);
    const router=useRouter();

    const routeData=router.query;
    console.log(routeData);

    //Submit Post
    const submit_Post=async(e)=>{
        e.preventDefault();
       
        if(!post.description){
            toast.error('Description Field Empty 😡',{theme:"dark" });
            return;
         }

         if(post.description.length>300){
            toast.error('Description too Long 🤬',{theme:"dark" });
            return;
         }

         if(post.hasOwnProperty('id')){
            const docRef=doc(db,'posts',post.id);
            const updatedPost={...post,timestamp:serverTimestamp()}
            await updateDoc(docRef,updatedPost);
            return router.push('/');
         }
         else
         {
            // Make a new post
            const collectionRef=collection(db,'posts');
            await addDoc(collectionRef,
                 {...post,
                    timestamp:serverTimestamp(),
                    user:user.uid,
                    avatar:user.photoURL,
                    username:user.displayName
                })
            setPost({description:''});
            toast.success('Post Created 😊',{theme:"dark" });
            return router.push('/');
         }

        }

    //Check User
    const checkUser=async()=>{
        if(loading){return}
        if(!user){return router.push('/auth/login');}
        if(routeData.id){
            setPost({
                description:routeData.description,
                id: routeData.id
            })
        }
    };

    useEffect(()=>{
        checkUser();
    },[user,loading])


    return (
        <div className='my-20 p-12 shadow-2xl rounded-lg max-w-lg mx-auto'>
             
            <form onSubmit={(e)=>submit_Post(e)}> 
                
                <h1 className='text-2xl font-bold '>
                    {post.hasOwnProperty('id')?  'Edit your Post': 'Create a new Post'}</h1>
                <div className='py-2 '>
                    <h3 className='text-lg font-medium py-2'>Description</h3>
                    <textarea className='bg-gray-800 h-52 w-full text-white rounded-lg p-4'
                     value={post.description} onChange={(e)=>setPost({...post,description:e.target.value})}   
                    /> 
                    <p className={`text-cyan-600 font-medium ${post.description.length>300 ? 'text-red-600': ''}`}>
                        {post.description.length}/300
                    </p>
                </div>
                <button
                 type='submit'
                 className='w-full bg-cyan-700 p-2 text-white font-medium my-2 rounded-lg'>Submit </button>
            </form>
        </div>
  )
}

export default Posts