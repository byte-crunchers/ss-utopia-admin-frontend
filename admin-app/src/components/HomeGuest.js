import React, { useEffect, useState, useContext} from "react"
import Axios from "axios"
import { withRouter } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import UtopiaLogo from '../static/Utopia Logo.png'
import StateContext from "../StateContext";
import { yupResolver } from '@hookform/resolvers/yup';
import {useForm} from "react-hook-form";
import * as Yup from 'yup';



function HomeGuest(props) {

    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    const validationSchema = Yup.object().shape({
        username : Yup.string()
            .required('Username is required'),

        password: Yup.string()
            .required('Password is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;



    async function onSubmit(data) {
        alert(JSON.stringify(data, null, 4))

        const api = 'https://34.238.82.58:8443/login'

        try {
            const response = await Axios.post(api, JSON.stringify(data, null, 4))

            if (response.headers) {
                const header = response.headers
                const token = header['authorization'];
                appDispatch({ type: "login", data: token})
                appDispatch({ type: "flashMessage", value: "You have successfully logged in." })
                localStorage.setItem("Token",token)
                props.history.push("admin/CreateCardType");
            } else {

                console.log("Incorrect username / password.")
                appDispatch({ type: "flashErrorMessages", value: "Invalid username / password." })
            }
        }catch (e) {
            if(username||password === null){
                appDispatch({ type: "flashErrorMessages", value: "username / password can't be null." })
            }
            appDispatch({ type: "flashErrorMessages", value: "Invalid username / password." })
            console.log("There was a problem.")
        }

    }

   return(
       <div className="App">
           <div className="container py-md-5">
               <div className="row align-items-center">
                   <div className="col-lg-7 py-3 py-md-5">

                       <img src={UtopiaLogo} alt="Logo" />
                   </div>
                   <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
                       <h1 className="display-3">Admin Portal</h1>
                       <form onSubmit={handleSubmit(onSubmit)}>
                           <div className="form-group">
                               <label htmlFor="username" className="text-muted mb-1">
                                   {/*<small>Username</small>*/}
                               </label>
                               <input onChange={(e) => setUsername(e.target.value)}  {...register('username')} id="username" name="username" className={`form-control ${errors.username ? 'is-invalid' : ''}`} type="text"
                                      placeholder="Username" autoComplete="off"/>
                               <div className="invalid-feedback">{errors.username?.message}</div>
                           </div>


                           <div className="form-group">
                               <label htmlFor="password" className="text-muted mb-1">
                                   {/*<small>Password</small>*/}
                               </label>
                               <input onChange={(e) => setUsername(e.target.value)}  {...register('password')} id="password" name="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} type="password"
                                      placeholder="Password" autoComplete="off"/>
                               <div className="invalid-feedback">{errors.password?.message}</div>

                           </div>
                           <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
                               Sign in
                           </button>
                       </form>
                   </div>
               </div>
           </div>
       </div>
   )
}

export default withRouter(HomeGuest)
