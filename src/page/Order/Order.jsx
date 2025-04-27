import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import numeral from "numeral";
import Lottie from "lottie-react";
import gsap from "gsap";


import "./order.scss";
import Icon from "../../utils/Icon";
import { Links, paymentOption} from "../../utils/constant";
import {
  getItemId, 
  placeOrder, 
  updateLastItem,
} from '../../context/slice/orderSlice';
import BtnConfirm from "../../cpns/BtnConfirm/BtnConfirm";
import services from '../../utils/services'
import cartEmpty from '../../assets/animation/cartEmpty.json';
import modifiedBGColor from "../../assets/animation/modifiedBGColor";
import BtnBack from "../../cpns/BtnBack/BtnBack";

function Orders() {
    const location = useLocation();
    const navigate = useNavigate();
    const {id} = useParams();    

    var orderSelector = useSelector((state) => state.order);
    const dispatch = useDispatch();
 
    const foodRefs = useRef([]);



    const [payment, setPayment] = useState(0);
    const [useRewardPoints, setUseRewardPoints] = useState(false);
    const [total, setTotal] = useState(0);

  

    // useEffect(() => {
    //   if(!id) return;
      
    //   dispatch(getOrder({id}));
    // }, [id]);

  


    useEffect(() => {

      if(orderSelector.data.length === 0) return;
      const total = orderSelector.data.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotal(total);

      
    }, [orderSelector.data]);






    const handleUpdateFood = (id) => {
      const ref = foodRefs.current[id];

      gsap.fromTo(ref, {
        scale: 0.9,
        opacity: 0.8,
        ease: "power3.in"
      }, {
        duration: .2,
        scale: 1,
        opacity: 1,
        ease: "power3.in",
        onComplete: () => {
          dispatch(getItemId({id}));
          navigate(Links["foodChange"]);
        }
      })
      
    }    
    

    
    const handlePayment = async () => {
      const arrIdFood = orderSelector.data.map(item => item.id);
      const objNote = JSON.stringify(orderSelector.note);
      const arrQuantity = orderSelector.data.map(item => item.quantity);
      const paymentMethod = payment;

      // console.log(arrIdFood, objNote, arrQuantity, paymentMethod);
      dispatch(placeOrder({id}))
      
      try {
        const tx = await services.createOrder(paymentMethod, arrIdFood, arrQuantity, useRewardPoints, objNote);
        // const tx = await services.createOrderAndListenOnce(paymentMethod, arrIdFood, arrQuantity, useRewardPoints, objNote);
    

        dispatch(updateLastItem({id: tx.events.OrderPlacedEvent.returnValues.id.toString()}))
        
        dispatch(placeOrder({id}));
        setTotal(0);
        navigate('/');

        // alert("Tạo đơn thành công!");
      } catch (e) {
        console.log("Tạo đơn thất bại!", e);
        
      }
    }

    

  
    
    return (
        <div className="Order">

          {orderSelector.data.length === 0 && (
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div>
                <Lottie
                    animationData={modifiedBGColor(
                        cartEmpty,
                        235,
                        235,
                        235
                    )}
                    loop
                    autoplay
                    style={{ width: 300, height: 300 }}
                />
              </div>

              <div>
                <span className="text-black fw-bold">Bạn chưa có đơn hàng nào của nhà hàng này!</span>
              </div>

              <div className="stylePopup-bottom ">
                  <BtnConfirm radius={8} onClick={() => navigate(`${Links['home']}`)}> 
                    <span className="text-white fw-bold ms-3 fs-5">Món ngon hôm nay</span>
                  </BtnConfirm>
              </div>
            </div>
          )}

          {orderSelector.data.length !== 0 && (
            <>
              <div className="Order_container">
                <div className="Order_top d-flex pt-3 justify-content-between">
                  <BtnBack />
                </div>
                <div className="my-4 d-flex justify-content-between align-items-center">
                    <span className="fw-bold fs-4">Tóm tắt đơn hàng</span>
                    <span className="text-primary fw-bold fs-5 text-black" style={{cursor: "pointer"}} onClick={() => navigate(Links['home'])}>Thêm món</span>
                </div>
                <div className="Order_cart">
                    {orderSelector.data.map((data, id) => (
                        <div
                          ref={(e) => foodRefs.current[data.id] = e}
                          key={id}
                          className="d-flex cart_wrapper_item justify-content-between"
                          onClick={() => handleUpdateFood(data.id)}
                          style={{cursor: "pointer"}}
                        >
                            <div className="col-10 d-flex">
                                <div className="cart_item_img">
                                    <img
                                        src={data.img}
                                        alt={data.name}
                                        width={"100%"}
                                    />
                                </div>
                                <div className="ms-3 d-flex flex-column justify-content-evenly">
                                    <span className="cart_item_text fw-bold  text-uppercase ">
                                        {data.name}
                                    </span>
                                      <div>
                                        <span className="cart_item_text text-primary fw-bold text-black">
                                          Chỉnh sửa
                                        </span>
                                      </div>

                                </div>
                            </div>

                            <div className="col-2 d-flex flex-column justify-content-around align-items-end">
                                <span className="cart_item_text fw-bold">
                                    {numeral(data.price).format("0,0")}
                                </span>
                                <span className="style_cart_quantity">
                                    {data.quantity}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="d-flex justify-content-between pb-4">
                    <span className="cart_item_text fw-bold fs-4">Tổng tạm tính</span>
                    <span className="cart_item_text fs-5 fw-bold">${numeral(total).format("0,0")}</span>
                </div>
              </div>
              <div className="Order_container">
                <span className="fw-bold fs-5">Thông tin thanh toán</span>
                <div className="py-4">
                  {paymentOption.map((data, id) => (
                    <div className="row" onClick={() => setPayment(id)} key={id}>
                      <div className="col-1">
                        <Icon name={data.icon}/>
                      </div>
                      <div className="col-11 d-flex justify-content-between">
                        <span className="text-capitalize ms-3">{data.label}</span>
                        <input 
                          type="radio"
                          name="payment"
                          value={id}
                          checked={Number(payment) === id }
                          className="text-capitalize"
                          onChange={(e) =>  setPayment(e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
              <div className="Order_container">
                  <span className="fw-bold fs-5 ">Ưu đãi</span>
                <div className="row py-4">
                  <div className="col-1">
                    <Icon name="iconTicket"/>
                  </div>

                  <div className="col-11 d-flex justify-content-between">
                    <span className="text-capitalize ms-3">Áp dụng ưu đãi để giảm giá</span>
                    <input 
                      type="checkbox"
                      name="size"
                      className="text-capitalize"
                      onChange={(e) => setUseRewardPoints(e.target.checked)}
                    />
                  </div>

                </div>
              </div>

              <div className="blank"/>
              <div className="stylePopup-bottom">
                <div className="d-flex justify-content-between" style={{padding: "20px 20px 0 20px ",}}>
                  <span className="fs-5 fw-bold">Tổng cộng</span>
                  <span className="fw-bold">${numeral(total).format("0,0")}</span>
                </div>

                <BtnConfirm radius={8} onClick={() => handlePayment()}> 
                  <span className="text-white fw-bold ms-3 fs-5">Đặt đơn</span>
                </BtnConfirm>
              </div>
            </>
          )}
          

        </div>
    );
}

export default Orders;
