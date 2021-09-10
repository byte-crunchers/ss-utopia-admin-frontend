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
        accounttype: Yup.string()
            .required('Account type is required'),
        accountName: Yup.string()
            .required('Account Name is required')
            .min(2, 'Account Name must be more than two characters !')
            .max(20, 'Account Name must be less than twenty characters !')
            .test('alphabets', 'Account Name must only contain alphabets !', (value) => {
                return /^[a-zA-Z ]+$/.test(value);
            }),

        fee: Yup.number()
            .typeError("Fee must only contain digits !")
            .min(1, 'Fee must be more than 1 dollars !')
            .max(9999, 'Fee must be less than 9999 dollars !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v) ,

        apy: Yup.number()
            .typeError("APY must only contain digits !")
            .min(1, 'APY must be more than 1% !')
            .max(10, 'APY must be less than 10% !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v),

        taxes: Yup.number()
            .typeError("taxes percentages must only contain digits !")
            .min(2, 'taxes percentages must be more than 2% !')
            .max(45, 'taxes percentages must be more than 45% !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v),
        contributionLimits: Yup.number()
            .typeError("Contribution limit must only contain digits !")
            .min(100, 'Contribution limit must be more than 100 !')
            .max(7000, 'Contribution limit must be less than 7000 !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v),
        withdrawalLimits: Yup.number()
            .typeError("withdrawal Limit must only contain digits !")
            .min(1, 'withdrawal Limit must be more than 1 !')
            .max(8, 'withdrawal Limit must be less than 8 !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v),

        withdrawalAgeLimits: Yup.number()
            .typeError("withdrawal Age Limit must only contain digits !")
            .min(50, 'withdrawal Age Limit must be more than 50 !')
            .max(100, 'withdrawal Age Limit must be less than 100 !')
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
                    appDispatch({ type: "flashMessage", value: "Congrats, you created a new account type." })
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
                            <label >Account Types&nbsp;&nbsp;</label>
                            <select   name="caccounttype" {...register('accounttype')} className={`form-control ${errors.accounttype ? 'is-invalid' : ''}`}>
                                <option value="" selected disabled>Please select an account type (required)</option>
                                <option value="Checking">Checking</option>
                                <option value="Saving">Saving</option>
                                <option value="IRA">IRA</option>
                                <option value="Investing">Investing</option>
                            </select>
                            <div className="invalid-feedback">{errors.accounttype?.message}</div>
                        </div>
                        <div className="form-group col-3">
                            <label >Account Name</label>
                            <input  name="accountName" type="text" {...register('accountName')} placeholder="Enter an Account Name (required)" className={`form-control ${errors.accountName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.accountName?.message}</div>
                        </div>
                        <div className="form-group col-3">
                            <label>Fee</label>
                            <input name="fee" type="text" {...register('fee')} placeholder="Enter Fee (optional)" className={`form-control ${errors.fee ? 'is-invalid' : ''}`} />

                            <div className="invalid-feedback">{errors.fee?.message}</div>
                        </div>
                    </div>
                    <div className="form-col">

                        <div className="form-group col-3">
                            <label>APY(%)</label>
                            <input name="apy" type="text" {...register('apy')} placeholder="Enter APY(%) (optional)" className={`form-control ${errors.apy ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.apy?.message}</div>
                        </div>
                    </div>

                    <div className="form-group col-3">
                        <label> Taxes Percentages(%)</label>
                        <input name="taxes" type="text" {...register('taxes')} placeholder="Enter Taxes Percentages(%) (optional)" className={`form-control ${errors.taxes ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.taxes?.message}</div>
                    </div>
                    <div className="form-group col-3">
                        <label>Contribution Limit</label>
                        <input name="contributionLimits" type="text" {...register('contributionLimits')} placeholder="Enter Contribution Limit (optional)" className={`form-control ${errors.contributionLimits ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.contributionLimits?.message}</div>
                    </div>
                    <div className="form-group col-4">
                        <label>Withdrawal Age Limit</label>
                        <input  name="withdrawalAgeLimits" type="text" {...register('withdrawalAgeLimits')} placeholder="Enter Withdrawal Age Limit (optional)" className={`form-control ${errors.withdrawalAgeLimits ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.withdrawalAgeLimits?.message}</div>
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
