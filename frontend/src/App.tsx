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

const queryClient = new QueryClient();

function App() {

  return (
      <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path = "/verifyotp" element={<OTPVerification />}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </QueryClientProvider>
    </>
  )
}

export default App
