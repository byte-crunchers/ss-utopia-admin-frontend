import React, { useEffect, useState, useContext} from "react"
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardLink, MDBListGroup, MDBCardHeader, MDBCol, MDBRow, MDBCardImage, MDBCardText
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom'

function HomeGuest(props){
    return(
        // <div className="card m-3  card-head-down" >
        //     <h5 className="card-header" >UtopiaAdmin Dashboard</h5>
            <div className="row body">

            <MDBRow className='row-cols-1 row-cols-md-2 g-4'>

            <MDBCol>
                <MDBCard className="card-mid-left card-head-down" alignment='center' border='primary' style={{ maxWidth: '26rem' }} >
                    <MDBCardHeader background='primary' className='text-white mb-3'>Account Management</MDBCardHeader>
                    <MDBCardBody>
                        <MDBListGroup flush>
                            <Link to='/admin/EditAccount'>Edit Account</Link>
                            <Link to='/admin/ViewAccount'>View Existing Accounts</Link>
                            <Link to='/admin/CreateAccountType'>Create Account Type</Link>

                            <Link to='/admin/ManageAccounts'>Delete/Suspend Account</Link>
                        </MDBListGroup>

                    </MDBCardBody>

                </MDBCard>
            </MDBCol>
                        <MDBCol>
                            <MDBCard className= "card-mid-right card-head-down" alignment='center' border='primary' style={{ maxWidth: '26rem'}} >
                                <MDBCardHeader background='primary' className='text-white mb-3'>Card Management</MDBCardHeader>
                                <MDBCardBody>
                                    <MDBListGroup flush>
                                        <Link to='/admin/UpdateCreditLimit'>Increase Credit Limit</Link>
                                        <Link to="/admin/ViewCards/credit">View Existing Credit Cards</Link>

                                        <Link to='/admin/ViewCards/debit'>View Existing Debit Cards</Link>

                                    </MDBListGroup>
                                </MDBCardBody>
                            </MDBCard>

                        </MDBCol>
            <MDBCol>
                <MDBCard className= "card-mid-left card2-head-down" alignment='center' border='primary' style={{ maxWidth: '26rem' }} >
                    <MDBCardHeader background='primary' className='text-white mb-3'>Loan Management</MDBCardHeader>
                    <MDBCardBody>

                        <MDBListGroup flush>
                            <Link to='/admin/CreateLoanType'>Create Loan Type</Link>
                            <Link to='/admin/ViewLoan'>View Existing Loans</Link>

                        </MDBListGroup>
                    </MDBCardBody>
                </MDBCard>

            </MDBCol>
            <MDBCol>
                <MDBCard className= "card-mid-right card2-head-down" alignment='center'  border='primary' style={{ maxWidth: '26rem' }} >
                    <MDBCardHeader background='primary' className='text-white mb-3'>User Management</MDBCardHeader>
                    <MDBCardBody>

                        <MDBListGroup flush>
                            <Link to='/admin/ViewUsers'>Edit User</Link>
                            <Link to='/admin/ViewUsers'>View Existing Users</Link>

                        </MDBListGroup>
                    </MDBCardBody>
                </MDBCard>


            </MDBCol>
        </MDBRow>
       </div>
         // </div>
    )
}

export default HomeGuest
