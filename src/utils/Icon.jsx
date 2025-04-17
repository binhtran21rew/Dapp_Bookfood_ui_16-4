import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faPlus, faSearch, faSeedling, faWheatAwn } from '@fortawesome/free-solid-svg-icons'


function Icon({...props}) {
    const {name, color, size} = props;
    switch(name){
        case "iconCart": return(
            <FontAwesomeIcon icon={faCartShopping} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        case "iconPlus": return(
            <FontAwesomeIcon icon={faPlus} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        case "iconSearch": return(
            <FontAwesomeIcon icon={faSearch} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        case "iconSeed": return(
            <FontAwesomeIcon icon={faSeedling} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        case "iconGluten": return(
            <FontAwesomeIcon icon={faWheatAwn} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        default: return(
            <></>
        )
    }
  
}

export default Icon;