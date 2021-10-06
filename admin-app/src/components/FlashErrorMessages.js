import React, { useEffect } from "react"

function FlashErrorMessages(props) {
    return (
        <div id="top-message" className="container">
        <div className="floating-alerts">
            {props.messages.map((msg, index) => {
                return (
                    <div key={index} className="alert alert-danger text-center floating-alert shadow-sm" role="alert">
                        {msg}
                    </div>
                )
            })}
        </div>
        </div>
    )
}

export default FlashErrorMessages
