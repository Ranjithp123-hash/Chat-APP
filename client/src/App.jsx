
import { BrowserRouter, Navigate, Routes,Route } from "react-router-dom"
import Auth from "./pages/auth"
import Chat from "./pages/chat"
import Profile from "./pages/profile"
import { useAppStore } from "./store"
import { useEffect, useState } from "react"
import { GET_USER_INFO } from "./utils/constants"
import { apiClient } from "./lib/api-client"

import PropagateLoader from "react-spinners/PropagateLoader";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};


const PrivateRoute = ({ children }) => {
    const {userInfo} = useAppStore();
    const isAuthenticated = !!userInfo;
    return isAuthenticated ? children : <Navigate to="/auth"/>;
}

const AuthRoute = ({ children }) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat"/> : children ;
}

function App() {
  const {userInfo,setUserInfo} = useAppStore();
  const [loading,setLoading] = useState(true);
  

  useEffect(() => {
    const getUserData = async() => {
 
      try {

  
        const response = await apiClient.get(GET_USER_INFO,
          {
            withCredentials: true,
          });
          setInterval()
          if (response.status === 200 && response.data.id){
            setUserInfo(response.data);
          }else {
            setUserInfo(undefined);
          } 
          // console.log({response})
      } catch (error) {
        console.log(error)
        setUserInfo(undefined);
      } finally {
        const loaderDelay = 2000; 
        setTimeout(() => {
          setLoading(false);
        }, loaderDelay);
      }
    }
    if(!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  },[userInfo,setUserInfo])

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center ">
        <div>
     
      <PropagateLoader
        color="blue"
        loading={loading}
        cssOverride={override}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      </div>
    </div>
    )
     
  }

  return (
     <BrowserRouter>
     <Routes>
      <Route path="/auth" element={ 
        <AuthRoute>
               <Auth/>
        </AuthRoute>
        } />
      <Route path="/chat" element={
        <PrivateRoute>
          <Chat/>
        </PrivateRoute>
      }/>
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile/>
        </PrivateRoute>
      }/>
     
      <Route  path="*" element={<Navigate to="/auth" />} />
     </Routes>
     
     </BrowserRouter>
  )
}

export default App
