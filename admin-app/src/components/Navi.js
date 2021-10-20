import React, {useEffect,useContext} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import { withRouter } from "react-router-dom"
import {Nav,Navbar,NavDropdown} from "react-bootstrap";

function Navi(props){
    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)




    function handleLogout() {
        appDispatch({ type: "logout" })
        appDispatch({ type: "flashMessage", value: "You have successfully logged out." })
        props.history.push("/");
    }
    return(
    <div>
        <Navbar bg="navbar navbar-dark bg-primary" variant="light"
                sticky="top" expand="sm" collapseOnSelect>


            <Navbar.Toggle className="coloring" />
            <Navbar.Collapse>
                <Nav>
                    <Nav.Link href="/admin/home">UtopiaAdmin</Nav.Link>

                    <NavDropdown title="Account  ">
                        <NavDropdown.Item href="/admin/ViewAccount">View Accounts</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/admin/ManageAccounts">Manage Accounts</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/admin/CreateAccountType">Create New Account Type</NavDropdown.Item>
                    </NavDropdown>


                    <NavDropdown title="Card  ">
                        <NavDropdown.Item href="/admin/ViewCards/credit">View Credit Cards </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/admin/ViewCards/debit">View Debit Cards </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/admin/UpdateCreditLimit">Update Credit Limit </NavDropdown.Item>
                    </NavDropdown>


                    <NavDropdown title="Loan  ">
                        <NavDropdown.Item href="/admin/ViewLoan">View Loans</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/admin/CreateLoanType">Create New Loan Type</NavDropdown.Item>
                    </NavDropdown>


                </Nav>
            </Navbar.Collapse>
            <button onClick={handleLogout}  className="btn btn-sm btn-secondary">
                Sign Out
            </button>
        </Navbar>

    </div>
    )

}

export default withRouter(Navi)
