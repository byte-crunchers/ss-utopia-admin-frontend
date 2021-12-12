import React, { useEffect, useState, useContext} from "react"
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardLink, MDBListGroup, MDBCardHeader, MDBCol, MDBRow, MDBCardImage, MDBCardText
} from 'mdb-react-ui-kit';

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
                            <MDBCardLink href='http://localhost:3000/admin/EditAccount'>Edit Account</MDBCardLink>
                            <MDBCardLink href='http://localhost:3000/admin/ViewAccount'>View Existing Accounts</MDBCardLink>
                            <MDBCardLink href='http://localhost:3000/admin/CreateAccountType'>Create Account Type</MDBCardLink>

                            <MDBCardLink href='http://localhost:3000/admin/ManageAccounts'>Delete/Suspend Account</MDBCardLink>
                        </MDBListGroup>

                    </MDBCardBody>

                </MDBCard>
            </MDBCol>
                        <MDBCol>
                            <MDBCard className= "card-mid-right card-head-down" alignment='center' border='primary' style={{ maxWidth: '26rem'}} >
                                <MDBCardHeader background='primary' className='text-white mb-3'>Card Management</MDBCardHeader>
                                <MDBCardBody>
                                    <MDBListGroup flush>
                                        <MDBCardLink href='http://localhost:3000/admin/UpdateCreditLimit'>Increase Credit Limit</MDBCardLink>
                                        <MDBCardLink href='http://localhost:3000/admin/ViewCards/credit'>View Existing Credit Cards</MDBCardLink>

                                        <MDBCardLink href='http://localhost:3000/admin/ViewCards/debit'>View Existing Debit Cards</MDBCardLink>

                                    </MDBListGroup>
                                </MDBCardBody>
                            </MDBCard>

                        </MDBCol>
            <MDBCol>
                <MDBCard className= "card-mid-left card2-head-down" alignment='center' border='primary' style={{ maxWidth: '26rem' }} >
                    <MDBCardHeader background='primary' className='text-white mb-3'>Loan Management</MDBCardHeader>
                    <MDBCardBody>

                        <MDBListGroup flush>
                            <MDBCardLink href='http://localhost:3000/admin/CreateLoanType'>Create Loan Type</MDBCardLink>
                            <MDBCardLink href='http://localhost:3000/admin/ViewLoan'>View Existing Loans</MDBCardLink>

                        </MDBListGroup>
                    </MDBCardBody>
                </MDBCard>

            </MDBCol>
            <MDBCol>
                <MDBCard className= "card-mid-right card2-head-down" alignment='center'  border='primary' style={{ maxWidth: '26rem' }} >
                    <MDBCardHeader background='primary' className='text-white mb-3'>User Management</MDBCardHeader>
                    <MDBCardBody>

                        <MDBListGroup flush>
                            <MDBCardLink href='http://localhost:3000/admin/ViewUsers'>Edit User</MDBCardLink>
                            <MDBCardLink href='http://localhost:3000/admin/ViewUsers'>View Existing Users</MDBCardLink>

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
