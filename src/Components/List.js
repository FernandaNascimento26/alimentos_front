import React from 'react'
import '../main.css'
import { Icon } from '@mdi/react'
import { mdiDelete } from '@mdi/js'

export function List(props) {
    return (
        <div className="list">
            <ListHeader />
            { props.children }
        </div>
    )
}

export function ListHeader() {
    return (
        <div className="list-header">
            <div className="index">#</div>
            <span>Nome</span>
        </div>
    )
}

export function Item(props) {
    const { index, obj, handleDelete, detail } = props

    return (
        <div className="list-item">
            <div className="item-info" onClick={detail}>
                <div className="index">{ index }</div>
                <span>{ obj.nome }</span>
            </div>
            <div className="item-del" onClick={handleDelete}>
                <Icon path={mdiDelete} size={1} />
            </div>
        </div>
    )
}