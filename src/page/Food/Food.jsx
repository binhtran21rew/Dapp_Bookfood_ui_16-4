import React, { useEffect, useRef, useState } from "react";
import { data, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import numeral from 'numeral';
import 'numeral/locales/vi';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import services from "../../utils/services";
import Icons from '../../utils/Icon';

import "./food.scss";
import { span } from "framer-motion/client";
import Icon from "../../utils/Icon";
import Popup from "../../cpns/Popup/Popup";
import { t } from "i18next";
import { Links } from "../../utils/constant";
import {getFoodTypes} from '../../utils/functionUtils';

import { 
  addOrderData,
  updateItemQuantity, 
  getItemId, 
} from "../../context/slice/orderSlice";
import BtnConfirm from "../../cpns/BtnConfirm/BtnConfirm";
import BtnBack from "../../cpns/BtnBack/BtnBack";

// gsap.registerPlugin(ScrollTrigger);


function Food() {
    const location = useLocation();
    const navigate = useNavigate();
    var orderSelector = useSelector((state) => state.order);
    const dispatch = useDispatch();
    const { food } = location.state || {};
    // const { id } = useParams();
  
    const foodRef = useRef(null);
    const btnRef = useRef(null);

    const [restaurants, setRestaurants] = useState([]);
    const [foodRestaurant, setFoodRestaurant] = useState([]);
    const [totalStars, setTotalStars] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [averageRating, setAverageRating] = useState(null);
    const [popup, setPopup] = useState(false);
    const [cart, setCart] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalOrder, setTotalOrder] = useState(0);
    const [rating, setRating] = useState(0);
    const [typeFood, setTypeFood] = useState()

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => {
        setWidth(window.innerWidth);
      };
  
      // Thêm event listener để lắng nghe sự kiện resize
      window.addEventListener('resize', handleResize);
  
      // Cleanup function: loại bỏ event listener khi component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []); 

    // useGSAP(() => {
    //   if(width > 420) return;
    //   const foodCurrent = foodRef.current;
    //   const tl = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: foodCurrent,
    //       start: "10% top",
    //       end: "10% top",
    //       toggleActions: "play none reverse none",
    //       markers: true
    //     },
    //   });


    //   tl.to(foodCurrent, {
    //     duration: .5,
    //     scale: 0.8,
    //     y: -50,
    //     ease: "power2.out"
    //   })

    // }, [])
    
    
    useEffect(() => {
      if (!food) {
        navigate("/");
        return;
      }
      setTypeFood(getFoodTypes(food));
      setTotalStars(Number(food.totalStars));
      dispatch(getItemId({id: food.id, food: food}))
      setTotalRatings(Number(food.totalRatings));
      setAverageRating(totalRatings > 0 ?  (totalStars / totalRatings).toFixed(1) : null )
    }, [food, navigate, totalRatings, totalStars]);

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

    useEffect(() => {
      const total = orderSelector.data.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const order = orderSelector.data.reduce((sum, item) => sum + item.quantity, 0);
      
      setTotalOrder(order);
      setTotalPrice(total);
    }, [orderSelector.data]);

    // useEffect(() => {
    
    //     const getData = async () => {
    //         // const resOwnerRes = await services.getRes(id);
    //         const resFood = await services.getAllFoods();
            
    //         // const filterFood = resFood.filter((data) => data.restaurantId.toString() === id);

    //         const formatDataFood = resFood.map((food) => ({
    //           id: food.id.toString(),
    //           name: food.name,
    //           price: parseInt(food.price),
    //           isVegan: food.isVegan,
    //           isGlutenFree: food.isGlutenFree,
    //           totalRatings: food.totalRatings.toString(),
    //           totalStars: food.totalStars.toString(),
    //           categoryId: food.categoryId.toString(),
    //           img: `https://gateway.pinata.cloud/ipfs/${food.img}`
    //         }));
            
    //         const rating = formatDataFood.reduce((sum, item) => sum + Number(item.totalRatings.toString()), 0);
            
    //         setRating(rating);
    //         setFoodRestaurant(formatDataFood);
    //         // setRestaurants(resOwnerRes);
    //     };

    //     getData();
    // }, [food]);

    const handleBuy = (item) => {      
        setPopup(true);
        dispatch(addOrderData({ ...item}));
    }
    

    

    const handleChangeQuanitiy = (id, type) =>{
      const cartUpdate = orderSelector.data.find(item => item.id === id);
      
      if(!cartUpdate) {
        if(type === "in"){          
          setPopup(true);
          dispatch(addOrderData({ ...food}));
        }
        
        return;
      };

      let newQuantity = cartUpdate.quantity;
      console.log(123);
      
      
      if(type === 'de'){
        newQuantity = Math.max(0, newQuantity - 1);
      }else{
        newQuantity = newQuantity + 1;
      }

      dispatch(updateItemQuantity({id: id, quantity: newQuantity}));
      dispatch(getItemId({id: id}));

    }
    
    return (
        <div className="Restaurant">
            {/* { width > 634 && popup && orderSelector.data.length !== 0 && (
              <div ref={btnRef} className="stylePopup-bottom" style={{padding: "10px 0"}}>
                <BtnConfirm  radius={28} className="d-flex justify-content-between align-items-center" onClick={() => navigate(`${Links['orders']}`)}> 
                  <div className="d-flex align-items-center" >
                    <span className="text-white fw-bold fs-5">Giỏ hàng</span>
                    <li className="text-white ms-3">{totalOrder} món</li>
                  </div>
                  <div className="text-white">{numeral(totalPrice).format('0,0 ')} vnd</div>
                </BtnConfirm>
              </div>
            )} */}
            <div style={{
              position: 'absolute',
              top: "1%",
              left: "5%",
              zIndex: 9
            }}>
                <div className="col-1" onClick={() => navigate(Links["home"])}>
                  <BtnBack color="rgb(183, 183, 183)"/>
                </div>
            </div>
            <div ref={foodRef} className="Restaurant_food" >
              <div className="food_container">
                <div className="foodItem_img">
                    <img src={food?.img} alt={food?.name} width={"100%"} />
                </div>
                <div className="styleLine d-flex flex-column">
                  <div className="foodItem_title fw-bold text-capitalize">
                      <span>{food?.name}</span>
                      <div className="foodItem_title_icon">
                        {food?.isVegan &&
                          <span><Icons name="iconSeed" color="green"/></span>
                        }
                        {!food?.isGlutenFree &&
                          <span><Icons name="iconGluten" color="green"/></span>
                        }
                        {food?.isGlutenFree &&
                          <span><Icons name="iconGluten" color="red"/></span>
                        }
                      </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex">
                      {!averageRating && (
                        <span className="text-capitalize fw-bold" style={{fontSize: 16}}>chưa có đánh giá  ⭐ ({totalRatings})</span>
                      )}
                      {averageRating && (
                        <span className="text-capitalize">{averageRating} ⭐ ({totalRatings})</span>
                      )}
                    </div>


                    <div className="cart_item_quantity d-flex justify-content-center align-items-center">
                      <div className="style_icon_add" style={{width: 20, height: 20, borderRadius: "8px"}} onClick={() => handleChangeQuanitiy(orderSelector.item.id, 'de')}>
                        <Icon name="iconMinus" size="10" color="white"/>
                      </div>
                      <span className="cart_item_text text-primary fw-bold mx-3 fs-5">
                        {orderSelector.item.quantity || 0}
                      </span> 
                      <div className="style_icon_add" style={{width: 20, height: 20, borderRadius: "8px"}} onClick={() => handleChangeQuanitiy(orderSelector.item.id, 'in')}>
                        <Icon name="iconPlus" size="10" color="white"/>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-label">Mô tả món ăn:</span> <br/>
                    <div className="mt-2"/>
                    <span>{food?.detail}</span>
                  </div>
                  <div className="my-3 d-flex align-items-center">
                    <span className="text-label">thời gian: </span>
                    <div className="me-3"/>
                    <div className="d-flex">
                        <Icon name="iconClock" />
                      <div className="me-3"/>
                      <span className="text-uppercase fw-bold">
                        {food?.time} phút
                      </span>
                    </div>
                  </div>
                  <div className="my-3 d-flex flex-column">
                    <span className="text-label">Tổng tiền: </span>
                    <div className="mt-3"/>
                    <span className="text-label fw-bold fs-4">
                      ${numeral(food?.price).format('0,0 ')}
                    </span>
                  </div>
                </div>
                {/* {width > 634 && (
                  <div className="style_rotate_icon_add mx-2 btnFood" onClick={() => handleBuy(food)}>
                    <Icon name="iconPlus" color="white" size="16"/>
                  </div>
                )} */}
                {/* {width <= 634 && ( */}
                  <div className="style_rotate_icon_add mx-2 btnFood" onClick={() => navigate(`${Links['orders']}`)}>
                    <Icon name="iconCart" color="white" size="19"/>
                    <div className="totalOrder">
                      <span>{totalOrder}</span>
                    </div>
                  </div>
                {/* )} */}
              </div>
              <div style={{marginBottom: "70px"}}/>
            </div>

            {/* <div className="restaurant row">
                <div className="col-4">
                  <img
                      src={foodRestaurant[0]?.img}
                      alt={foodRestaurant[0]?.name}
                      width={"100%"}
                  />
                </div>
                <div className="col-8">
                  <span className="text-capitalize text-truncate-2lines fw-bold">{restaurants.name} - Q{restaurants.district} - {restaurants.city}</span>
                  <span>Điểm đánh giá: {rating}</span>
                </div>
            </div> */}

            {/* <div className="Restaurant_owner">
              <span className="fs-4 text-capitalize fw-bold">Dành cho bạn</span>
              <div className="row food_wrapper">
                {foodRestaurant.map((data, id) => (
                  <div className="col-6 py-3" key={id}>
                    <div className="foodItem_img">
                        <img
                            src={data.img}
                            alt={data.name}
                            width={"100%"}
                        />
                      <div className="foodItem_img_add style_icon_add" onClick={() => handleBuy(data)}>
                        <Icon name="iconPlus" color="white" size="16"/>
                      </div>
                    </div>
                    <div className="d-flex flex-column">
                      <span className="text-capitalize fw-bold">{data.name}</span>
                      <span className="text-capitalize fw-bold mt-2">{numeral(data.price).format('0,0 ')} vnđ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
        </div>
    );
}

export default Food;
