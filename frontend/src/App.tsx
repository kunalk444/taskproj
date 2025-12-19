import './App.css'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import Signup from './components/Signup';
import {  Route, Routes } from 'react-router-dom';
import OTPVerification from './components/OtpVerification';
import Login from './components/Login';
import Home from './Home';
import Dashboard from './Dashboard';
import { useState } from 'react';

const queryClient = new QueryClient();

function App() {
  const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false);
  return (
      <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/' element={<Home isLoggedIn = {isLoggedIn} setLoggedIn={()=>setIsLoggedIn(true)}/>}></Route>
          <Route path = "/verifyotp" element={<OTPVerification isLoggedIn = {isLoggedIn} setLoggedIn={()=>setIsLoggedIn(true)}/>}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </QueryClientProvider>
    </>
  )
}

export default App
