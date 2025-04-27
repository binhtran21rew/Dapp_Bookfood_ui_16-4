import React, { useRef } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import gsap from 'gsap';
import numeral from 'numeral';


import "./blockfoodrating.scss";


import { Links } from '../../utils/constant';
import { addOrderData } from "../../context/slice/orderSlice";
import Icon from '../../utils/Icon';

function BlockFoodRating({...props}) {
    const {food} = props;
    const navigate = useNavigate();
    const { width } = useOutletContext();

    var orderSelector = useSelector((state) => state.order);
    const dispatch = useDispatch();

    const foodRefs = useRef([]);


    const handleClick = (food) => {
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

    const handleBuy = (food, e) => {
        e.stopPropagation(); 
        dispatch(addOrderData({ ...food}));
    }

    return (
        <div className='BlockFoodRating'>
            <div ref={(e) => foodRefs.current[food?.id] = e} className={`foodrating_style_wrapper row `} >
                <div className={`item-wrapper col-6`} onClick={() => handleClick(food)}>
                    <div className="food_image">
                        <img
                            src={food?.img}
                            alt={food?.name}
                            width={"100%"}
                            height={"100%"}
                        />
                    </div>
                </div>
                <div className={`item-wrapper col-4`} onClick={() => handleClick(food)}>
                    <div className="food_style_title">
                        <span className="food_name">{food?.name}</span>
                        <span className="food_detail text-truncate-1lines  mt-1">{food?.detail}</span>
                        <span className="food_price text-truncate-1lines fw-bold mt-1">${numeral(food?.price).format("0,0")}</span>
                    </div>
                    <div className="btn_rating col-2" onClick={(e) => handleBuy(food, e)}>
                        <div className="icon">
                            <Icon name="iconPlus" color="white" size="15"/>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default BlockFoodRating