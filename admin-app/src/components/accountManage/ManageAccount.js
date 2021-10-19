import React, {useContext} from "react";
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import axios from "axios";
import {yupResolver} from "@hookform/resolvers/yup";

function ManageAccount(){
    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)
    const api = process.env.REACT_APP_VIEW_ACCOUNT_URL
    const validationSchema = Yup.object().shape({

        id: Yup.number()
            .required('Account id is required')
            .typeError("Please enter a valid number (digit only)")
            .min(1, 'Account id must be equal to or more than 1 !')
            });

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${appState.jwt}`     }

    function onSubmit(data) {

        if (!window.confirm('Are you sure to delete this account?')) return

        axios.delete(`${api}/${data.id}`,{headers:headers}).then(

            (response) => {
                if(response.status ===204){
                    appDispatch({ type: "flashMessage", value: `You deleted a account with id ${data.id} successfully.`} )
                    console.log("account was deleted.")

                }
            })
            .catch((error) => {
                    if(error.toString()==='Error: Request failed with status code 500')
                    {
                        appDispatch({ type: "flashErrorMessages", value: `Sorry, a account with id ${data.id} has been deleted or does not exist.` })

                    }else if(error.toString()==='Error: Request failed with status code 403')
                    {
                        appDispatch({ type: "flashErrorMessages", value: `Authentication went wrong.` })
                    }
                }
            )
    }



    // integrated  email confirmation function with account registration
    //


    function onSubmitS(data) {

        if (!window.confirm('Are you sure to suspend this account?')) return

        const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${appState.jwt}`
        }

        axios.put(`${api}/${data.id}`,'false',{headers:headers}).then(

            (response) => {
                if(response.status ===204){
                    appDispatch({ type: "flashMessage", value: `You suspended a account with id ${data.id} successfully.`} )
                    console.log("account was suspended.")

                }
            })
            .catch((error) => {
                    if(error.toString()==='Error: Request failed with status code 500')
                    {
                        appDispatch({ type: "flashErrorMessages", value: `Sorry, a account with id ${data.id} already suspended or does not exist.` })

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
                <h5 className="card-header">UtopiaAdmin Suspend&Delete Accounts</h5>
                <div className="card-body ">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="form-group col-3">

                            <label >Account id </label>
                            <input  name="id" type="text" {...register('id')} placeholder="Enter an Account id (required)" className={`form-control ${errors.id ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.id?.message}</div>
                        </div>

                        <div className="form-group">
                            <div className=" mid-left">

                           <button type="button"  className="btn btn-warning "   onClick={handleSubmit(onSubmitS)} >Suspend</button>
                            <>  </>
                            <button  className="btn btn-danger " onClick={() => void 0  }>Delete</button>


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

export default ManageAccount