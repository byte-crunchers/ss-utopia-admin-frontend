import React, { useEffect, useState, useContext } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import 'bootstrap/dist/css/bootstrap.css'
import DispatchContext from "../../DispatchContext"
import StateContext from "../../StateContext"
import axios from 'axios';
import * as Yup from 'yup';
import '../../App.css';


function CreateLoanTypes(){

    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

    const validationSchema = Yup.object().shape({
        id: Yup.string()
            .required('Loan type name is required')
            .min(2, 'Loan type Name must at least contains three characters !')
            .max(20, 'Loan type Name must at most contains twenty characters !')
            .test('alphabets', 'Account Name must only contain alphabets !', (value) => {
                return /^[a-zA-Z ]+$/.test(value);
            }),
        isSecured: Yup.string()
            .required('Secured attribute is required'),


        lateFee: Yup.number()
            .required('Late Fee is required')
            .typeError("Please enter a valid number (digit only)")
            .min(25, 'Late Fee must be equal to or more than 25 dollars !')
            .max(200, 'Late Fee must be equal to or less than 200 dollars !'),


        lowerRange: Yup.number()
            .required('Lower Range is required')
            .typeError("Please enter a valid number (digit only)")
            .min(1, 'Lower Range must be equal to or more than 1% !')
            .max(3, 'Lower Range Rate must be equal to or less than 3% !'),
            // .nullable(true /* or false */)
            // .transform((v, o) => o === '' ? null : v),

        upperRange: Yup.number()
            .required('Upper Range is required')
            .typeError("Please enter a valid number (digit only)")
            .min(3, 'Upper Range must be equal to or more than 1% !')
            .max(50, 'Upper Range Rate must be equal to or less than 50% !'),

        term_min: Yup.number()
            .required('minimum term is required')
            .typeError("Please enter a valid number (digit only)")
            .min(1, 'minimum term must be equal to or more than 1 !')
            .max(3, 'minimum term must be equal to or less than 3 !'),


        term_max: Yup.number()
            .required('maximum term is required')
            .typeError("Please enter a valid number (digit only)")
            .min(1, 'maximum term must be equal to or more than 3 !')
            .max(30, 'maximum term must be equal to or less than 30 !'),
            // .nullable(true /* or false */)
            // .transform((v, o) => o === '' ? null : v)

    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        //display form data on success
        data.upperRange /= 100;
        data.lowerRange /= 100;
        // data.loanName = data.loanName + " " +data.loanType;
        // data.installmentPayments = document.getElementById('installmentPayments').value


        const api = process.env.REACT_APP_CREATE_LOAN_TYPE_URL;

        const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${appState.jwt}`
        }

        axios.post(api,JSON.stringify(data, null, 4),{headers:headers}).then(

            (response) => {
                if(response.status ===201){
                    appDispatch({ type: "flashMessage", value: `Congrats, you created a new loan type called ${data.id}.` })
                    console.log("New new loan type was created.")
                    // window.location.reload();
                }
            })
            .catch((error) => {
                if(error.toString()==='Error: Request failed with status code 500')
                {
                    appDispatch({ type: "flashErrorMessages", value: `Sorry, a loan type called ${data.id} already exists.` })

                }else if(error.toString()==='Error: Request failed with status code 403')
                {
                    appDispatch({ type: "flashErrorMessages", value: `Authentication went wrong.` })
                }
                }
            )
    }

    return(

        <div className="card m-3">
            <h5 className="card-header">UtopiaAdmin Create New Loan Type</h5>
            <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="form-group col-3">
                            <label >Loan type Name</label>
                            <input  name="id" type="text" {...register('id')} placeholder="Enter a Loan type Name (required)" className={`form-control ${errors.id ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.id?.message}</div>
                        </div>

                        <div className="form-group col-3">
                            <label >Secured&nbsp;&nbsp;</label>
                            <select   name="isSecured" {...register('isSecured')} className={`form-control ${errors.isSecured ? 'is-invalid' : ''}`}>
                                <option value="" selected disabled>Please select a loan security type (required)</option>
                                <option value="True">True</option>
                                <option value="False">False</option>
                            </select>
                            <div className="invalid-feedback">{errors.isSecured?.message}</div>
                        </div>



                        <div className="form-group col-3">
                            <label>lower Range(%)</label>
                            <input id='lowerRange' name="lowerRange" type="text" {...register('lowerRange')} placeholder="Enter Lower Range(%) (required)" className={`form-control ${errors.lowerRange ? 'is-invalid' : ''}`} />

                            <div className="invalid-feedback">{errors.lowerRange?.message}</div>
                        </div>



                        <div className="form-group col-3">
                            <label>Upper Range(%)</label>
                            <input id= "upperRange " name="upperRange" type="text" {...register('upperRange')} placeholder="Enter Upper Range(%) (required)" className={`form-control ${errors.upperRange ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.upperRange?.message}</div>
                        </div>

                    <div className="form-group col-3">
                            <label>Minimum term</label>
                            <input id= "term_min" name="term_min" type="text" {...register('term_min')} placeholder="Enter minimum term (required)" className={`form-control ${errors.term_min ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.term_min?.message}</div>
                        </div>


                    <div className="form-group col-3">
                        <label>Maximum term</label>
                        <input id= "term_max" name="term_max" type="text" {...register('term_max')} placeholder="Enter maximum term (required)" className={`form-control ${errors.term_max ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.term_max?.message}</div>
                    </div>

                    <div className="form-group col-3">
                        <label>Late Fee</label>
                        <input id= "lateFee" name="lateFee" type="text" {...register('lateFee')} placeholder="Enter Late Fee (required)" className={`form-control ${errors.lateFee? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.lateFee?.message}</div>
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

export default CreateLoanTypes
