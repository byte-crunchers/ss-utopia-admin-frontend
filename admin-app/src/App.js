
import Footer from "./components/Footer";
import HomeGuest from "./components/HomeGuest";
import About from "./components/About";
import Terms from "./components/Terms";

import CreateCardTypes from "./components/CreateCardTypes";
import {BrowserRouter,Switch,Route} from "react-router-dom";
import './App.css';
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import { useImmerReducer } from "use-immer"
import React, { useState, useReducer, useEffect } from "react"
import FlashMessages from "./components/FlashMessages";
import FlashErrorMessages from "./components/FlashErrorMessages";
import Header from "./components/Header";
import NotFound from "./components/NotFound";
import CreateLoanTypes from "./components/CreateLoanTypes";
import CreateAccountTypes from "./components/CreateAccountTypes";
import HomeLoggIn from "./components/HomeLoggIn";
// import ReactDOM from 'react-dom';

function App() {

    const initialState = {
        loggedIn: Boolean(localStorage.getItem("Token")),

        jwt:
           localStorage.getItem("Token"),


        flashMessages: [],
        flashErrorMessages: [],

    }


    function ourReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedIn = true
                draft.jwt = action.data
                return

            case "logout":
                draft.loggedIn = false
                return

            case "flashMessage":
                draft.flashMessages.push(action.value)
                   return

            case "flashErrorMessages":
                draft.flashErrorMessages.push(action.value)
                return

    }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, initialState)


    useEffect(() => {
        if (state.loggedIn) {
            localStorage.setItem("Token", state.jwt.toString())

        } else {
            localStorage.removeItem("Token")

        }
    }, [state.loggedIn])


  return (
      <StateContext.Provider value={state}>
          <DispatchContext.Provider value={dispatch}>
      <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <FlashErrorMessages messages={state.flashErrorMessages} />
      <Header />

      <Switch>
          <Route path="/" exact>
              < HomeGuest />
          </Route>
          <Route path="/about-us">
              <About/>
          </Route>
          <Route path="/terms">
              <Terms/>
          </Route>

          <Route path="/admin/home">
              {state.loggedIn?  <HomeLoggIn/>: <NotFound/>}
          </Route>

          <Route path="/admin/CreateCardType">
              {state.loggedIn? <CreateCardTypes/>: <NotFound/>}
          </Route>

          <Route path="/admin/CreateLoanType">
              {state.loggedIn? <CreateLoanTypes/>: <NotFound/>}
          </Route>

          <Route path="/admin/CreateAccountType">
              {state.loggedIn? <CreateAccountTypes/>: <NotFound/>}
          </Route>


      </Switch>

        <Footer />
        </BrowserRouter>
          </DispatchContext.Provider>
      </StateContext.Provider>
  );
}

export default App;
