import './App.css';
import {Route, Routes}  from "react-router-dom";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import SignUpPage from './pages/SignUpPage';
import { UserContextProvider } from './UserContext';
import axios from 'axios';
import PlacesPage from './pages/PlacesPage';
import PlacesFormPage from './pages/PlacesFormPage';
import ProfilePage from './pages/ProfilePage';
import PlacePage from './pages/PlacePage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPage';

axios.defaults.baseURL = "https://travel-nest-xk58.onrender.com";

function App() {
  console.log("Email: "+ localStorage.getItem('email'));
  return (

    <UserContextProvider>
      <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={< IndexPage />}/>
        <Route path='/login' element={< LoginPage />}/>
        <Route path='/signup' element={< SignUpPage />}/>
        <Route path='/account' element={< ProfilePage />}/>
        <Route path='/account/places' element={< PlacesPage />}/>
        <Route path='/account/places/new' element={< PlacesFormPage />}/>
        <Route path='/account/places/:id' element={< PlacesFormPage />}/>
        <Route path='/place/:id' element={< PlacePage />}/>
        <Route path='/account/bookings' element={< BookingsPage />}/>
        <Route path='/account/bookings/:id' element={< BookingPage />}/>
      </Route>
      
    </Routes>
    </UserContextProvider>
    

    
  );
}

export default App;
