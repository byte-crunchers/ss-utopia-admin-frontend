import React, { useEffect, useState, useContext } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import 'bootstrap/dist/css/bootstrap.css'
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import axios from 'axios';
import * as Yup from 'yup';
import '../App.css';


function CreateLoanTypes(){

    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

    const validationSchema = Yup.object().shape({
        loanType: Yup.string()
            .required('Loan type is required'),
        secured: Yup.string()
            .required('Secured attribute is required'),

        loanName: Yup.string()
            .required('Loan Name is required')
            .min(2, 'Loan Name must at least contains three characters !')
            .max(20, 'Loan Name must at most contains twenty characters !')
            .test('alphabets', 'Card Name must only contain alphabets !', (value) => {
                return /^[a-zA-Z ]+$/.test(value);
            }),

        yrsTerms: Yup.number()
            .required('Year Terms is required')
            .typeError("Please enter a valid number (digit only) ")
            .min(0.12, 'Year Terms must be equal to or more than 0.12 !')
            .max(70, 'Year Terms must be equal to or less than 70 !'),

        principal: Yup.number()
            .required('Principal is required')
            .typeError("Please enter a valid number (digit only)")
            .min(500, 'Principal must be equal to or more than 500 dollars !')
            .max(5000000, 'Principal must be equal to or less than 500000 dollars !'),


        interestRate: Yup.number()
            .required('Interest Rate is required')
            .typeError("Please enter a valid number (digit only)")
            .min(2, 'Interest Rate must be equal to or more than 2% !')
            .max(50, 'Interest Rate must be equal to or more than 50% !'),
            // .nullable(true /* or false */)
            // .transform((v, o) => o === '' ? null : v),

        installmentPayments: Yup.number()
            .required('Installment Payments is required')
            .typeError("Installment Payments is required")
            .min(50, 'Installment Payments must be equal to or more than 20 dollars !')
            .max(5000000, 'Installment Payments must be equal to or less than 5000000 dollars !')
            // .nullable(true /* or false */)
            // .transform((v, o) => o === '' ? null : v)

    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        //display form data on success
        data.interestRate /= 100;
        data.loanName = data.loanName + " " +data.loanType;
        data.installmentPayments = document.getElementById('installmentPayments').value


        const api = process.env.REACT_APP_CREATE_LOAN_TYPE_URL;

        const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${appState.jwt}`
        }

        axios.post(api,JSON.stringify(data, null, 4),{headers:headers}).then(

            (response) => {
                if(response.status ===201){
                    appDispatch({ type: "flashMessage", value: `Congrats, you created a new loan type called ${data.loanName}.` })
                    console.log("New new loan type was created.")
                    // window.location.reload();
                }
            })
            .catch((error) => {
                if(error.toString()==='Error: Request failed with status code 500')
                {
                    appDispatch({ type: "flashErrorMessages", value: `Sorry, a loan type called ${data.loanName} already exists.` })

                }else if(error.toString()==='Error: Request failed with status code 403')
                {
                    appDispatch({ type: "flashErrorMessages", value: `Authentication went wrong.` })
                }
                }
            )
    }


    function calculate() {
        const amount = document.getElementById('principal');
        const apr = document.getElementById('interestRate');
        const yrs = document.getElementById('yrsTerms');




        const principal = parseFloat(amount.value);
        const interest = parseFloat(apr.value) / 100 / 12;
        const payments = parseFloat(yrs.value) * 12;


        const x = Math.pow(1 + interest, payments);
        let installmentPayments = (principal * x * interest) / (x - 1);


        if (isFinite(installmentPayments)){
             installmentPayments = installmentPayments.toFixed(2)
        }

        document.getElementById('installmentPayments').value =  installmentPayments

    }



    return(

        <div className="card m-3">
            <h5 className="card-header">UtopiaAdmin Create New Loan Type</h5>
            <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-col">
                        <div className="form-group col-3">
                            <label >Loan Types&nbsp;&nbsp;</label>
                            <select   name="loanType" {...register('loanType')} className={`form-control ${errors.loanType ? 'is-invalid' : ''}`}>
                                <option value="" selected disabled>Please select a loan type (required)</option>
                                <option value="Mortgage">Mortgage</option>
                                <option value="Auto loan">Auto loan</option>
                                <option value="Student loan">Student loan</option>
                                <option value="Personal loan">Personal loan</option>
                                <option value="Payday loan">Payday loan</option>
                            </select>
                            <div className="invalid-feedback">{errors.loanType?.message}</div>
                        </div>

                        <div className="form-group col-3">
                            <label >Secured&nbsp;&nbsp;</label>
                            <select   name="secured" {...register('secured')} className={`form-control ${errors.secured ? 'is-invalid' : ''}`}>
                                <option value="" selected disabled>Please select a loan security type (required)</option>
                                <option value="True">True</option>
                                <option value="False">False</option>
                            </select>
                            <div className="invalid-feedback">{errors.secured?.message}</div>
                        </div>


                        <div className="form-group col-3">
                            <label >Loan Name</label>
                            <input  name="loanName" type="text" {...register('loanName')} placeholder="Enter a Loan Name (required)" className={`form-control ${errors.loanName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.loanName?.message}</div>
                        </div>
                        <div className="form-group col-3">
                            <label>Principal</label>
                            <input id='principal' name="principal" type="text" {...register('principal')} placeholder="Enter principal (required)" className={`form-control ${errors.principal ? 'is-invalid' : ''}`} />

                            <div className="invalid-feedback">{errors.principal?.message}</div>
                        </div>
                    </div>
                    <div className="form-col">

                        <div className="form-group col-3">
                            <label>Interest Rate(%)</label>
                            <input id= "interestRate" name="interestRate" type="text" {...register('interestRate')} placeholder="Enter Interest Rate(%) (required)" className={`form-control ${errors.interestRate ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.interestRate?.message}</div>
                        </div>
                    </div>

                    <div className="form-group col-3">
                        <label>Years terms</label>
                        <input id= "yrsTerms" name="yrsTerms" type="text" {...register('yrsTerms')} placeholder="Enter years terms (required)" className={`form-control ${errors.yrsTerms ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.yrsTerms?.message}</div>
                    </div>

                    <div className="form-group col-3">
                        <label>Installment Payments</label>
                        <input id= "installmentPayments" name="installmentPayments" type="text" {...register('installmentPayments')} readOnly placeholder="Click below" className={`form-control ${errors.installmentPayments ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors. installmentPayments?.message}</div>
                        <br/>
                        <button type="button" className="btn btn-secondary btn-sm"  onClick={() => calculate()}>Calculate</button>

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

export default CreateLoanTypes
