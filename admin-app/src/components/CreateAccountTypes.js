import React, { useEffect, useState, useContext } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import 'bootstrap/dist/css/bootstrap.css'
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import axios from 'axios';
import * as Yup from 'yup';
import '../App.css';


function CreateAccountTypes(){

    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

    const validationSchema = Yup.object().shape({
        accountName: Yup.string()
            .required('Required')
            .min(2, 'Must have at least 2 characters')
            .max(20, 'Must have at most 20 characters')
            .test('alphabets', 'Must only letters', (value) => {
                return /^[a-zA-Z ]+$/.test(value);
            }),

        fee: Yup.number()
            .typeError("Must only contain numbers")
            .min(0, 'Must be equal or greater than $0')
            .max(9999, 'Must be less than or equal to $9999')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v) ,

        late: Yup.number()
            .typeError("Must only contain numbers")
            .min(0, 'Must be equal or greater than $0')
            .max(9999, 'Must be less than or equal to $9999')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v) ,

        apy: Yup.number()
            .typeError("Must only contain numbers")
            .min(-10, 'Must be equal or greater than -10%')
            .max(20, 'Must be less than or equal to 20%')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v),

        cash: Yup.number()
            .typeError("Must only contain numbers")
            .min(0, 'Must be equal or greater than 0%')
            .max(5, 'Must be less than or equal to 5%')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v),

        foodie: Yup.number()
            .typeError("Must only contain numbers")
            .min(0, 'Must be equal or greater than 0%')
            .max(5, 'Must be less than or equal to 5%')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v)

    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        //display form data on success
        data.apy /= 100;
        data.taxes /= 100;
        data.accountName = data.accountName + " " +data.accounttype;

        // alert(appState.jwt);


        const api = process.env.REACT_APP_CREATE_ACCOUNT_TYPE_URL;
             const headers = {
                 'Content-Type': 'application/json; charset=UTF-8',
                 'Authorization': `Bearer ${appState.jwt}`
             }

        axios.post(api,JSON.stringify(data, null, 4),{headers:headers}).then(

            (response) => {
                if(response.status ===201){
                    appDispatch({ type: "flashMessage", value: `Congrats, you created a new account type called ${data.accountName}.`})
                    console.log("New new account type was created.")
                    // window.location.reload();
                }else if(response.status === 500){
                    console.log(appState.jwt)

                }
            })
            .catch((error) => {
                if(error.toString()==='Error: Request failed with status code 500')
                {
                    appDispatch({ type: "flashErrorMessages", value: `Sorry, a account type called ${data.accountName} already exists.` })

                }else if(error.toString()==='Error: Request failed with status code 403')
                {
                    appDispatch({ type: "flashErrorMessages", value: `Authentication went wrong.` })
                }
                }
            )
    }

    return(

        <div className="card m-3">
            <h5 className="card-header">UtopiaAdmin Create New Account Type</h5>
            <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-col">
                        <div className="form-group col-3">
                            <label >Account Name</label>
                            <input  name="accountName" type="text" {...register('accountName')} placeholder="Account Name" className={`form-control ${errors.accountName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.accountName?.message}</div>
                        </div>
                        <div className="form-group col-3">
                            <label>Annual Fee</label>
                            <input name="fee" type="text" {...register('fee')} placeholder="Annual Fee" className={`form-control ${errors.fee ? 'is-invalid' : ''}`} />

                            <div className="invalid-feedback">{errors.fee?.message}</div>
                        </div>
                        <div className="form-group col-3">
                            <label>Late Fee</label>
                            <input name="late" type="text" {...register('late')} placeholder="Late Fee" className={`form-control ${errors.late ? 'is-invalid' : ''}`} />

                            <div className="invalid-feedback">{errors.late?.message}</div>
                        </div>
                    </div>
                    <div className="form-col">
                        <div className="form-group col-3">
                            <label>APY(%)</label>
                            <input name="apy" type="text" {...register('apy')} placeholder="APY(%)" className={`form-control ${errors.apy ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.apy?.message}</div>
                        </div>
                    </div>

                    <div className="form-group col-3">
                        <label> Cash Back(%)</label>
                        <input name="cash" type="text" {...register('cash')} placeholder="Cash Back(%)" className={`form-control ${errors.cash ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.cash?.message}</div>
                    </div>

                    <div className="form-group col-3">
                        <label> Foodie Points(%)</label>
                        <input name="foodie" type="text" {...register('foodie')} placeholder="Foodie Points(%)" className={`form-control ${errors.foodie ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.foodie?.message}</div>
                    </div>

                    <div className="form-group">
                        <button type="submit"  className="btn btn-primary mr-1">Submit</button>
                        <button className="btn btn-warning " onClick={() => reset()} >Reset</button>
                    </div>
                </form>
            </div>
        </div>

    );
}

export default CreateAccountTypes
