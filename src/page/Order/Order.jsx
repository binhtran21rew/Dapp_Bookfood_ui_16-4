import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import numeral from "numeral";

import "./order.scss";
import Icon from "../../utils/Icon";
import { Links, paymentOption, optionSize } from "../../utils/constant";
import {updateItemQuantity, getItemId} from '../../context/slice/orderSlice';
import Popup from "../../cpns/Popup/Popup";
import BtnConfirm from "../../cpns/BtnConfirm/BtnConfirm";


function Orders() {
    const location = useLocation();
    const navigate = useNavigate();
    var orderSelector = useSelector((state) => state.order);
    const dispatch = useDispatch();
    const [isQuantity, setIsQuantity] = useState({});
    const [payment, setPayment] = useState(0);
    const [useRewardPoints, setUseRewardPoints] = useState(false);
    const [popup, setPopup] = useState(false);
    const [foodUpdate, setFoodUpdate] = useState(null);
    const [orderNote, setOrderNote] = useState({
      note: "",
      size: "",
    }); 
    const sizeOptions = {
      L: "lớn",
      M: "vừa",
      S: "nhỏ"
    }

    const [total, setTotal] = useState(0);
    useEffect(() => {

      if(orderSelector.data.length === 0) return;
      const total = orderSelector.data.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotal(total);

      
    }, [orderSelector.data]);


    const handleQuantity = (id) => {
      setIsQuantity(prev => (
        {...prev, [id]: !prev[id]}
      ))
    } 

    const handleUpdateFood = (id) => {
      setPopup(true);
      dispatch(getItemId({id: id}))
    }    

    const handleChangeQuanitiy = (id, type) =>{
      const cartUpdate = orderSelector.data.find(item => item.id === id);

      if(!cartUpdate) return;

      let newQuantity = cartUpdate.quantity;

      if(type === 'de'){
        newQuantity = Math.max(1, newQuantity - 1);
      }else{
        newQuantity = newQuantity + 1;
      }

      dispatch(updateItemQuantity({id: id, quantity: newQuantity}))
    }
    
    const handlePayment = () => {
      console.log(123);
      
    }


    const handleChangeNote = (value, type) => {
      if(type === "size"){
        setOrderNote((prev) => ({ ...prev, [type]: sizeOptions[value] }));
  
      }else{
        setOrderNote((prev) => ({ ...prev, [type]: value }));
      }
    
    }
    console.log(orderSelector.item, 'aasaa');
    
    return (
        <>
          {popup && (
            <div className="stylePopup-full" style={{zIndex: 9999}}>
                <Popup setIsOpen={setPopup}>
                  
                    <div>
                      <img src={orderSelector.item.img} alt={orderSelector.item.name} width={"100%"}/>
                    </div>
                    <div className="stylePopup-full" style={{ top: "25%"}}>
                      <div className="d-flex justify-content-between text-capitalize fw-bold">
                        <span>{orderSelector.item.name}</span>
                        <span>{numeral(orderSelector.item.price).format("0,0")}</span>
                      </div>
                      <div className="my-3">
                        <span className="text-capitalize">chọn kích cỡ món ăn</span>
                        <div className="mb-3"/>
                        {optionSize.map((data,id) => (
                          <div className="p-2">
                            <span className="text-capitalize">{data.label}</span>
                            <input 
                              type="radio"
                              name="size"
                              value={data.value}
                              checked={orderNote.size === data.value}
                              onChange={(e) => handleChangeNote(e.target.value, "size")}
                              className="mx-3"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="my-5">
                        <span>Thêm ghi chú cho quán</span>
                        <div className="mb-3"/>

                        <input 
                          placeholder="nhập ghi chú..."
                          className="my-3"
                          style={{width: "99%", height: "70px", borderRadius: "10px", border: '1px solid black'}}
                        />
                      </div>

                      <div className="">
                      <div className="cart_item_quantity d-flex justify-content-around align-items-center">
                        <span className="style_icon_add" style={{width: 20, height: 20}} onClick={() => handleChangeQuanitiy(orderSelector.item.id, 'de')}>
                          <Icon name="iconMinus" size="10" color="white"/>
                        </span>
                        <span className="cart_item_text text-primary fw-bold mx-2">
                          {orderSelector.item.quantity}
                        </span> 
                        <span className="style_icon_add" style={{width: 20, height: 20}} onClick={() => handleChangeQuanitiy(orderSelector.item.id, 'in')}>
                          <Icon name="iconPlus" size="10" color="white"/>
                        </span>
                      </div>
                      </div>
                    </div>

                </Popup>
            </div>
          )}
          <div className="Order">
            <div className="Order_top d-flex pt-3">
                <div className="col-1" onClick={() => navigate(-1)}>
                    <Icon name="iconArrowLeft" size="14" />
                </div>
            </div>
            <div className="my-4 d-flex justify-content-between align-items-center">
                <span className="fw-bold fs-5">Tóm tắt đơn hàng</span>
                <span className="text-primary fw-bold">Thêm món</span>
            </div>
            <div className="Order_cart">
                {orderSelector.data.map((data, id) => (
                    <div
                        key={id}
                        className="d-flex cart_wrapper_item justify-content-between"
                        onClick={() => handleUpdateFood(data.id)}
                    >
                        <div className="col-10 d-flex">
                            <div className="cart_item_img">
                                <img
                                    src={data.img}
                                    alt={data.name}
                                    width={"100%"}
                                />
                            </div>
                            <div className="ms-3 d-flex flex-column justify-content-around">
                                <span className="cart_item_text fw-bold  text-uppercase ">
                                    {data.name}
                                </span>
                                  <div>
                                    <span className="cart_item_text text-primary fw-bold">
                                      Chỉnh sửa
                                    </span>
                                  </div>

                            </div>
                        </div>

                        <div className="col-2 d-flex flex-column align-items-end">
                            <span className="cart_item_text">
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
                <span className="cart_item_text">Tổng tạm tính</span>
                <span className="cart_item_text">{numeral(total).format("0,0")} vnd</span>
            </div>
          </div>
          <div className="Order">
              <span className="fw-bold fs-5">Thông tin thanh toán</span>
            <div className="py-4">
              {paymentOption.map((data, id) => (
                <div className="row">
                  <div className="col-1">
                    <Icon name={data.icon}/>
                  </div>
                  <div className="col-11 d-flex justify-content-between">
                    <span className="text-capitalize ms-3">{data.label}</span>
                    <input 
                      type="radio"
                      label={data.label}
                      name="size"
                      value={id}
                      className="text-capitalize"
                      onChange={(e) =>  setPayment(e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
          <div className="Order">
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
          <div className="stylePopup-bottom">
              <div className="d-flex justify-content-between" style={{margin: "20px 20px",}}>
                <span>Tổng cộng</span>
                <span className="fw-bold">{numeral(total).format("0,0")} vnd</span>
              </div>

              <BtnConfirm radius={8} onClick={() => handlePayment()}> 
                <span className="text-white fw-bold ms-3 fs-5">Đặt đơn</span>
              </BtnConfirm>
          </div>
        </>
    );
}

export default Orders;
