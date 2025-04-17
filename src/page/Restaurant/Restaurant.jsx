import React, { useEffect, useState } from "react";
import { data, useLocation, useNavigate, useParams } from "react-router-dom";
import numeral from 'numeral';
import 'numeral/locales/vi';

import services from "../../utils/services";
import Icons from '../../utils/Icon';

import "./restaurant.scss";
import { span } from "framer-motion/client";
import Icon from "../../utils/Icon";
import Popup from "../../cpns/Popup/Popup";


function Restaurant() {
    const location = useLocation();
    const navigate = useNavigate();
    const { food } = location.state || {};
    const { id } = useParams();

    const [restaurants, setRestaurants] = useState([]);
    const [foodRestaurant, setFoodRestaurant] = useState([]);
    const [totalStars, setTotalStars] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [averageRating, setAverageRating] = useState(null);
    const [popup, setPopup] = useState(false);
    const [cart, setCart] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        if (!food) {
            navigate("/");
        }

        setTotalStars(Number(food.totalStars));
        setTotalRatings(Number(food.totalRatings));
        setAverageRating(totalRatings > 0 ?  (totalStars / totalRatings).toFixed(1) : null )
    }, [food]);

    useEffect(() => {
        const getData = async () => {
            const resOwnerRes = await services.getRes(id);
            const resFood = await services.getAllFoods();

            const filterFood = resFood.filter((data) => data.categoryId.toString() === id);

            const formatDataFood = filterFood.map((food) => ({
              id: food.id.toString(),
              name: food.name,
              price: parseInt(food.price),
              isVegan: food.isVegan,
              isGlutenFree: food.isGlutenFree,
              totalRatings: food.totalRatings,
              totalStars: food.totalStars,
              restaurantId: food.restaurantId.toString(),
              categoryId: food.categoryId,
              img: `https://gateway.pinata.cloud/ipfs/${food.img}`
            }));
            

            setFoodRestaurant(formatDataFood);
            setRestaurants(resOwnerRes);
        };

        getData();
    }, [id]);

    const handleBuy = (item) => {
        setPopup(true);
        if (!quantities[item.id] || quantities[item.id] <= 0) {
          quantities[item.id] = 1;
        }

        
        setCart((prevCart) => {
          const existingItem = prevCart.find((food) => food.id === item.id);
          if (existingItem) {
            return prevCart.map((food) =>
              food.id === item.id ? { ...food, quantity: quantities[item.id] } : food
            );
          } else {
            return [...prevCart, { ...item, quantity: quantities[item.id] }];
          }
        });
    }

    useEffect(() => {
      const total = cart.reduce((sum, item) => sum + item.price, 0);
      setTotalPrice(total);
    }, [cart]);

    console.log(cart);
    
    


    return (
        <div className="Restaurant">
            {width <= 420 && popup && (
              <div style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                height: 100,
                backgroundColor: "white",
                zIndex: 9999
                
              }}>
                <Popup setIsOpen={setPopup}>
                  <div className="d-flex justify-content-between" style={{
                    backgroundColor: "rgb(18, 158, 0)",
                    margin: "20px 20px",
                    padding: 10,
                    borderRadius: 28,
                  }}>
                    <div className="d-flex align-items-center">
                      <span className="text-white fw-bold ms-3 fs-5">Giỏ hàng</span>
                      <li className="text-white ms-3">{cart.length} món</li>
                    </div>
                    <div className="text-white">{numeral(totalPrice).format('0,0 ')} vnd</div>
                  </div>
                </Popup>
              </div>
            )}
            <div className="Restaurant_food">
                <div className="foodItem_img">
                    <img src={food.img} alt={food.name} width={350} />
                </div>
                <div className="foodItem_title fw-bold text-capitalize">
                    <span>{food.name}</span>
                    <div className="foodItem_title_icon">
                      {food.isVegan &&
                        <span><Icons name="iconSeed" color="green"/></span>
                      }
                      {!food.isGlutenFree &&
                        <span><Icons name="iconGluten" color="green"/></span>
                      }
                      {food.isGlutenFree &&
                        <span><Icons name="iconGluten" color="red"/></span>
                      }
                    </div>
                </div>
                <div>
                  <span className="text-uppercase">
                    {numeral(food.price).format('0,0 ')} vnđ
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
            </div>

            <div className="Restaurant_owner">
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
            </div>
        </div>
    );
}

export default Restaurant;
