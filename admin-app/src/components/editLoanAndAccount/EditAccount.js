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
import PlatinumCredit from '../../static/platinum_credit.png'
import FoodiesCredit from '../../static/foodies_credit.png'
import BasicCredit from '../../static/basic_credit.png'
import UtopiaDebit from '../../static/utopia_debit.png'
import PlusCredit from '../../static/plus_credit.png'
import BlankCard from '../../static/blank_card.png'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function EditAccountDetails() {

    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)
    const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${appState.jwt}`
    }

    const [state, setState] = useImmer({
        isLoading: true,
        isDebit: false,
        account: [],
        image: BlankCard,
        cardNum: "0000 0000 0000 0000",
        name: "Name",
        enableSubmit: false,
    })

    const api = process.env.REACT_APP_VIEW_ACCOUNT_URL;

    useEffect(() => {
        async function fetchCard() {
            try {
                const response = await Axios.get(api, { headers:headers })
                setState(draft => {
                    draft.isLoading = false;
                    draft.account = response.data;
                })

                console.log("Got all accounts.")
            }
            catch (e) {
                console.log("There was a problem or the request was cancelled.")
            }
        }

        fetchCard()
    },[])

    const validationSchema = Yup.object().shape({

        id: Yup.number(),

        balance: Yup.number()
            .typeError("Valid number is required.")
            .nullable(false)
            .transform((v, o) => o === '' ? null : v) ,

        // credit_limit: Yup.number()
        //     .typeError("Valid number is required.")
        //     .min(0, "Number must be positive.")
        //     .nullable(false)
        //     .transform((v, o) => o === '' ? null : v),

        debt_interest: Yup.number()
            .typeError("Valid number is required.")
            .min(0, "Number must be positive.")
            .nullable(false)
            .transform((v, o) => o === '' ? null : v) ,

        payment_due: Yup.number()
            .typeError("Valid number is required.")
            .min(0, "Number must be positive.")
            .nullable(false)
            .transform((v, o) => o === '' ? null : v) ,

        confirmed: Yup.bool(),

        approved: Yup.bool(),

        active: Yup.bool()
    });
    const formOptions = { resolver: yupResolver(validationSchema) };


    const { control, register, handleSubmit, formState, setValue } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {

        if(data.id == null)
            return;

        Axios.post(api,JSON.stringify(data, null, 4),{headers:headers}).then(

            (response) => {
                if(response.status === 204){
                    appDispatch({ type: "flashMessage", value: `Congrats, you updated account # ${data.id}.`})
                    console.log("Account was updated.")
                }
            })
            .catch((error) => {
                if(error.toString()==='Error: Request failed with status code 500') {
                    appDispatch({ type: "flashErrorMessages", value: `Something went wrong!` })
                }
                else if(error.toString()==='Error: Request failed with status code 403') {
                    appDispatch({ type: "flashErrorMessages", value: `Authentication went wrong.` })
                }
            })
    }

    //add spaces between 4-digit sections
    function formatCardNum(s){
        return s.substring(0, 4) + " " + s.substring(4, 8) + " " + s.substring(8, 12) + " " + s.substring(12);
    }

    //selected a dropdown choice
    function handleChange(event) {
        //reset
        if(event.target.value == 0)
        {
            setValue('id', "");
            setValue('payment_due', "");
            setValue('balance', "");
            // setValue('credit_limit', "");
            setValue('debt_interest', "");
            setValue('due_date', "");
            setValue('confirmed', false);
            setValue('approved', false);
            setValue('active', false);

            setState(draft => {
                draft.isDebit = false;
                draft.cardNum = "0000 0000 0000 0000";
                draft.name = "Name";
                draft.image = BlankCard;
                draft.enableSubmit = false;
            });

            return;
        }

        const a = state.account.filter(x => {return x.id == event.target.value})[0];
        console.log('Select account: ' + a.fullName);
        setValue('id', a.id);
        setValue('balance', a.balance);
        if(a.account_type.includes('Checking')) {
            //overwrite any test values with 0
            // setValue('credit_limit', 0);
            setValue('debt_interest', 0);
            setValue('payment_due', 0);
            setValue('due_date', "");
        }
        else {
            // setValue('credit_limit', a.credit_limit);
            setValue('debt_interest', a.debt_interest);
            setValue('payment_due', a.payment_due);
            setValue('due_date', new Date(a.due_date));
        }
        setValue('confirmed', a.confirmed);
        setValue('approved', a.approved);
        setValue('active', a.active);

        setState(draft => {
            //set readonly fields
            draft.isDebit = a.account_type.includes('Checking');

            //set card number & name
            draft.cardNum = formatCardNum(a.card_num.toString());
            draft.name = a.fullName;

            //enable submit button
            draft.enableSubmit = true;

            //set image
            switch(a.account_type){
                case "Plus Credit":
                    draft.image = PlusCredit;
                    break;
                case "Basic Credit":
                    draft.image = BasicCredit;
                    break;
                case "Platinum Credit":
                    draft.image = PlatinumCredit;
                    break;
                case "Foodies Credit":
                    draft.image = FoodiesCredit;
                    break;
                case "Checking":
                    draft.image = UtopiaDebit;
                    break;
                default:
                    draft.image = BlankCard;
                }

        });
    }

    return(
        <div className="card m-3 ">
            <h5 className="card-header">UtopiaAdmin Edit Account Details</h5>
            <div className="card-body">

                <div className="customColumn1">

                    <label htmlFor="cars">Choose an account:</label><br />
                    <select className="customSelector" name="cars" id="cars" onChange={handleChange}>
                        <option key="0" value="0">Choose...</option>
                        {state.account.map(a => (
                            <option key={a.id} value={a.id}>
                                {a.id}. {a.fullName} - {a.account_type}
                            </option>
                            ))}
                    </select>

                    <br /><br />
                    <br />

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="form-group">
                            <label>Balance $</label>
                            <input name="balance" type="text" {...register('balance')} className={`form-control ${errors.balance ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.balance?.message}</div>
                        </div>

                        {/* <div className="form-group">
                            <label>Credit Limit $</label>
                            <input name="credit_limit" type="text" {...register('credit_limit')} readOnly={state.isDebit} className={`form-control ${errors.credit_limit ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.credit_limit?.message}</div>
                        </div> */}
                        <div className="form-group">
                            <label>Monthly Interest Rate %</label>
                            <input name="debt_interest" type="text" {...register('debt_interest')} readOnly={state.isDebit} className={`form-control ${errors.debt_interest ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.debt_interest?.message}</div>
                        </div>

                        <div className="form-group">
                            <label>Payment Due $</label>
                            <input name="payment_due" type="text" {...register('payment_due')} readOnly={state.isDebit} className={`form-control ${errors.payment_due ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.payment_due?.message}</div>
                        </div>

                        <div className="form-group">
                            <label>Due Date</label>
                            <Controller control={control} name='due_date' render={({ field }) => (
                                <DatePicker placeholderText='' className="dateDiv" readOnly={state.isDebit} onChange={(date) => field.onChange(date)} selected={field.value} />
                                )}
                            />
                        </div>

                        <div className="form-group">
                            <input name="confirmed" type="checkbox" {...register('confirmed')} className={`form-check-input ${errors.confirmed ? 'is-invalid' : ''}`} />
                            <label htmlFor="confirmed" className="form-check-label">Email Confirmed</label>
                            <div className="invalid-feedback">{errors.confirmed?.message}</div>
                        </div>

                        <div className="form-group">
                            <input name="approved" type="checkbox" {...register('approved')} className={`form-check-input ${errors.approved ? 'is-invalid' : ''}`} />
                            <label htmlFor="approved" className="form-check-label">Account Approved</label>
                            <div className="invalid-feedback">{errors.approved?.message}</div>
                        </div>

                        <div className="form-group">
                            <input name="active" type="checkbox" {...register('active')} className={`form-check-input ${errors.active ? 'is-invalid' : ''}`} />
                            <label htmlFor="active" className="form-check-label">Account Active</label>
                            <div className="invalid-feedback">{errors.active?.message}</div>
                        </div>

                        <div className="form-group">&nbsp;</div>

                        <div className="form-group">
                            <button type="submit" disabled={!state.enableSubmit} className="btn btn-primary mr-1">Save Changes</button>
                        </div>
                    </form>
                </div>

                <div className="cardDiv">
                    <img className="minicard" src={state.image} /><br />
                    <div className="cardNum">{state.cardNum}</div>
                    <div className="fullName">{state.name}</div>
                </div>

            </div>
        </div>


    );
}

export default EditAccountDetails
