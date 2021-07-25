import React from 'react'
import '../main.css'

export function CentralBox(props) {
    const { title } = props
    return (
        <div className="main-container">
                <div className="central-box">
                    <div className="underline-header box-header">
                        { title }
                    </div>
                    <div className="box-content">
                        { props.children }
                    </div>
                </div>
            </div>
    )
}