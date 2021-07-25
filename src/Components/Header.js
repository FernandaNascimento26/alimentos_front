import React from 'react'
import '../main.css'

export function Header(props) {
    const { title } = props
    return (
        <div className="header">
            { title }
        </div>
    )
}