import React, {useContext, useEffect, useState} from "react";
import StateContext from "../StateContext";
import {useImmer} from "use-immer";
import Axios from "axios";
import HealthyIcon from '../static/healthy.png'
import UnhealthyIcon from '../static/unhealthy.png'
import LoadingIcon from '../static/loading.gif'

function Health(){
    const appState = useContext(StateContext)

    const [state, setState] = useImmer({
        authStatus: LoadingIcon,
        accountStatus: LoadingIcon,
        loanStatus: LoadingIcon,
        usersStatus: LoadingIcon,
        emailStatus: LoadingIcon
    })

    useEffect(() => {
        async function authHealth() {
            try {
                const response = await Axios.get(process.env.REACT_APP_AUTH_HEALTH_URL)
                setState(draft => { draft.authStatus = HealthyIcon; })
                console.log(response.data);
            }
            catch (e) {
                setState(draft => { draft.authStatus = UnhealthyIcon; })                
                console.log(e)
            }
        }

        async function accountHealth() {
            try {
                const response = await Axios.get(process.env.REACT_APP_ACCOUNT_HEALTH_URL)
                setState(draft => { draft.accountStatus = HealthyIcon; })
                console.log(response.data);
            }
            catch (e) {
                setState(draft => { draft.accountStatus = UnhealthyIcon; })                
                console.log(e)
            }
        }

        async function loanHealth() {
            try {
                const response = await Axios.get(process.env.REACT_APP_LOAN_HEALTH_URL)
                setState(draft => { draft.loanStatus = HealthyIcon; })
                console.log(response.data);
            }
            catch (e) {
                setState(draft => { draft.loanStatus = UnhealthyIcon; })                
                console.log(e)
            }
        }

        async function usersHealth() {
            try {
                const response = await Axios.get(process.env.REACT_APP_USERS_HEALTH_URL)
                setState(draft => { draft.usersStatus = HealthyIcon; })
                console.log(response.data);
            }
            catch (e) {
                setState(draft => { draft.usersStatus = UnhealthyIcon; })                
                console.log(e)
            }
        }

        async function emailHealth() {
            try {
                const response = await Axios.get(process.env.REACT_APP_EMAIL_HEALTH_URL)
                setState(draft => { draft.emailStatus = HealthyIcon; })
                console.log(response.data);
            }
            catch (e) {
                setState(draft => { draft.emailStatus = UnhealthyIcon; })                
                console.log(e)
            }
        }

        authHealth();
        accountHealth();
        loanHealth();
        usersHealth();
        emailHealth();
    },[])

    return(
        <div className="customPadding">
            <h1>Health Checks</h1>

            <br /><br />
            <center>
            <table>
                <tbody>
                <tr>
                    <th colSpan="2"><h2>Microservices</h2></th>
                </tr>
                <tr>
                    <td className="healthCell">
                        <a target="_blank" href={process.env.REACT_APP_AUTH_HEALTH_URL}>Auth Service</a>
                    </td>
                    <td className="healthCell">
                        <img className="healthIcon" src={state.authStatus} /><br />
                    </td>
                </tr>
                <tr>
                    <td className="healthCell">
                        <a target="_blank" href={process.env.REACT_APP_ACCOUNT_HEALTH_URL}>Account Service</a>
                    </td>
                    <td className="healthCell">
                        <img className="healthIcon" src={state.accountStatus} /><br />
                    </td>
                </tr>
                <tr>
                    <td className="healthCell">
                        <a target="_blank" href={process.env.REACT_APP_LOAN_HEALTH_URL}>Loan Service</a>
                    </td>
                    <td className="healthCell">
                        <img className="healthIcon" src={state.loanStatus} /><br />
                    </td>
                </tr>
                <tr>
                    <td className="healthCell">
                        <a target="_blank" href={process.env.REACT_APP_USERS_HEALTH_URL}>Users Service</a>
                    </td>
                    <td className="healthCell">
                        <img className="healthIcon" src={state.usersStatus} /><br />
                    </td>
                </tr>
                <tr>
                    <td className="healthCell">
                        <a target="_blank" href={process.env.REACT_APP_EMAIL_HEALTH_URL}>Email Service</a>
                    </td>
                    <td className="healthCell">
                        <img className="healthIcon" src={state.emailStatus} /><br />
                    </td>
                </tr>
            </tbody></table>
            </center>
            <br /><br /><br />

        </div>
    )



}

export default Health
