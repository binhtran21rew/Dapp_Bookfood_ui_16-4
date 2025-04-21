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

import { addOrderData } from "../../context/slice/orderSlice";
import BtnConfirm from "../../cpns/BtnConfirm/BtnConfirm";

// gsap.registerPlugin(ScrollTrigger);


function Food() {
    const location = useLocation();
    const navigate = useNavigate();
    var orderSelector = useSelector((state) => state.order);
    const dispatch = useDispatch();
    const { food } = location.state || {};
    // const { id } = useParams();
  
    const foodRef = useRef(null);

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
      setTotalRatings(Number(food.totalRatings));
      setAverageRating(totalRatings > 0 ?  (totalStars / totalRatings).toFixed(1) : null )
    }, [food, navigate, totalRatings, totalStars]);

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
    

    useEffect(() => {
      if(orderSelector.data.length === 0) return;
      const total = orderSelector.data.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const order = orderSelector.data.reduce((sum, item) => sum + item.quantity, 0);

      setTotalOrder(order);
      setTotalPrice(total);
    }, [orderSelector.data]);

    
    
    return (
        <div className="Restaurant">
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
            <div style={{
              position: 'absolute',
              top: "1%",
              left: "5%"
            }}>
                <div className="col-1" onClick={() => navigate(-1)}>
                    <Icon name="iconArrowLeft" size="20" />
                </div>
            </div>
            <div ref={foodRef} className="Restaurant_food" >
              <div className="food_container">
                <div className="foodItem_img">
                    <img src={food?.img} alt={food?.name} width={"100%"} />
                </div>
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
                <div>
                  <span className="text-uppercase">
                    {numeral(food?.price).format('0,0 ')} vnđ
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  {!averageRating && (
                    <span className="text-capitalize">chưa có đánh giá  ⭐ ({totalRatings})</span>
                  )}
                  {averageRating && (
                    <span className="text-capitalize">{averageRating} ⭐ ({totalRatings})</span>
                  )}
                  <div className="style_icon_add mx-2" onClick={() => handleBuy(food)}>
                    <Icon name="iconPlus" color="white" size="16"/>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="fw-bold">Mô tả món ăn:</span> <br/>
                  <div className="mt-2"/>
                  <span>{food?.detail}</span>
                </div>
                <div className="mt-3">
                  <span className="fw-bold">Chú thích:</span>
                  <ul>
                    {typeFood?.map((data, id) => (
                      <li key={id}>{data}</li>
                    ))}
                  </ul>
                  {/* <li>{getFoodTypes(food?.isGlutenFree)}</li>
                  <li>{getFoodTypes(food?.isVegan)}</li> */}

                </div>
              </div>
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
