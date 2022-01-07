import React, {useContext, useEffect, useState} from "react";
import { MDBDataTable } from "mdbreact";
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";
import {useImmer} from "use-immer";
import Axios from "axios";
import Modal from "react-bootstrap/Modal";
import { Link } from 'react-router-dom'

function ViewAccount(){
    const appState = useContext(StateContext)
    const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${appState.jwt}`     }


    const [state, setState] = useImmer({
        isLoading: true,
        showModal: false,
        selectedId: 0,
        modalText: "",
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

                    //add click event handlers
                    for(let i=0; i<draft.account.length; i++) {
                        const id = draft.account[i].id;
                        const accountName = draft.account[i].fullName + " - " + draft.account[i].account_type;
                        draft.account[i].clickEvent = () => handleClick(id, accountName);
                    }

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
    
    //open modal
    function handleClick(id, accountName) {
        console.log('Clicked account with id = ' + id);
        console.log("Show modal.");
        setState(draft => {
            draft.showModal = true;
            draft.selectedId = id;
            draft.modalText = accountName;
        });

    }

    //close modal
    const hideModal = () => {
        console.log("Hide modal.");
        setState(draft => {
            draft.showModal = false;
        });
    };

    return(
        <div>
            <h1 className="text-mid-left">Account Management</h1>

            <br/> <br/>
            <MDBDataTable striped bordered hover data={data} />

            <Modal show={state.showModal} onHide={hideModal}>
                <Modal.Header><h3>{state.modalText}</h3></Modal.Header>
                <Modal.Body>
                    <Link to={'/admin/EditAccount/?id=' + state.selectedId}>
                        <button className="btn btn-primary mr-1">Edit Account</button>
                    </Link>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary mr-1" onClick={hideModal}>Close</button>
                </Modal.Footer>
            </Modal>     

        </div>
    )

}

export default ViewAccount
