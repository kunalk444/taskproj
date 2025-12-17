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

const queryClient = new QueryClient();

function App() {

  return (
      <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path = "/verifyotp" element={<OTPVerification />}></Route>
          <Route path='/login' element={<Login/>}></Route>
        </Routes>
      </QueryClientProvider>
    </>
  )
}

export default App
