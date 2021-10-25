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
            .required('Username is required')
            .min(3, 'username must at least contains three characters !')
            .max(20, 'Card Name must at most contains twenty characters !')
            .test('alphabets', 'Card Name must only contain alphabets !', (value) => {
                return /^[a-zA-Z0-9 ]+$/.test(value);
            }),

        password: Yup.string()
            .required('Password is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;



    async function onSubmit(data) {


        const api = process.env.REACT_APP_LOGGIN_AUTH_URL;

        // alert(api)
        let user = JSON.stringify({ 
            "username": `${data.username}`, 
            "password":`${data.password}`,
            "portal": 'admin'
        }, null, 4)

        try {
            const response = await Axios.post(api, user)

            if (response.headers) {
                const header = response.headers
                const token = header['authorization'];
                appDispatch({ type: "login", data: token})
                appDispatch({ type: "flashMessage", value: "You have successfully logged in." })
                // alert(token)
                console.log(response)
                console.log(appState.jwt)

                // localStorage.setItem("Token",token)
                props.history.push("admin/home");
            }
        }catch (e) {
            if(e.toString()==='Error: Request failed with status code 401')
            appDispatch({ type: "flashErrorMessages", value: `Username / Password is invalid.` })
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
                               <input onChange={(e) => setPassword(e.target.value)}  {...register('password')} id="password" name="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} type="password"
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
