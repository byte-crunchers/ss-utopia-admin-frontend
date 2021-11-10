import React, {useContext, useEffect, useState} from "react";
import { MDBDataTable } from "mdbreact";
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";
import {useImmer} from "use-immer";
import Axios from "axios";
import Modal from "react-bootstrap/Modal";
import { Link } from 'react-router-dom'

function ViewUsers(){
    const appState = useContext(StateContext)
    const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${appState.jwt}`     }


    const [state, setState] = useImmer({
        isLoading: true,
        showModal: false,
        selectedId: 0,
        modalText: "",
        users: []
    })
    const api = process.env.REACT_APP_VIEW_USERS_URL;

    useEffect(() => {
        // const ourRequest = Axios.CancelToken.source()
        //,cancelToken: ourRequest.token
        async function fetchCard() {

            try {
                const response = await Axios.get(api, { headers:headers })
                setState(draft => {
                    draft.isLoading = false;
                    draft.users = response.data;

                    //add click event handlers
                    for(let i=0; i<draft.users.length; i++) {
                        const id = draft.users[i].id;
                        const username = draft.users[i].username;
                        draft.users[i].clickEvent = () => handleClick(id, username);
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
                label: "ID",
                field: "id",
                sort: "asc",
                width: 50,
            },

            {
                label: "Username",
                field: "username",
                sort: "asc",
                width: 150,
            },
            {
                label: "Email",
                field: "email",
                sort: "asc",
                width: 150,
            },
            {
                label: "Name",
                field: "full_name",
                sort: "asc",
                width: 150,
            },

            {
                label: "Date of Birth",
                field: "dob",
                sort: "asc",
                width: 150,
            },
            {
                label: "SSN",
                field: "ssn",
                sort: "asc",
                width: 150,
            },
            {
                label: "Address",
                field: "full_address",
                sort: "asc",
                width: 150,
            },

            {
                label: "Phone",
                field: "phone_str",
                sort: "asc",
                width: 150,
            },
            {
                label: "Active",
                field: "active_str",
                sort: "asc",
                width: 50,
            },
            {
                label: "Confirmed",
                field: "confirmed_str",
                sort: "asc",
                width: 50,
            },
            {
                label: "Admin",
                field: "admin_str",
                sort: "asc",
                width: 50,
            },
        ],
        rows:state.users

    };

    //open modal
    function handleClick(id, username) {
        console.log('Clicked user with id = ' + id);
        console.log("Show modal.");
        setState(draft => {
            draft.showModal = true;
            draft.selectedId = id;
            draft.modalText = "Selected User [" + id + "] - " + username;
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
        <div className="customPadding">
            <h1>User Management</h1>

            <br/>

            <MDBDataTable hover bordered small data={data} />
            
            <Modal show={state.showModal} onHide={hideModal}>
                <Modal.Header><h3>{state.modalText}</h3></Modal.Header>
                <Modal.Body>
                    <Link to={'/admin/EditUsers/?id=' + state.selectedId}>
                        <button className="btn btn-primary mr-1">Edit Details</button>
                    </Link>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary mr-1" onClick={hideModal}>Close</button>
                </Modal.Footer>
            </Modal>     

        </div>
    )



}

export default ViewUsers
