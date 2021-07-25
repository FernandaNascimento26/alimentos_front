import React, { useEffect, useState } from 'react';
import M from 'materialize-css';
import './main.css'
import { Icon } from '@mdi/react';
import { mdiFilter, mdiClose } from '@mdi/js';
import axios from 'axios';

// Components
import { Header } from './Components/Header'
import { CentralBox } from './Components/CentralBox';
import { List, Item } from './Components/List'

var instances = []
var editIngs = []

export function MainPage(props) {
    
    useEffect(() => {
        var elem = document.querySelectorAll('.chips')
        instances = M.Chips.init(elem)
    }, [])
    
    useEffect(() => {
        axios.get('http://localhost:8080/alimentos').then(res => {
            setAlimentos(res.data)
            setFilteredAli(res.data)
        });
    }, [])

    const [alimentos, setAlimentos] = useState([])
    const [nome, setNome] = useState("")
    const [editNome, setEditNome] = useState("")
    const [editId, setEditId] = useState()
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("")
    const [filterOption, setFilterOption] = useState("include")
    const [filteredAli, setFilteredAli] = useState([])
    const [dropDown, setDropDown] = useState('none')
    const [modal, setModal] = useState('none')
    
    const filterAlimentos = (search, filter, filterOption) => {
        // Filtro por nome
        let perName = []
        if (search.length === 0) {
            perName = alimentos
        } else {
            for (let i = 0; i < alimentos.length; i++) {
                let nome = alimentos[i].nome.toUpperCase()
                if (nome.includes(search.toUpperCase())) {
                    perName.push(alimentos[i])
                }
            }
        }

        //Filtro por ingredientes
        let perNameAndIngredients = []

        if (filter.length === 0) {
            setFilteredAli(perName)
        } else if (filterOption === "include") {
            for (let i = 0; i < perName.length; i++) {
                let ingredientes = perName[i].ingredientes

                for (let j = 0; j < ingredientes.length; j++) {
                    let ing = ingredientes[j].toUpperCase()

                    if (ing.includes(filter.toUpperCase())) {
                        perNameAndIngredients.push(perName[i])
                        break;
                    }
                }
            }

            setFilteredAli(perNameAndIngredients)
        } else {
            for (let i = 0; i < perName.length; i++) {
                let ingredientes = perName[i].ingredientes
                let has = false

                for (let j = 0; j < ingredientes.length; j++) {
                    let ing = ingredientes[j].toUpperCase()

                    if (ing.includes(filter.toUpperCase())) {
                        has = true
                        break;
                    }
                }

                if (!has) {
                    perNameAndIngredients.push(perName[i])
                }
            }

            setFilteredAli(perNameAndIngredients)
        }
    }

    const dropDownList = () => {
        if (dropDown === 'none') {
            setDropDown('flex')
        } else {
            setDropDown('none')
        }
    }
    
    const handleNome = (e) => {
        setNome(e.target.value)
    }

    const handleSearch = (e) => {
        setSearch(e.target.value)
        filterAlimentos(e.target.value, filter, filterOption)
    }

    const handleFilterOption = (e) => {
        setFilterOption(e.target.value)
        filterAlimentos(search, filter, e.target.value)
    }
    
    const handleFilter = (e) => {
        setFilter(e.target.value)
        filterAlimentos(search, e.target.value, filterOption)
    }
    
    const handleCreateAlimento = () => {
        // Recupera os ingredientes
        let chipsData = instances[1].chipsData
        console.log(instances)
        let chips = []
        chipsData.forEach(chip => {
            chips.push(chip.tag)
        })

        let json = {
            nome: nome,
            ingredientes: chips
        }
    
        axios.post("http://localhost:8080/alimentos/create", json).then(res => {
            axios.get('http://localhost:8080/alimentos').then(res => {
                setAlimentos(res.data)
                setFilteredAli(res.data)
            });
        })

        // Limpa os formulários
        setNome("")
        setSearch("")
        setFilter("")
        instances[1].chipsData = []
        document.querySelectorAll(".chip").forEach(elem => {
            elem.remove()
        })
    }

    const handleDeleteAlimento = (id) => {
        if (window.confirm("Deseja excluir este alimento?")) {
            axios.delete("http://localhost:8080/alimentos/delete/" + id).then(res => {
                axios.get('http://localhost:8080/alimentos').then(res => {
                    setAlimentos(res.data)
                    setFilteredAli(res.data)
                });
            })
        }

        // Limpa as pesquisas
        setSearch("")
        setFilter("")
    }

    const detailModal = (id) => {
        axios.get('http://localhost:8080/alimentos/' + id).then(res => {
            let data = []
            let ingredientes = res.data[0].ingredientes
            ingredientes.forEach(ing => {
                data.push({tag: ing})
            })
            let options = {
                data: data
            }
            var elem = document.querySelectorAll('#new')
            editIngs = M.Chips.init(elem, options)
            setEditNome(res.data[0].nome)
            setEditId(res.data[0].id)
        })
        setModal('flex')
    }

    const handleEditName = (e) => {
        setEditNome(e.target.value)
    }

    const handleEdit = () => {
        let chipsData = editIngs[0].chipsData
        let chips = []
        chipsData.forEach(chip => {
            chips.push(chip.tag)
        })

        let json = {
            nome: editNome,
            ingredientes: chips
        }
        axios.put("http://localhost:8080/alimentos/update/" + editId, json).then(res => {
            axios.get('http://localhost:8080/alimentos').then(res => {
                setAlimentos(res.data)
                setFilteredAli(res.data)
            });
        })
        closeDetailModal()
    }

    const closeDetailModal = () => {
        setEditNome("")
        setEditId(null)
        setModal('none')
    }

    return (
        <div>
            <div className="modal-container" style={{display: modal}}>
                <div className="modal-box">
                    <div className="modal-header">
                        <div className="underline-header">
                            Alimento
                        </div>
                        <div className="close" onClick={closeDetailModal}>
                            <Icon path={mdiClose} size={1} />
                        </div>
                    </div>
                    <div className="form-row">
                        <label>Nome:</label>
                        <input value={editNome} onChange={handleEditName} />
                    </div>
                    <label>Ingredientes:</label>
                    <div className="chips ing-chips" id="new">
                        <input placeholder="Adicionar novos" />
                    </div>
                    <button className="submit-btn" onClick={handleEdit}>Editar</button>
                </div>
            </div>
            <Header title="Sistema de Alimentos" />
            <CentralBox title="Alimentos">
                
                <div className="section">
                    <div className="form-row">
                        <input placeholder="Search..." value={search} onChange={handleSearch} />
                        <div className="drop-down">
                            <button className="drop-down-btn" onClick={dropDownList}>
                                <Icon 
                                    path={mdiFilter}
                                    size={1}
                                        />
                            </button>
                            <div className="drop-down-menu" style={{display: dropDown}}>
                                <form onChange={handleFilterOption}>
                                    <label>
                                        <input name="contem" type="radio" value="include" defaultChecked />
                                        <span>Contém</span>
                                    </label>
                                    <label>
                                        <input name="contem" type="radio" value="exclude" />
                                        <span>Não contém</span>
                                    </label>
                                </form>
                                <input onChange={handleFilter} value={filter} />
                            </div>
                        </div>
                    </div>
                    <List>
                        { filteredAli.map((row, index) => (
                            <Item index={index+1} obj={row} handleDelete={() => handleDeleteAlimento(row.id)} detail={() => detailModal(row.id)} key={row.id} />
                        )) }
                    </List>
                </div>

                <div className="section">
                    <div className="underline-header">
                        Adicionar Alimento
                    </div>
                    <div className="form">
                        <div className="form-row">
                            <label htmlFor="nome">Nome:</label>
                            <input id="nome" onChange={handleNome} value={nome} />
                        </div>
                        <label>Ingredientes:</label>
                        <div className="chips ing-chips">
                            <input />
                        </div>
                        <small>Digite um ingrediente e pressione Enter!</small>
                    </div>
                    
                    <button className="submit-btn" onClick={handleCreateAlimento}>
                        Salvar
                    </button>
                </div>
            </CentralBox>
            
        </div>
    )
}