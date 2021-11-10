import React, { useEffect, useState, useContext } from 'react'
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import 'bootstrap/dist/css/bootstrap.css'
import DispatchContext from "../../DispatchContext"
import StateContext from "../../StateContext"
import Axios from 'axios';
import {useImmer} from "use-immer";
import * as Yup from 'yup';
import '../../App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import Modal from "react-bootstrap/Modal";
import PhoneInput from 'react-phone-input-2'
import usStates from "./usStates.json";


function EditUserDetails() {

    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)
    const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${appState.jwt}`     
    }

    const [state, setState] = useImmer({
        isLoading: true,
        user: [],
        phoneStr: "",
        showModal: false,
        modalText: "",
    })

    const api = process.env.REACT_APP_VIEW_USERS_URL;
    
    //parse querystring
    const { search } = useLocation();
    const values = queryString.parse(search);
    const userId = values.id;

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await Axios.get(api + "/" + userId, { headers:headers })
                setState(draft => {
                    draft.isLoading = false;
                    draft.user = response.data[0];

                    //load user info into form fields
                    const a = draft.user;
                    console.log('Select user: ' + a.id);
                    setValue('id', a.id);
                    setValue('username', a.username);
                    setValue('first_name', a.first_name);
                    setValue('last_name', a.last_name);
                    setValue('email', a.email);
                    setValue('street_address', a.street_address.trim());
                    setValue('city', a.city);
                    setValue('us_state', a.us_state);
                    setValue('zip', a.zip_str);
                    setValue('phone', a.phone);
                    setValue('ssn', a.ssn);
                    setValue('dob', new Date(a.dob + "T00:00:00"));
                    setValue('confirmed', a.confirmed);
                    setValue('is_admin', a.is_admin);
                    setValue('active', a.active);

                    if(a.phone.toString().length == 11)
                        draft.phoneStr = a.phone.toString();
                    else
                        draft.phoneStr = "1" + a.phone.toString();

                })

                console.log("Got user with id = " + userId);

            }
            catch (e) {
                console.log("There was a problem or the request was cancelled.");
            }
        }

        fetchUser()

    },[])

    const validationSchema = Yup.object().shape({

        id: Yup.number(),

        username: Yup.string()
            .typeError("Username is required.")
            .nullable(false)
            .transform((v, o) => o === '' ? null : v) ,

        first_name: Yup.string()
            .typeError("First name is required.")
            .nullable(false)
            .transform((v, o) => o === '' ? null : v) ,

        last_name: Yup.string()
            .typeError("Last name is required.")
            .nullable(false)
            .transform((v, o) => o === '' ? null : v) ,

        email: Yup.string()
            .typeError("Valid email is required.")
            .nullable(false)
            .transform((v, o) => o === '' ? null : v) ,

        street_address: Yup.string()
            .typeError("Valid address is required.")
            .nullable(false)
            .transform((v, o) => o === '' ? null : v) ,

        city: Yup.string()
            .typeError("Valid city is required.")
            .nullable(false)
            .transform((v, o) => o === '' ? null : v) ,

        us_state: Yup.string()
            .typeError("Valid state is required.")
            .nullable(false)
            .transform((v, o) => o === '' ? null : v) ,

        zip: Yup.number()
            .typeError("Valid zip code is required.")
            .min(0, "Number must be positive.")
            .nullable(false)
            .transform((v, o) => o === '' ? null : v) ,

        phone: Yup.number()
            .typeError("Valid phone number is required.")
            .min(0, "Number must be positive.")
            .nullable(false)
            .transform((v, o) => o === '' ? null : v) ,

        ssn: Yup.number()
            .typeError("Valid SSN is required.")
            .min(0, "Number must be positive.")
            .nullable(false)
            .transform((v, o) => o === '' ? null : v) ,

        confirmed: Yup.bool(),

        is_admin: Yup.bool(),

        active: Yup.bool()
    });
    const formOptions = { resolver: yupResolver(validationSchema) };


    const { control, register, handleSubmit, formState, setValue, getValues } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {

        console.log("Form submitted.");
        // setState(draft => {
        //     draft.showModal = false;
        // });

        if(data.id == null)
            return;

        Axios.post(api,JSON.stringify(data, null, 4),{headers:headers}).then(

            (response) => {
                if(response.status === 204){
                    appDispatch({ type: "flashMessage", value: `Congrats, you updated user # ${data.id}.`})
                    console.log("User was successfully updated.")
                }
            })
            .catch((error) => {
                if(error.toString()==='Error: Request failed with status code 500') {
                    appDispatch({ type: "flashErrorMessages", value: `Something went wrong!` })
                }
                else if(error.toString()==='Error: Request failed with status code 403') {
                    appDispatch({ type: "flashErrorMessages", value: `Authentication went wrong.` })
                }
                else if(error.toString()==='Error: Request failed with status code 422') {
                    appDispatch({ type: "flashErrorMessages", value: error.response.data })
                }
            })
    }

    //open confirmation modal
    function openModal() {
        console.log("Show modal.");
        setState(draft => {
            draft.showModal = true;
            draft.modalText = "Username: " + getValues('username') + "\n";
            draft.modalText += "Name: " + getValues('first_name') + " " + getValues('last_name') + "\n";
            draft.modalText += "Email: " + getValues('email') + "\n";
            draft.modalText += "Address: " + getValues('street_address') + ", " + getValues('city') + ", " + getValues('us_state') + " " + getValues('zip') + "\n";
            draft.modalText += "Phone: " + getValues('phone') + "\n";
            draft.modalText += "SSN: " + getValues('ssn') + "\n";
            draft.modalText += "Date of Birth: " + new Date(getValues('dob')).toLocaleDateString("en-US") + "\n";
            draft.modalText += "Administrator: " + getValues('is_admin') + "\n";
            draft.modalText += "User Active: " + getValues('active') + "\n";

        });

    }

    //cancel confirmation modal
    const hideModal = () => {
        console.log("Cancelled modal.");
        setState(draft => {
            draft.showModal = false;
        });
    };

    return(
        <div className="card m-3">
            <h5 className="card-header">UtopiaAdmin Edit User Details</h5>
            <div className="card-body">

                <form id="myForm" onSubmit={handleSubmit(onSubmit)}>

                    <div className="customColumn1">

                        <div className="form-group">
                            <label>Username</label>
                            <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>

                        <div className="form-group">
                            <label>First Name</label>
                            <input name="first_name" type="text" {...register('first_name')} className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.first_name?.message}</div>
                        </div>

                        <div className="form-group">
                            <label>Street Address</label>
                            <input name="street_address" type="text" {...register('street_address')} className={`form-control ${errors.street_address ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.street_address?.message}</div>
                        </div>

                        <div className="form-group">
                            <label>State</label>
                            <p>
                            <Controller control={control} name='us_state' render={({ field }) => (
                                <select className="dateDiv" value={field.value} onChange={(st) => field.onChange(st)}>
                                    {usStates.map(item => (
                                    <option key={item.abbreviation} value={item.abbreviation}>
                                        {item.name}
                                    </option>
                                    ))}
                                </select>
                                )}
                            />
                            </p>
                        </div>
                        
                        <div className="form-group">
                            <label>SSN</label>
                            <input name="ssn" type="text" {...register('ssn')} className={`form-control ${errors.ssn ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.ssn?.message}</div>
                        </div>

                        <div className="form-group">
                            <Controller control={control} name='phone' render={({ field }) => (
                                <PhoneInput inputRef={register} value={state.phoneStr} country={'us'} required={true} 
                                placeholder='' onChange={(ph) => field.onChange(ph)} />
                                )}
                            />
                        </div>

                        <div className="form-group">
                            <input name="confirmed" type="checkbox" {...register('confirmed')} className={`form-check-input ${errors.confirmed ? 'is-invalid' : ''}`} disabled={true} />
                            <label htmlFor="confirmed" className="form-check-label">Email Confirmed</label>
                            <div className="invalid-feedback">{errors.confirmed?.message}</div>
                        </div>

                        <div className="form-group">
                            <input name="is_admin" type="checkbox" {...register('is_admin')} className={`form-check-input ${errors.is_admin ? 'is-invalid' : ''}`} />
                            <label htmlFor="is_admin" className="form-check-label">Administrator</label>
                            <div className="invalid-feedback">{errors.is_admin?.message}</div>
                        </div>

                        <div className="form-group">
                            <input name="active" type="checkbox" {...register('active')} className={`form-check-input ${errors.active ? 'is-invalid' : ''}`} />
                            <label htmlFor="active" className="form-check-label">User Active</label>
                            <div className="invalid-feedback">{errors.active?.message}</div>
                        </div>

                    </div>

                    <div className="customColumn1">

                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <input name="last_name" type="text" {...register('last_name')} className={`form-control ${errors.last_name ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.last_name?.message}</div>
                        </div>

                        <div className="form-group">
                            <label>City</label>
                            <input name="city" type="text" {...register('city')} className={`form-control ${errors.city ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.city?.message}</div>
                        </div>

                        <div className="form-group">
                            <label>Zip Code</label>
                            <input name="zip" type="text" {...register('zip')} className={`form-control ${errors.zip ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.zip?.message}</div>
                        </div>

                        <div className="form-group">
                            <label>Date of Birth</label>
                            <Controller control={control} name='dob' render={({ field }) => (
                                <DatePicker placeholderText='' className="dateDiv" onChange={(date) => field.onChange(date)} selected={field.value} />
                                )}
                            />
                        </div>
                        
                    </div>

                </form>

            </div>
            <div className="card-footer">
                <button onClick={openModal} className="btn btn-primary mr-1">Save Changes</button>

            </div>

            <Modal show={state.showModal} onHide={hideModal}>
                <Modal.Header><h3>Confirm Changes</h3></Modal.Header>
                <Modal.Body>
                    <pre>
                    {state.modalText}
                    </pre>
                </Modal.Body>
                <Modal.Footer>
                    <button form="myForm" key="submit" onClick={hideModal} className="btn btn-primary mr-1">Submit</button>
                    <button className="btn btn-secondary mr-1" onClick={hideModal}>Cancel</button>
                </Modal.Footer>
            </Modal>     

        </div>

    );
}

export default EditUserDetails
