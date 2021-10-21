import React, { useEffect, useState, useContext} from "react"
import Background from '../static/home_page.png'

function HomeGuest(props){
    return(
        <div className="homePageDiv">
            
            <img className="homePageImg" src={Background} />

        </div>
    )
}


export default HomeGuest
