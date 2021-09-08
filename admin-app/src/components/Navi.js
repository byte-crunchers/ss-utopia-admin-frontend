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
                    <Nav.Link href="/">UtopiaAdmin</Nav.Link>

                    <NavDropdown title="Account  ">
                        <NavDropdown.Item to="#products/tea">Create New Account Type</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#products/promo">Create New Promo</NavDropdown.Item>
                    </NavDropdown>


                    <NavDropdown title="Card  ">
                        <NavDropdown.Item href="/admin/CreateCardType">Create New Card Type</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#products/promo">Create New Promo</NavDropdown.Item>
                    </NavDropdown>


                    <NavDropdown title="Loan  ">
                        <NavDropdown.Item href="/admin/CreateLoanType">Create New Loan Type</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#products/promo">Create New Promo</NavDropdown.Item>
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
