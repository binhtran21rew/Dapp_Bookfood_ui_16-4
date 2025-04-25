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
    const {food, setPopup, widthImage, heightImage, hightLight = false, btn=false, rating=false, positionRef=null} = props;
    const navigate = useNavigate();
    const { width } = useOutletContext();

    var orderSelector = useSelector((state) => state.order);
    const dispatch = useDispatch();

    const foodRefs = useRef([]);
    

    const handleClick = (food) => {
        if(!rating) return;
        const foodRef = foodRefs.current[food?.id];
        if(!foodRef) return;

        const tl = gsap.timeline();

        tl.fromTo(foodRef, {
            duration: 0.5,
            scale: 0.85,
            opacity: .8,
            ease: "power3.in"
        }, {
            duration: 0.5,
            scale: 1,
            opacity: 1,
            ease: 'power2.inOut'
        })

        navigate(`${Links['food']}`, {state: {food}})
    }

    const handleBuy = (food) => {
        if(positionRef){
            positionRef.current?.scrollIntoView({
                behavior: "smooth", // cuộn mượt
                block: "start",     // bắt đầu từ đầu khối
              });
            
        }
        if(!rating) return;
        setPopup(true);
        dispatch(addOrderData({ ...food}));
    }

    
    return (
        <div className={`BlockFood ${rating ? "py-4" : ""}`}>
            <div ref={(e) => foodRefs.current[food?.id] = e} className={`foodrating_style_wrapper ${rating && "rating"}`} >
                <div className={`item-wrapper  ${rating ? "foodRating_img" : ""}  ${hightLight ? "hightlight" : ""}`}  onClick={() => handleClick(food)}>
                    <div className="food_image" style={{width: widthImage, height: heightImage}}>
                        <img
                            src={food?.img}
                            alt={food?.name}
                            width={"100%"}
                            height={"100%"}
                        />
                    </div>
                </div>
                <div className={`item-wrapper ${hightLight ? "hightlight col-4" : "" }  ${!hightLight && !rating ? "col-6" : "" } ${rating ? "foodRating_content" : ""}`} onClick={() => handleClick(food)}>
                    <div className="food_style_title">
                        {rating && (
                            <>
                                <span className="food_name">{food?.name}</span>
                                <span className="food_detail_rating text-truncate-1lines">{food?.detail}</span>
                                <span className="food_price text-truncate-1lines fw-bold mt-2">${numeral(food?.price).format("0,0")}</span>
                            </>
                        )}

                        {!rating && (
                            <>
                                <span className="food_name">{food?.title}</span>
                                <span className={`food_detail text-truncate-2lines `}>{food?.detail}</span>
                            </>
                        )}
                    </div>
                    {btn && (
                        <div className="item-button p-2" >
                            <div className="d-flex justify-content-center align-items-center" onClick={() => handleBuy(food)}>
                                <span className="text-capitalize" style={{fontSize: "14px"}}>View Menu</span>
                                <div className="icon">
                                    <Icon name="iconArrowLeft" color="white" size="12"/>
                                </div>
                            </div>
                        </div>
                    )}
                    {rating && 
                        <div className="btn_rating col-1">
                            <div className="icon">
                                <Icon name="iconArrowRight" color="white" size="12"/>
                            </div>
                        </div>
                    }
                </div>

            </div>
        </div>
    )
}

export default BlockFood