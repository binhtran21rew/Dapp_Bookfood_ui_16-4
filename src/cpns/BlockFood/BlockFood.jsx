import React, { useRef } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import gsap from 'gsap';
import numeral from 'numeral';

import "./blockfood.scss";
import { Links } from '../../utils/constant';
import { addOrderData } from "../../context/slice/orderSlice";
import Icon from '../../utils/Icon';

function BlockFood({...props}) {
    const {food,  widthImage, heightImage, hightLight = false, btn=false,  positionRef=null} = props;
    const navigate = useNavigate();
    const { width } = useOutletContext();

    var orderSelector = useSelector((state) => state.order);
    const dispatch = useDispatch();

    const foodRefs = useRef([]);
    


    const handleBuy = (food) => {
        if(positionRef){
            positionRef.current?.scrollIntoView({
                behavior: "smooth", // cuộn mượt
                block: "center",     // bắt đầu từ đầu khối
            });
        }
    }

    
    return (
        <div className={`BlockFood`}>
            <div ref={(e) => foodRefs.current[food?.id] = e} className={`foodrating_style_wrapper`} >
                <div className={`item-wrapper    ${hightLight ? "hightlight" : ""}`} >
                    <div className="food_image" style={{width: widthImage, height: heightImage}}>
                        <img
                            src={food?.img}
                            alt={food?.name}
                            width={"100%"}
                            height={"100%"}
                        />
                    </div>
                </div>
                <div className={`item-wrapper ${hightLight ? "hightlight" : "" }  `}>
                    <div className="food_style_title">

                        <span className="food_name">{food?.title}</span>
                        <span className={`food_detail text-truncate-2lines `}>{food?.detail}</span>

                        {btn && (
                            <div className="item-button p-2" >
                                <div className="d-flex justify-content-center align-items-center" onClick={() => handleBuy(food)}>
                                    <span className="text-capitalize">View Menu</span>
                                    <div className="icon">
                                        <Icon name="iconArrowLeft" color="white" size="12"/>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    )
}

export default BlockFood