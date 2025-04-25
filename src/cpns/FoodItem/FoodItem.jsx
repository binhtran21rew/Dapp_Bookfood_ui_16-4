import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import numeral from 'numeral';
import gsap from "gsap";

import "./fooditem.scss";

import { foodContent, Links } from "../../utils/constant";
import { useNavigate, useOutletContext } from "react-router-dom";
import Icon from "../../utils/Icon";
import { addOrderData } from "../../context/slice/orderSlice";
import BtnConfirm from "../BtnConfirm/BtnConfirm";
import {arrSlice, groupByCategory, getMaxRating} from '../../utils/functionUtils'
import CarouselItem from "../Carousel/CarouselItem";
import BlockFood from "../BlockFood/BlockFood";



function FoodItem({ ...props }) {
    const { listFood } = props;
    const navigate = useNavigate();

    var orderSelector = useSelector((state) => state.order);
    const dispatch = useDispatch();

    const foodRefs = useRef([]);
    const btnRef = useRef(null);
    const positionRef = useRef(null);
    const { width } = useOutletContext();

    const [blockFood, setBlockFood] = useState([]);
    const [blockFoodName, setBlockFoodName] = useState([]);
    const [foodsRating, setFoodsRating] = useState([]);
    const [popup, setPopup] = useState(false);

    const [totalOrder, setTotalOrder] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);


    useEffect(() => {
        if (listFood.length === 0) return;
        // setBlockFood(arrSlice(listFood, 5))
        // setBlockFoodName(groupByCategory(listFood))
        setFoodsRating(getMaxRating(listFood))
    }, [listFood]);

    useEffect(() => {
        if(orderSelector.data.length === 0) return;
        const total = orderSelector.data.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = orderSelector.data.reduce((sum, item) => sum + item.quantity, 0);

        setTotalOrder(order);
        setTotalPrice(total);
    }, [orderSelector.data]);

    useEffect(() => {
        const ref = btnRef.current;
        if(!popup || !ref) return;

        gsap.fromTo(ref, {
            y: 100,
            opacity: .6
        }, {
            duration: .5,
            y: 0,
            opacity: 1,
            ease: "power2.out"
        })
        
    }, [popup]);

    
    
    return (  
        <div className="FoodItem"> 
            {popup &&  orderSelector.data.length !== 0 && (
              <div ref={btnRef} className="FoodItem_mobile stylePopup-bottom" style={{padding: "10px 0"}}>
                <BtnConfirm  radius={28} className="d-flex justify-content-around  align-items-center" onClick={() => navigate(`${Links['orders']}`)}> 
                  <div className="d-flex align-items-center" >
                    <span className="text-white fw-bold fs-5">Giỏ hàng</span>
                    <li className="text-white ms-3">{totalOrder} món</li>
                  </div>
                  <div className="text-white">{numeral(totalPrice).format('0,0 ')} vnd</div>
                </BtnConfirm>
              </div>
            )}

            {popup && orderSelector.data.length !== 0 && (
                <div className="FoodItem_cart styleSticky_topRight" style={{backgroundColor: "black", zIndex: 9999, borderRadius: "14px 8px 35px 12px"}} onClick={() => navigate(`${Links['orders']}`)}>
                    <div className="btnFood d-flex justify-content-center align-items-center w-100 h-100 pe-2">
                        <Icon name="iconCart" color="white"/>
                        <div className="totalOrder">
                            <span>{totalOrder}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="block_food_style">
                {foodsRating && (
                    <BlockFood 
                        food={foodsRating[0]}
                        setPopup={setPopup}
                        heightImage={"100%"}
                        widthImage={"100%"}
                        rating={true}
                    />
                )}
                <BlockFood 
                    food={{
                        img: "https://gateway.pinata.cloud/ipfs/QmQuAVPHCocjWxkyrxnaqhSrYu27kwsLd3B8CjBLZa9q6d",
                        name: "salad",
                        title: "Delicous salads for you healthy life",
                        detail: "We made fresh and healthy salad with diffrent recipes"
                    }}
                    setPopup={setPopup}
                    heightImage={"100%"}
                    widthImage={"100%"}
                    hightLight={true}
                    btn={true}
                    positionRef={positionRef}
                />
                <CarouselItem 
                    positionRef={positionRef}
                    listFood={listFood} 
                    setPopup={setPopup} 
                    text={"We have delicous saladsin town"} 
                    detail={"Cepteur sint occaaecat cupidatat proident, taken possession of my entire soul, like these sweet mornings of spring which i enjoy with my whole"}
                />
                <BlockFood 
                    food={{
                        img: "https://gateway.pinata.cloud/ipfs/QmQuAVPHCocjWxkyrxnaqhSrYu27kwsLd3B8CjBLZa9q6d",
                        name: "salad",
                        title: "Try our newly Salad with Avocado Combo with 6 Different type Of fresh salads",
                        detail: "Fresh and healthy salad made with our own Chef Recipe. Special healthy and-fat free dish for those who want to lose weight."
                    }}
                    setPopup={setPopup}
                    heightImage={"90%"}
                    widthImage={"90%"}
                    hightLight={false}
                />
                {/* {listFood.map((item, id) => (
                    <div key={id} className="food_style_wrapper">
                        <div className="item-wrapper"  onClick={() => handleClick(item)}>
                            <div className="food_image">
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    width={"100%"}
                                    height={"100%"}
                                />
                            </div>
                        </div>
                        <div className="item-wrapper">
                            <div className="food_style_title">
                                <span className="food_name">{item.name}</span>
                                <span className="food_detail text-truncate-2lines">{item.detail}</span>
                                <span className="food_price text-truncate-2lines">{numeral(item.price).format("0,0")} vnd</span>

                            </div>
                            <div className="item-button">
                                {(id % 3 === 0) && (
                                    <div className="d-flex justify-content-center align-items-center" onClick={() => handleBuy(item)}>
                                        <span className="text-capitalize">đặt hàng</span>
                                        <div className="icon">
                                            <Icon name="iconArrowLeft" color="white" size="12"/>
                                        </div>
                                    </div>
                                )}
                                {(id % 3 !== 0) && (
                                    <div className="icon" onClick={() => handleBuy(item)}>
                                        <Icon name="iconPlus" color="white" size="12"/>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))} */}
            </div>

            {/* <div className="block_foods">
                {blockFood.map((data, index) => (
                    <div key={index} className="" >
                        <span className="Food_title text-capitalize fw-bold fs-5">
                            {index === 0 && foodContent[0]}
                            {index === 1 && foodContent[1]}
                        </span>
                        <div className="FoodItem_block">
                            {data.map((value, id) => (
                                    <div ref={(e) => foodRefs.current[value.id] = e} className={`FoodItem_wrapper`} key={id} >
                                        <div className="FoodItem_content" onClick={() => handleClick(value)}>
                                            <span className="foodItem_name fw-bold text-capitalize">
                                                {value.name}
                                            </span>
                                            <span className="foodItem_price fw-bold text-uppercase">
                                                {numeral(value.price).format('0,0 ')} vnđ
                                            </span>
                                            <div className="mt-3">
                                                <span className="fw-bold">
                                                    Mô tả:  <br/>
                                                </span>
                                                <span className="text-truncate-1lines">
                                                    {value.detail}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="foodItem_img" onClick={() => handleClick(value)}>
                                            <img
                                                className=""
                                                src={value.img}
                                                alt={value.name}
                                                width={"100%"}
                                                height={"100%"}
                                            />
                                        </div>
                                        <div className="FoodItem_add">
                                            <div className="style_icon_add" onClick={() => handleBuy(value)}>
                                                <Icon name="iconPlus" color="white" size="12"/>
                                            </div>
                                        </div>
                                    </div>
                        
                            ))}
                        </div>
                    </div>
                ))}
            </div> */}
            {/* <div style={{height: "140px"}}/> */}
                
        </div>
    );
}

export default FoodItem;
