import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import numeral from 'numeral';

import "./fooditem.scss";

import { foodContent, Links } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import Icon from "../../utils/Icon";
import { addOrderData } from "../../context/slice/orderSlice";
import BtnConfirm from "../BtnConfirm/BtnConfirm";



function arrSlice(arr,  blockSize){
    const res = [];
    const temp = [...arr];
    const block = temp.splice(0, blockSize);
    res.push(block, temp);

    return res;
}
function FoodItem({ ...props }) {
    const { listFood } = props;
    const navigate = useNavigate();

    var orderSelector = useSelector((state) => state.order);
    const dispatch = useDispatch();

    const [blockFood, setBlockFood] = useState([]);
    const [popup, setPopup] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    const [totalOrder, setTotalOrder] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (listFood.length === 0) return;
        setBlockFood(arrSlice(listFood, 5))
    }, [listFood]);

    useEffect(() => {
        if(orderSelector.data.length === 0) return;
        const total = orderSelector.data.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = orderSelector.data.reduce((sum, item) => sum + item.quantity, 0);

        setTotalOrder(order);
        setTotalPrice(total);
    }, [orderSelector.data]);

    
    const handleClick = (food) => {
        navigate(`${Links['food']}`, {state: {food}})
    }

    
    const handleBuy = (food) => {
        setPopup(true);
        dispatch(addOrderData({ ...food}));
    }
    return (  
        <div className="FoodItem"> 
            {width <= 420 && popup && orderSelector.data.length !== 0 && (
              <div className="stylePopup-bottom" style={{padding: "10px 0"}}>
                <BtnConfirm  radius={28} className="d-flex justify-content-between align-items-center" onClick={() => navigate(`${Links['orders']}`)}> 
                  <div className="d-flex align-items-center" >
                    <span className="text-white fw-bold fs-5">Giỏ hàng</span>
                    <li className="text-white ms-3">{totalOrder} món</li>
                  </div>
                  <div className="text-white">{numeral(totalPrice).format('0,0 ')} vnd</div>
                </BtnConfirm>
              </div>
            )}
            {blockFood.map((data, index) => (
                <div key={index} className="" >
                    <span className="Food_title text-capitalize">
                        {index === 0 && foodContent[0]}
                        {index === 1 && foodContent[1]}
                    </span>
                    <div className="FoodItem_block">
                        {data.map((value, id) => (
              
                                <div className={`FoodItem_wrapper`} key={id} >
                                    <div className="FoodItem_content" onClick={() => handleClick(value)}>
                                        <span className="foodItem_name fw-bold text-capitalize">
                                            {value.name}
                                        </span>
                                        <span className="foodItem_price fw-bold text-uppercase">
                                            {value.price} vnđ
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
            <div style={{height: "140px"}}/>
                
        </div>
    );
}

export default FoodItem;
