import React from 'react'
import Icon from '../../utils/Icon'
import { useNavigate } from 'react-router-dom'

function BtnBack({...props}) {
    const navigate = useNavigate();
    return (
        <div className="bg_btn" onClick={() => navigate(-1)}>
            <Icon name="iconArrowLeft" size={props.size || 16} />
        </div>
    )
}

export default BtnBack