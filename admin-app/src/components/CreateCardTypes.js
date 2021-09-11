import React, { useEffect, useState, useContext } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import 'bootstrap/dist/css/bootstrap.css'
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import axios from 'axios';
import * as Yup from 'yup';
import '../App.css';


function CreateCardTypes(){

    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

    const validationSchema = Yup.object().shape({
        cardType: Yup.string()
            .required('Card type is required'),
        cardName: Yup.string()
            .required('Card Name is required')
            .min(2, 'Card Name must at least contains three characters !')
            .max(20, 'Card Name must at most contains twenty characters !')
            .test('alphabets', 'Card Name must only contain alphabets !', (value) => {
                return /^[a-zA-Z ]+$/.test(value);
            }),

        annualFee: Yup.number()
            .typeError("Annual Fee must only contain digits !")
            .min(50, 'Annual fee must be equal to or more than 50 dollars !')
            .max(9999, 'Annual fee must be equal to or less than 9999 dollars !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v) ,

        apr: Yup.number()
            .typeError("APR must only contain digits !")
            .min(10, 'APR must be equal to or more than 10% !')
            .max(50, 'APR must be equal to or less than 50% !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v),

        cashBack: Yup.number()
            .typeError("Cash Back percentages must only contain digits !")
            .min(1, 'Cash Back percentages must be equal to or more than 1% !')
            .max(7, 'Cash Back percentages must be equal to or more than 7% !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v),
        foodiesPointsPercentages: Yup.number()
            .typeError("Foodies Points Percentages must only contain digits !")
            .min(3, 'Foodies Points Percentages must be equal to or more than 3% !')
            .max(8, 'Foodies Points Percentages must be equal to or less than 8% !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v),
        lateFee: Yup.number()
            .typeError("Late fee must only contain digits !")
            .min(20, 'Late fee must be equal to or more than 20 dollars !')
            .max(100, 'Late fee must be equal to or less than 100 dollars !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v)

    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        //display form data on success
        data.apr /= 100;
        data.cashBack /= 100;
        data.foodiesPointsPercentages /= 100;
        data.cardName = data.cardName + " " +data.cardType;

        // alert(appState.jwt);


        const api = process.env.REACT_APP_CREATE_CARD_TYPE_URL;

        const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${appState.jwt}` }

        axios.post(api,JSON.stringify(data, null, 4),{headers:headers}).then(

            (response) => {
                if(response.status ===201){
                    appDispatch({ type: "flashMessage", value: `Congrats, you created a new card type called ${data.cardName}.` })
                    console.log("New new card type was created.")
                    // window.location.reload();
                }
            })
            .catch((error) => {
                if(error.toString()==='Error: Request failed with status code 500')
                {
                    appDispatch({ type: "flashErrorMessages", value: `Sorry, a card type called ${data.cardName} already exists.` })

                }else if(error.toString()==='Error: Request failed with status code 403')
                {
                    appDispatch({ type: "flashErrorMessages", value: `Authentication went wrong.` })
                }
            }
        )
    }

    return(

        <div className="card m-3">
            <h5 className="card-header">UtopiaAdmin Create New Card Type</h5>
            <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-col">
                        <div className="form-group col-3">
                            <label >Card Types&nbsp;&nbsp;</label>
                            <select   name="cardType" {...register('cardType')} className={`form-control ${errors.cardType ? 'is-invalid' : ''}`}>
                                <option value="" selected disabled>Please select a card type (required)</option>
                                <option value="Debit">Debit</option>
                                <option value="Credit">Credit</option>
                            </select>
                            <div className="invalid-feedback">{errors.cardType?.message}</div>
                        </div>
                        <div className="form-group col-3">
                            <label >Card Name</label>
                            <input  name="cardName" type="text" {...register('cardName')} placeholder="Enter a Card Name (required)" className={`form-control ${errors.cardName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.cardName?.message}</div>
                        </div>
                        <div className="form-group col-3">
                            <label>Annual Fee</label>
                            <input name="annualFee" type="text" {...register('annualFee')} placeholder="Enter Annual Fee (optional)" className={`form-control ${errors.annualFee ? 'is-invalid' : ''}`} />

                            <div className="invalid-feedback">{errors.annualFee?.message}</div>
                        </div>
                    </div>
                    <div className="form-col">

                        <div className="form-group col-3">
                            <label>APR(%)</label>
                            <input name="apr" type="text" {...register('apr')} placeholder="Enter APR(%) (optional)" className={`form-control ${errors.apr ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.apr?.message}</div>
                        </div>
                    </div>

                        <div className="form-group col-3">
                            <label>Cash Back Percentages(%)</label>
                            <input name="cashBack" type="text" {...register('cashBack')} placeholder="Enter Cash Back Percentages(%) (optional)" className={`form-control ${errors.cashBack ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.cashBack?.message}</div>
                        </div>
                    <div className="form-group col-3">
                        <label>Late Fee</label>
                        <input name="lateFee" type="text" {...register('lateFee')} placeholder="Enter Late Fee (optional)" className={`form-control ${errors.lateFee ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.lateFee?.message}</div>
                    </div>
                    <div className="form-group col-4">
                        <label>Foodies Points Percentages(%)</label>
                        <input  name="foodiesPointsPercentages" type="text" {...register('foodiesPointsPercentages')} placeholder="Enter Foodies Points Percentages(%) (optional)" className={`form-control ${errors.foodiesPointsPercentages ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.foodiesPointsPercentages?.message}</div>
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

export default CreateCardTypes
