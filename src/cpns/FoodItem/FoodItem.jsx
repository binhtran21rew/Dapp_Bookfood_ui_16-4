import React, { useEffect, useRef, useState } from "react";

import "./fooditem.scss";

import { foodContent, Links } from "../../utils/constant";
import { useNavigate } from "react-router-dom";



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


    const [blockFood, setBlockFood] = useState([]);


    useEffect(() => {
        if (listFood.length === 0) return;
        setBlockFood(arrSlice(listFood, 5))
    }, [listFood]);


    
    const handleClick = (food, restaurantId) => {
        navigate(`${Links['restaurant']}/${restaurantId}`, {state: {food}})
    }

    

    return (  
        <div className="FoodItem"> 

            {blockFood.map((data, index) => (
                <div key={index} className="" >
                    <span className="Food_title text-capitalize">
                        {index === 0 && foodContent[0]}
                        {index === 1 && foodContent[1]}
                    </span>
                    <div className="FoodItem_block">
                        {data.map((value, id) => (
                            <div className={`FoodItem_wrapper`} key={id} onClick={() => handleClick(value, value.restaurantId)}>
                                <div className="FoodItem_content">
                                    <span className="foodItem_name fw-bold text-capitalize">
                                        {value.name}
                                    </span>
                                    <span className="foodItem_price fw-bold text-uppercase">
                                        {value.price} vnđ
                                    </span>
                                </div>
                                <div className="foodItem_img">
                                    <img
                                        className="foodItem_img"
                                        src={value.img}
                                        alt={value.name}
                                        width={100}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
                
        </div>
    );
}

export default FoodItem;
