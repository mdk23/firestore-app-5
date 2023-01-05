import React, { useEffect,useState } from 'react'
import {useAuthState} from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { auth,db } from '../utils/firebase'
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import Message from '../components/Message'
import {BsTrash2Fill} from 'react-icons/bs';
import {AiFillEdit} from 'react-icons/ai'
import Link from 'next/link';


function Dashboard() {
  const route =useRouter();
  const [user,loading]=useAuthState(auth);

  const [allPosts,setAllPosts]=useState([]);   
  const collectionRef=collection(db,'posts');
  

  // Check user Logged In
  const getData=async()=>{
    if(loading) return;
    if(!user){return route.push('/auth/login');}

    const q=query(collectionRef, where('user','==',user.uid), orderBy('timestamp','desc'));
    
      onSnapshot(q,snapshot=>{
        setAllPosts(
          snapshot.docs.map(doc=>({
            id:doc.id,
            ...doc.data()
          }))
        )
    });
  }
  
  const deletePost=async(id)=>{
    await deleteDoc( doc(db,'posts',id) )
  }
  
  useEffect(()=>{
      getData();
  },[user,loading])
  
  
  //console.log(allPosts);

  return (
    <div>
        <h1> Your Posts </h1>
        <div> 
            {
              allPosts.map(post=>(
                <Message {...post} key={post.id}>
                  <div className='flex gap-4'>
                    <button className='flex items-center justify-center gap-2 py-2  text-pink-700 ' onClick={()=>deletePost(post.id)}>
                        <BsTrash2Fill className='text-2xl'/> Delete
                    </button>
                    
                    <Link href={{pathname:'/posts', query:post}}>
                    <button className='flex items-center justify-center gap-2 py-2 text-teal-700'>
                        <AiFillEdit className='text-2xl'/> Edit 
                    </button>
                    </Link>
                  </div>
                
                </Message>
              ))
            }
        </div>
          <button onClick={()=>auth.signOut()} className='font-medium text-white bg-gray-700 py-3 px-4 my-6 rounded-lg'>
            Sign Out 
          </button>
    </div>
  )
}

export default Dashboard