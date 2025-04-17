import React from 'react'
import { Navbar, Nav, Container } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';


import {Links} from '../../utils/constant'
import Icon from '../../utils/Icon';

import './navbar.scss'

function HomeNavbar() {
    const { t, i18n } = useTranslation();
  
    const navigate = useNavigate(); 
  
    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
    };

    return (
        <Navbar bg="black" variant="dark" expand="lg" className='HeaderNavBar Block_header_container'>
            <Container className=''>
            {/* <button onClick={() => changeLanguage('en')}>English</button>
            <button onClick={() => changeLanguage('vi')}>Tiếng Việt</button> */}
                <Nav className="flex-row me-auto text-capitalize" >
                    <Nav.Link className='nav_item' onClick={()=> navigate(Links['home'])} >
                        <Icon name="iconHome" color="white"/>
                        {t("home")}
                    </Nav.Link>
                    <Nav.Link className='nav_item'onClick={()=> navigate(Links['categories'])}>
                        <Icon name="iconList" color="white"/>
                        {t("history")}
                    </Nav.Link>
                    <Nav.Link className='nav_item'onClick={()=> navigate(Links['orders'])}>
                        <Icon name="iconCart" color="white"/>
                        {t("history")}
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>



    )
}

export default HomeNavbar