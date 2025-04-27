import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import numeral from 'numeral';
import gsap from "gsap";
import { motion } from "framer-motion";

import './foodchange.scss';


import BtnConfirm from '../../cpns/BtnConfirm/BtnConfirm';
import { Links, optionSize } from '../../utils/constant';
import {
    updateItemQuantity, 
    getItemId, 
    updateNote, 
    removeOrderItem,
    resetItem,
    addOrderData,
  } from '../../context/slice/orderSlice';
import Icon from '../../utils/Icon';

function FoodChange({...props}) {
    // const {food, setPopup, popup} = props;

    const location = useLocation();
    const navigate = useNavigate();

    const {food} = location.state || {};

    
    var orderSelector = useSelector((state) => state.order);
    const dispatch = useDispatch();
    
    const optionFoodRef = useRef(null);
    const optionFoodBtnRef = useRef(null);
    

    const [foodSelect, setFoodSelect] = useState();
    const [quanity, setQuantiy] = useState(0);
    useEffect(() => {
        const noFoodFromLocation = !food || (typeof food === 'object' && food !== null && !Object.keys(food).length);
        const noFoodFromOrder = !orderSelector.item || (typeof orderSelector.item === 'object' && orderSelector.item !== null && !Object.keys(orderSelector.item).length);

        if (noFoodFromLocation && noFoodFromOrder) {
            navigate(Links["home"]);
        }
    }, [food, orderSelector.item, navigate, Links]);
    
    useEffect(() => {
        if(!Object.keys(orderSelector.item).length) {
            // navigate(Links["home"]);
            return
        };
        setFoodSelect(orderSelector.item);
        console.log("orderSelector.item", orderSelector.item);
        
    }, [orderSelector.item]);
    
    useEffect(() => {
        if(!food || !Object.keys(food).length){
            // navigate(Links["home"]);
            return
        };
        const filter = orderSelector.data.filter((data) => data.id === food.id)

        
        if(filter.length !== 0){
            console.log("fitler", filter[0]);
            setFoodSelect(filter[0]);
            return;
        }
        
        console.log("food",food);
        setFoodSelect(food);

    }, [food]);



    

    
    // useEffect(() => {
    //     if(food){
    //         setFoodSelect(food)
    //     }else{
    //         setFoodSelect(orderSelector.item)
            
    //     }
    // }, [orderSelector.item, food]);

    const sizeOptions = {
        L: "lớn",
        M: "vừa",
        S: "nhỏ"
    }

    // const handleQuantity = (id) => {
    //     setIsQuantity(prev => (
    //       {...prev, [id]: !prev[id]}
    //     ))
    // } 

    // useEffect(() => {
    //     const ref = optionFoodRef.current;
    //     const tbtnRef = optionFoodBtnRef.current;
    //     if( !ref || !tbtnRef ) return;
  
    //     const tl = gsap.timeline();
    //     tl.fromTo(ref, {
    //       y: "200%",
    //       opacity: .8,
    //       ease: "power3.in"
    //     }, {
    //       duration: .6,
    //       y: 0,
    //       opacity: 1,
    //       ease: "power3.in",
    //     })
  
    //     gsap.fromTo(tbtnRef, {
    //       y: "200%",
    //       opacity: .8,
    //       ease: "power3.in"
    //     }, {
    //       duration: .6,
    //       y: 0,
    //       opacity: 1,
    //       ease: "power3.in",
    //     })
    //   }, []);


    const handleChangeQuanitiy = (id, type) =>{
        const cartUpdate = orderSelector.data.find(item => item.id === id);
        if(food){
            if(!cartUpdate) {
                if(type === "in"){          
                    dispatch(addOrderData({ ...food}));
                }
                
                return;
            };
    
            let newQuantity = cartUpdate.quantity;
            
            if(type === 'de'){
                newQuantity = Math.max(0, newQuantity - 1);
            }else{
                newQuantity = newQuantity + 1;
            }
    
            dispatch(updateItemQuantity({id: id, quantity: newQuantity}));
            dispatch(getItemId({id: id}));

            return;
        }
        
        if(!cartUpdate) return;

        let newQuantity = cartUpdate.quantity;

        if(type === 'de'){
            newQuantity = Math.max(1, newQuantity - 1);
        }else{
            newQuantity = newQuantity + 1;
        }

        dispatch(updateItemQuantity({id: id, quantity: newQuantity}));
        dispatch(getItemId({id: id}));

    }

    const handleChangeNote = (value, type, id) => {           
        dispatch(updateNote({id, type, value, sizeOptions}))
        
    }

    const handleRemoveItem = (id) => {
        // const ref = optionFoodRef.current;
        // const btnRef = optionFoodBtnRef.current;
        // gsap.to(btnRef, {
        //     duration: .5,
        //     y: "200%",
        //     opacity: .8,
        //     ease: "power3.in",
        // })
        // gsap.to(ref, {
        //   onStart: () => {
        //   },
        //   duration: .5,
        //   y: "200%",
        //   opacity: .8,
        //   ease: "power3.in",
  
        //   onComplete: () => {

        //   }
        // })
        dispatch(removeOrderItem({id}));
        // setPopup(!setPopup);
        navigate(-1)
    }

    const handleClick = () => {
        dispatch(resetItem());
        navigate(-1);
    }

    
    return (
        <div className='FoodChange'>
            <div ref={optionFoodRef} className="popup_order" >
                <div className="popup_order_image d-flex justify-content-center ">
                    <img src={foodSelect?.img} alt={foodSelect?.name} />
                </div>
                <div className="popup_order_option px-5">
                <div className="d-flex justify-content-between text-capitalize fw-bold">
                    <span className="fs-3">{foodSelect?.name}</span>
                    <span className="fs-4">{numeral(foodSelect?.price).format("0,0")} vnd</span>
                </div>
                <div className="my-3 d-flex justify-content-between align-items-center">
                    <span className="text-label">bỏ chọn món ăn:</span>
                    <div className="mb-3"/>
                    <div className="style_cart_quantity" style={{border: "1px solid red", boxShadow: "0 0 4px red"}} onClick={() => handleRemoveItem(foodSelect?.id)}>
                    <Icon name="iconTimes"/>
                    </div>
                </div>

                <div className="my-4 d-flex justify-content-between">
                    <span className="text-label">Cập nhật số lượng:</span>
                    <div className="cart_item_quantity d-flex justify-content-center align-items-center">
                    <div className="style_icon_add me-3" style={{width: 20, height: 20}} onClick={() => handleChangeQuanitiy(foodSelect?.id, 'de')}>
                        <Icon name="iconMinus" size="10" color="white"/>
                    </div>
                    <span className="cart_item_text text-primary fw-bold mx-2 fs-5 text-black">
                        {foodSelect?.quantity || 0}
                    </span> 
                    <div className="style_icon_add ms-3" style={{width: 20, height: 20}} onClick={() => handleChangeQuanitiy(foodSelect?.id, 'in')}>
                        <Icon name="iconPlus" size="10" color="white"/>
                    </div>
                    </div>
                </div>
                <div className="my-3">
                    <span className="text-label">chọn kích cỡ món ăn:</span>
                    <div className="mb-3"/>
                    {optionSize.map((data,id) => {
                    
                        const currentNote = orderSelector.note.find(note => note.id === foodSelect?.id);
                        const isChecked = currentNote ? currentNote.size === data.label : false; // Hoặc so sánh với sizeOptions[data.value]
                        
                        return(
                        <div className="p-2" onClick={() => handleChangeNote(data.value, "size", foodSelect?.id)} key={id}>
                            <span className="text-capitalize">{data.label}</span>
                            <input 
                            type="radio"
                            name="size"
                            value={data.value}
                            checked={isChecked}
                            onChange={(e) => handleChangeNote(e.target.value, "size", foodSelect?.id)}
                            className="mx-3"
                            />
                        </div>
                        )
                    })}
                </div>

                <div className="my-5">
                    <span className="text-label">Thêm ghi chú món ăn</span>
                    <div className="mb-3"/>

                    <input 
                    placeholder="nhập ghi chú..."
                    className="my-3 p-3"
                    value={orderSelector.note.find(note => note.id === foodSelect?.id)?.note || ""}
                    style={{width: "99%", height: "70px", borderRadius: "10px", border: '1px solid black'}}
                    onChange={(e) => handleChangeNote(e.target.value, "note", foodSelect?.id)}
                    />
                </div>
                
            </div>
            
            </div>    
        </div>
    )
}

export default FoodChange