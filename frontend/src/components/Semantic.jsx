import React from 'react'

function semantic({ text, code }) {
    let color = null

    switch (code) {
        case "warn":
            color = "blue"
            break
        default: 
            color = "red"
    }

    const style = {
        postion: "absolute",
        textAlign: "center",
        top: "0px",
        color: color,
    }

    return (
        <div id="semantic" style={style}>{text}</div>
    )
}

export default semantic