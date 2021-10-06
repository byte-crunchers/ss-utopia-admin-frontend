import React, {useContext, useEffect, useState} from "react";
import {MDBDataTable} from "mdbreact";
import Axios from "axios";

import DispatchContext from "../../DispatchContext";
import StateContext from "../../StateContext";
import NotFound from "../NotFound";
import {useImmer} from "use-immer";
import LoadingDotsIcon from "../LoadingDotsIcon";
import Page from "../Page";


function ViewCreditCard(){
    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)
    const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${appState.jwt}`   }


    const [state, setState] = useImmer({
        isLoading: true,
        card: []
    })
    const api = process.env.REACT_APP_VIEW_CREDITCARD_URL;

    useEffect(() => {
        //  const ourRequest = Axios.CancelToken.source()
 //,cancelToken: ourRequest.token
        async function fetchCard() {

            try {
                const response = await Axios.get(api, { headers:headers })
                setState(draft => {
                    draft.isLoading = false
                    draft.card = response.data
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


    // if (!state.isLoading && !state.card) {
    //     return <NotFound />
    // }


    // if (state.isLoading)
    //    return (
    //
    //  <LoadingDotsIcon />
    //
    // )




    const data = {
        columns: [
            {
                label: "Card ID",
                field: "id",
                sort: "asc",
                width: 150,
            },

            {
                label: "Card Number",
                field: "card_num",
                sort: "asc",
                width: 270,
            },

            {
                label: "Name",
                field: "fullName",
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
                label: "Payment Due",
                field: "payment_due",
                sort: "asc",
                width: 150,
            },

            {
                label: "Due Date",
                field: "due_date",
                sort: "asc",
                width: 150,
            },

            {
                label: "Expires date",
                field: "exp_date",
                sort: "asc",
                width: 150,
            },
            {
                label: "Credit Limit",
                field: "limit",
                sort: "asc",
                width: 100,
            },
            {
                label: "CVC1",
                field: "cvc1",
                sort: "asc",
                width: 100,
            },
            {
                label: "CVC2",
                field: "cvc2",
                sort: "asc",
                width: 100,
            },
        ],
        rows:state.card

    };

    return(
        <div>
            <h1>Credit Cards Information</h1>

            <br/> <br/>

            <MDBDataTable striped bordered small data={data} />
        </div>
    )


}

export default ViewCreditCard
