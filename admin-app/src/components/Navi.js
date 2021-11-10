import React, {useEffect,useContext} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import { withRouter } from "react-router-dom"
import {Nav,Navbar,NavDropdown} from "react-bootstrap";
import { Link } from 'react-router-dom'

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
                    <Nav.Link as={Link} to="/admin/home">UtopiaAdmin</Nav.Link>

                    <NavDropdown title="Account  ">
                        <NavDropdown.Item as={Link} to="/admin/ViewAccount">View Accounts</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/EditAccount">Edit Accounts</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/admin/ManageAccounts">Suspend&Delete Accounts</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/admin/CreateAccountType">Create New Account Type</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Card  ">
                        <NavDropdown.Item as={Link} to="/admin/ViewCards/credit">View Credit Cards </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/ViewCards/debit">View Debit Cards </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/admin/UpdateCreditLimit">Update Credit Limit </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Loan  ">
                        <NavDropdown.Item as={Link} to="/admin/ViewLoan">View Loans</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/admin/CreateLoanType">Create New Loan Type</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Users  ">
                        <NavDropdown.Item as={Link} to="/admin/ViewUsers">User Management</NavDropdown.Item>
                    </NavDropdown>

                </Nav>
            </Navbar.Collapse>

            <div className="profileDiv">
                <Nav>
                    <NavDropdown title="&#128578; admin">
                        <NavDropdown.Item href="/admin/EditUsers/?id=1">Edit Profile</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={handleLogout}>Sign Out</NavDropdown.Item>
                    </NavDropdown>

                </Nav>
            </div>

            {/* <button onClick={handleLogout}  className="btn btn-sm btn-secondary">Sign Out</button> */}

        </Navbar>

    </div>
    )

}

export default withRouter(Navi)
