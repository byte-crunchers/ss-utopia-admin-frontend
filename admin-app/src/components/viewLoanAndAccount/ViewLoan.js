import React, {useContext, useEffect} from "react";
import StateContext from "../../StateContext";
import {useImmer} from "use-immer";
import Axios from "axios";
import {MDBDataTable} from "mdbreact";

function ViewLoan(){
    const appState = useContext(StateContext)
    const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${appState.jwt}`     }


    const [state, setState] = useImmer({
        isLoading: true,
        loan: []
    })

    const api = process.env.REACT_APP_VIEW_LOAN_URL;
    //  const api  = process.env
    useEffect(() =>

    {
        async function fetchLoan() {

            try {
                const response = await Axios.get(api, { headers:headers })
                setState(draft => {
                    draft.isLoading = false
                    draft.loan = response.data
                })
            }

            catch (e) {

                console.log("There was a problem or the request was cancelled.")
            }
        }

        fetchLoan()
        // return () =>  {
        //     ourRequest.cancel()
        //}
    },[])

    const data = {
        columns: [
            {
                label: "Loan ID",
                field: "id",
                sort: "asc",
                width: 100,
            },

            {
                label: "Loan Type",
                field: "loanType",
                sort: "asc",
                width: 100,
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
                label: "Monthly Payment",
                field: "monthly_payment",
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
                label: "Interest Rate",
                field: "interest_rate",
                sort: "asc",
                width: 100,
            },

            {
                label: "Late Fee",
                field: "late_fee",
                sort: "asc",
                width: 100,
            },


        ],
        rows:state.loan

    };
    return(
        <div>
            <h1 className="text-mid-left">Loans Information</h1>

            <br/> <br/>

            <MDBDataTable striped
                          bordered
                          hover data={data} />

        </div>
    )


}

export default ViewLoan
