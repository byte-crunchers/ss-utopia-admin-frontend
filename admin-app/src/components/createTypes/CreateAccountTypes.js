import React, { useEffect, useState, useContext } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import 'bootstrap/dist/css/bootstrap.css'
import DispatchContext from "../../DispatchContext"
import StateContext from "../../StateContext"
import axios from 'axios';
import * as Yup from 'yup';
import '../../App.css';


function CreateAccountTypes(){

    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

    const validationSchema = Yup.object().shape({

        id: Yup.string()
            .required('Account type name is required')
            .min(2, 'Account type Name must at least contains three characters !')
            .max(20, 'Account type Name must at most contains twenty characters !')
            .test('alphabets', 'Account Name must only contain alphabets !', (value) => {
                return /^[a-zA-Z ]+$/.test(value);
            }),

        late_fee: Yup.number()
            .typeError("Fee must only contain digits !")
            .min(1, 'Fee must be equal to or more than 1 dollars !')
            .max(999, 'Fee must be equal to or less than 999 dollars !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v) ,

        savings_interest: Yup.number()
            .typeError("Saving Interest must only contain digits !")
            .min(1, 'Saving Interest must be equal to or more than 1% !')
            .max(10, 'Saving Interest must be equal to or less than 10% !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v),

        cashBack: Yup.number()
            .typeError("Cash back must only contain digits !")
            .min(1, 'Cash back must be equal to or more than 1% !')
            .max(999, 'cash back must be equal to or less than 10% !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v) ,

        annual_fee: Yup.number()
            .typeError("Annual fee must only contain digits !")
            .min(1, 'Annual fee must be equal to or more than 1 dollars !')
            .max(999, 'Annual fee must be equal to or less than 999 dollars !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v) ,


        foodie_pts: Yup.number()
            .typeError("foodie points back must only contain digits !")
            .min(1, 'foodie points must be equal to or more than 1% !')
            .max(999, 'foodie points must be equal to or less than 10% !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v) ,
    });
    const formOptions = { resolver: yupResolver(validationSchema) };


    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        //display form data on success
        data.savings_interest/= 100;
        data.cashBack /= 100;
        data.foodie_pts /= 100;


        const api = process.env.REACT_APP_CREATE_ACCOUNT_TYPE_URL;
             const headers = {
                 'Content-Type': 'application/json; charset=UTF-8',
                 'Authorization': `Bearer ${appState.jwt}`
             }

        axios.post(api,JSON.stringify(data, null, 4),{headers:headers}).then(

            (response) => {
                if(response.status ===201){
                    appDispatch({ type: "flashMessage", value: `Congrats, you created a new account type called ${data.id}.`})
                    console.log("New new account type was created.")

                }
            })
            .catch((error) => {
                if(error.toString()==='Error: Request failed with status code 500')
                {
                    appDispatch({ type: "flashErrorMessages", value: `Sorry, a account type called ${data.id} already exists.` })

                }else if(error.toString()==='Error: Request failed with status code 403')
                {
                    appDispatch({ type: "flashErrorMessages", value: `Authentication went wrong.` })
                }
                }
            )
    }

    return(
        <div className="card m-3 ">
            <h5 className="card-header">UtopiaAdmin Create New Account Type</h5>
            <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="form-group col-3">
                            <label >Account Types Name</label>
                            <input  name="id" type="text" {...register('id')} placeholder="Enter an Account type Name (required)" className={`form-control ${errors.id ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.id?.message}</div>
                        </div>

                        <div className="form-group col-3">
                            <label>Annual Fee</label>
                            <input name="annual_fee" type="text" {...register('annual_fee')} placeholder="Enter Annual Fee (optional)" className={`form-control ${errors.annual_fee ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.annual_fee?.message}</div>
                        </div>

                        <div className="form-group col-3">
                            <label>Late Fee</label>
                            <input name="late_fee" type="text" {...register('late_fee')} placeholder="Enter Late Fee (optional)" className={`form-control ${errors.late_fee ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.late_fee?.message}</div>
                    </div>


                        <div className="form-group col-3">
                            <label>Saving Interest(%)</label>
                            <input name="savings_interest" type="text" {...register('savings_interest')} placeholder="Saving Interest(%) (optional)" className={`form-control ${errors.savings_interest ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.savings_interest?.message}</div>
                        </div>
                        <div className="form-group col-3">
                            <label>Cash Back(%)</label>
                            <input name="cashBack" type="text" {...register('cashBack')} placeholder="Cash Back(%) (optional)" className={`form-control ${errors.cashBack ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.cashBack?.message}</div>
                        </div>

                        <div className="form-group col-3">
                            <label>foodie points(%)</label>
                            <input name="foodie_pts" type="text" {...register('foodie_pts')} placeholder="foodie points(%) (optional)" className={`form-control ${errors.foodie_pts ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.foodie_pts?.message}</div>
                        </div>

                    <div className="form-group">
                        <div className=" mid-left">
                        <button type="submit"  className="btn btn-primary mr-1">Submit</button>
                        <button className="btn btn-warning " onClick={() => reset()} >Reset</button>
                    </div>
                    </div>
                </form>
            </div>
        </div>


    );
}

export default CreateAccountTypes
