import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartShopping,
    faPlus,
    faSearch,
    faSeedling,
    faWheatAwn,
    faArrowLeft,
    faMinus,
    faMoneyBill,
    faCreditCard,
    faWallet,
    faTicket,
    faShop,
    faTimes,
    faFilter,
    faArrowRight,
    faClock,
} from "@fortawesome/free-solid-svg-icons";


function Icon({...props}) {
    const {name, color, size} = props;
    switch(name){
        case "iconClock": return(
            <FontAwesomeIcon icon={faClock} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        case "iconArrowRight": return(
            <FontAwesomeIcon icon={faArrowRight} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        case "iconFilter": return(
            <FontAwesomeIcon icon={faFilter} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        case "iconTimes": return(
            <FontAwesomeIcon icon={faTimes} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        case "iconTimes": return(
            <FontAwesomeIcon icon={faTimes} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        case "iconShop": return(
            <FontAwesomeIcon icon={faShop} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        case "iconTicket": return(
            <FontAwesomeIcon icon={faTicket} fontSize={size ?? 20} color={color ?? "black"}/>
        )
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
        case "iconArrowLeft": return(
            <FontAwesomeIcon icon={faArrowLeft} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        case "iconMinus": return(
            <FontAwesomeIcon icon={faMinus} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        case "iconCash": return(
            <FontAwesomeIcon icon={faMoneyBill} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        case "iconCredit": return(
            <FontAwesomeIcon icon={faCreditCard} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        case "iconWallet": return(
            <FontAwesomeIcon icon={faWallet} fontSize={size ?? 20} color={color ?? "black"}/>
        )
        default: return(
            <></>
        )
    }
  
}

export default Icon;