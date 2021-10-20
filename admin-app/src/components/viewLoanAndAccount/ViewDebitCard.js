import React, {useContext, useEffect} from "react";
import StateContext from "../../StateContext";
import {useImmer} from "use-immer";
import Axios from "axios";
import {MDBDataTable} from "mdbreact";

function ViewDebitCard(){
    const appState = useContext(StateContext)
    const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${appState.jwt}`     }


    const [state, setState] = useImmer({
        isLoading: true,
        card: []
    })
    const api = process.env.REACT_APP_VIEW_DEBITCARD_URL;

    useEffect(() =>
        //  const ourRequest = Axios.CancelToken.source()
//,cancelToken: ourRequest.token
    {
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
        //     ourRequest.cancel()
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
                label: "PIN",
                field: "pin",
                sort: "asc",
                width: 100,
            },

            {
                label: "Annual Fee",
                field: "annual_fee",
                sort: "asc",
                width: 100,
            },

            {
                label: "Saving Interest",
                field: "saving_interest",
                sort: "asc",
                width: 100,
            },

            {
                label: "Expires date",
                field: "exp_date",
                sort: "asc",
                width: 150,
            },

        ],
        rows:state.card

    };

    return(
        <div>
            <h1 className="text-mid-left">Debit Cards Information</h1>

            <br/> <br/>

            <MDBDataTable  striped
                           bordered
                           hover data={data} />
        </div>
    )



}

export default ViewDebitCard
