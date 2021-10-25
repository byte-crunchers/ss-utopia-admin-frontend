import React, {useContext, useState} from "react";
import DispatchContext from "../../DispatchContext";
import StateContext from "../../StateContext";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import axios from "axios";

function IncreaseCreditLimit(){

    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)
    const ViewApi = process.env.REACT_APP_VIEW_CREDITLIMIT_URL
    const UpdateApi = process.env.REACT_APP_VIEW_UPDATECREDITLIMIT_URL
    const [showText, setShowText] = useState(false);
    const [showLimit, setLimitText] = useState(0);
    const validationSchema = Yup.object().shape({

        cardNum: Yup.number()
            .required('Credit card number is required')
            .typeError("Please enter a valid Credit card number (digits only)")
            .min(10000000000000, 'Credit card number must be equal to 16 digits !')
            .max(99999999999999999, 'Credit card number must be equal to 16 digits !')
,
        creditLimit: Yup.number()
            .typeError("Please enter a valid number (digits only)")
            .min(200, 'credit limit must be equal or greater than 200 dollars !')
            .nullable(true /* or false */)
            .transform((v, o) => o === '' ? null : v) ,
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${appState.jwt}`     }

    function onSubmit(data) {


        axios.get(`${ViewApi}/${data.cardNum}`,{headers:headers}).then(

            (response) => {
                if(response.status ===200){
                    setShowText(true);
                    setLimitText(response.data);
                }
            })
            .catch((error) => {

                    if(error.toString()==='Error: Request failed with status code 500')
                    {
                        setShowText(false);
                        appDispatch({ type: "flashErrorMessages", value: `Sorry, Credit card(${data.cardNum}) does not exist.` })

                    }else if(error.toString()==='Error: Request failed with status code 403')
                    {
                        appDispatch({ type: "flashErrorMessages", value: `Authentication went wrong.` })
                    }
                }
            )
    }

    function onSubmitU(data) {

        const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${appState.jwt}`
        }

        axios.put(UpdateApi,JSON.stringify(data, null, 4),{headers:headers}).then(

            (response) => {
                if(response.status ===204){
                    appDispatch({ type: "flashMessage", value: `You update credit card(${data.cardNum})'s limit to ${data.creditLimit} dollars successfully.`} )
                    console.log("credit was updated.")

                }
            })
            .catch((error) => {
                    if(error.toString()==='Error: Request failed with status code 500')
                    {
                        appDispatch({ type: "flashErrorMessages", value: `Sorry, Credit card(${data.cardNum}) does not exist.` })

                    }else if(error.toString()==='Error: Request failed with status code 403')
                    {
                        appDispatch({ type: "flashErrorMessages", value: `Authentication went wrong.` })
                    }
                }
            )
    }

    return(
        <>
            <div className="card m-3 " >
                <h5 className="card-header">UtopiaAdmin Update Credit Limit</h5>
                <div className="card-body ">
                    <form onSubmit={handleSubmit(onSubmitU)}>

                        <div className="form-group col-3">

                            <label >Credit Card Number </label>
                            {/*<div className="form-inline">*/}

                            <input  name="cardNum" type="text" {...register('cardNum')} placeholder="Enter a Credit card number (required)" className={`form-control ${errors.cardNum ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.cardNum?.message}</div>


                            <div className="flex-parent jc-center">

                            <button className="btn btn-light " type="submit"  onClick={handleSubmit(onSubmit) }>Check current limit</button>
                            {showText && <div  className="text1-mid-left">Current limit: $ {showLimit}  </div> }

                        </div>
                        </div>

                        <div className="form-group col-3">

                            <label >New Credit Limit </label>
                            <input  name="creditLimit" type="text" {...register('creditLimit')} placeholder="Enter a new credit limit (required)" className={`form-control ${errors.creditLimit ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.creditLimit?.message}</div>
                        </div>

                        <div className="form-group">
                            <div className=" mid-left">

                                <>  </>
                                <button  className="btn btn-primary" onClick={handleSubmit(onSubmitU)}>Update</button>


                            </div>
                        </div>


                        <div className="form-group col-3">
                            <label > </label>


                        </div>
                    </form>
                </div>
            </div>

        </>
    )
}


export default IncreaseCreditLimit