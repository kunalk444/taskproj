import Createtask from './components/Createtask';
import Navbar from './Navbar'
import { useState } from 'react';

function Dashboard(){
  const [createTask,setCreateTask] = useState<boolean>(false);
  return (
        <>
            <Navbar startShow={()=>setCreateTask(true)}/>
            {createTask && <Createtask stopShow = {()=>{setCreateTask(false)}} />}

        </>    
  )
}

export default Dashboard