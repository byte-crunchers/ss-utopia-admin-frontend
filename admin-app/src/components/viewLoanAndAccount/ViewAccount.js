import React, {useContext, useEffect, useState} from "react";
import { MDBDataTable } from "mdbreact";
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";
import {useImmer} from "use-immer";
import Axios from "axios";


function ViewAccount(){
    const appState = useContext(StateContext)
    const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${appState.jwt}`     }


    const [state, setState] = useImmer({
        isLoading: true,
        account: []
    })
    const api = process.env.REACT_APP_VIEW_ACCOUNT_URL;

    useEffect(() => {
        // const ourRequest = Axios.CancelToken.source()
        //,cancelToken: ourRequest.token
        async function fetchCard() {

            try {
                const response = await Axios.get(api, { headers:headers })
                setState(draft => {
                    draft.isLoading = false
                    draft.account = response.data
                })
            }

            catch (e) {

                console.log("There was a problem or the request was cancelled.")
            }
        }

        fetchCard()
        // return () =>  {
        //    ourRequest.cancel()
        //}
    },[])

    const data = {
        columns: [
            {
                label: "Account ID",
                field: "id",
                sort: "asc",
                width: 150,
            },

            {
                label: "Name",
                field: "fullName",
                sort: "asc",
                width: 150,
            },

            {
                label: "Account Type",
                field: "account_type",
                sort: "asc",
                width: 150,
            },


            {
                label: "Annual Fee",
                field: "annual_fee",
                sort: "asc",
                width: 100,
            },
            {
                label: "saving Interest",
                field: "saving_interest",
                sort: "asc",
                width: 150,
            },

            {
                label: "Balance",
                field: "balance",
                sort: "asc",
                width: 150,
            },
            {
                label: "Debt Interest",
                field: "debt_interest",
                sort: "asc",
                width: 100,
            },
        ],
        rows:state.account

    };
    return(
        <div>
            <h1>Accounts Information</h1>

            <br/> <br/>
            <MDBDataTable striped bordered small data={data} />
        </div>
    )

}

export default ViewAccount
