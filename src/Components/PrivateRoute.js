import React, { useContext } from 'react'
import { Route,Navigate} from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import { Redirect } from 'react-router'
// learning private route: https://jasonwatmore.com/post/2022/06/24/react-router-6-private-route-component-to-restrict-access-to-protected-pages#:~:text=The%20react%20private%20route%20component,in%20the%20location%20state%20property.
export default function PrivateRoute({children}){
    const {user} = useContext(AuthContext)
    // return (
    //     <Route {...rest} render={props=>{
    //         return user?<Component {...props}/>: <Redirect to="login"/>
    //     }}/>
    // )
    if(!user){
        return <Navigate to="/login" />
    }

    return children;
}