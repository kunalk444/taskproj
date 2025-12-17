import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom';


function Home() {
    const{data:user,isLoading,isError}=useQuery({
        queryKey:["me"],
        queryFn:async()=>{
            const res = await fetch("http://localhost:5000/auth/verifyuser",{
                credentials:'include'
            })
            if(!res.ok)throw new Error("not authenticated!");
            console.log(user);
            return  res.json();
        },
        retry:false
    });
    if (isLoading) return <h2>Loading...</h2>;
    if (user) return <Navigate to="/dashboard" replace />;
    if (isError) return <Navigate to="/signup" replace />;
    return null;    
}

export default Home