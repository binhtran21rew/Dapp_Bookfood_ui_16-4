import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import numeral from "numeral";
import Lottie from "lottie-react";


import "./order.scss";
import Icon from "../../utils/Icon";
import { Links, paymentOption, optionSize } from "../../utils/constant";
import {updateItemQuantity, getItemId, updateNote, getOrder, placeOrder, removeOrderItem} from '../../context/slice/orderSlice';
import Popup from "../../cpns/Popup/Popup";
import BtnConfirm from "../../cpns/BtnConfirm/BtnConfirm";
import services from '../../utils/services'
import cartEmpty from '../../assets/animation/cartEmpty.json';
import modifiedBGColor from "../../assets/animation/modifiedBGColor";

function Orders() {
    const location = useLocation();
    const navigate = useNavigate();
    const {id} = useParams();    
  
    var orderSelector = useSelector((state) => state.order);
    const dispatch = useDispatch();



    const [isQuantity, setIsQuantity] = useState({});
    const [payment, setPayment] = useState(0);
    const [useRewardPoints, setUseRewardPoints] = useState(false);
    const [popup, setPopup] = useState(false);

  

    useEffect(() => {
      if(!id) return;
      
      dispatch(getOrder({id}));
    }, [id]);

  
    const sizeOptions = {
      L: "lớn",
      M: "vừa",
      S: "nhỏ"
    }

    const [total, setTotal] = useState(0);
    useEffect(() => {

      if(orderSelector.order.length === 0) return;
      const total = orderSelector.order.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotal(total);

      
    }, [orderSelector.order]);


    const handleQuantity = (id) => {
      setIsQuantity(prev => (
        {...prev, [id]: !prev[id]}
      ))
    } 

    const handleUpdateFood = (id) => {
      
      setPopup(true);
      dispatch(getItemId({id}))
    }    

    const handleChangeQuanitiy = (id, type) =>{
      const cartUpdate = orderSelector.order.find(item => item.id === id);

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
    
    const handlePayment = async () => {
      const arrIdFood = orderSelector.order.map(item => item.id);
      const objNote = JSON.stringify(orderSelector.note);
      const arrQuantity = orderSelector.order.map(item => item.quantity);
      const paymentMethod = payment;


      
      try {
        const tx = await services.createOrder(paymentMethod, arrIdFood, arrQuantity, useRewardPoints, objNote);
        dispatch(placeOrder({id}));
        setTotal(0);
        console.log("Giao dịch hoàn tất:", tx);
        alert("Tạo đơn thành công!");
      } catch (e) {
        alert("Tạo đơn thất bại!", e);
      }
    }


    const handleChangeNote = (value, type, id) => {           
      dispatch(updateNote({id, type, value, sizeOptions}))
      
    }

    const handleRemoveItem = (id) => {
      dispatch(removeOrderItem({id}))
      setPopup(!setPopup);
    }

    
    return (
        <>
          {popup && (
            <div className="stylePopup-full" style={{zIndex: 9999}}>
                    <div>
                      <img src={orderSelector.item.img} alt={orderSelector.item.name} width={"100%"}/>
                    </div>
                    <div className="stylePopup-full" style={{ top: "25%"}}>
                      <div className="d-flex justify-content-between text-capitalize fw-bold">
                        <span>{orderSelector.item.name}</span>
                        <span>{numeral(orderSelector.item.price).format("0,0")} vnd</span>
                      </div>
                      <div className="my-3 d-flex justify-content-between align-items-center">
                        <span className="text-capitalize">bỏ chọn món ăn</span>
                        <div className="mb-3"/>
                        <div className="style_cart_quantity" style={{border: "1px solid red", boxShadow: "0 0 4px red"}} onClick={() => handleRemoveItem(orderSelector.item.id)}>
                          <Icon name="iconTimes"/>
                        </div>
                      </div>
                      <div className="my-3">
                        <span className="text-capitalize">chọn kích cỡ món ăn</span>
                        <div className="mb-3"/>
                        {optionSize.map((data,id) => {
                          
                            const currentNote = orderSelector.note.find(note => note.id === orderSelector.item.id);
                            const isChecked = currentNote ? currentNote.size === data.label : false; // Hoặc so sánh với sizeOptions[data.value]
                            
                            return(
                              <div className="p-2" onClick={() => handleChangeNote(data.value, "size", orderSelector.item?.id)} key={id}>
                                <span className="text-capitalize">{data.label}</span>
                                <input 
                                  type="radio"
                                  name="size"
                                  value={data.value}
                                  checked={isChecked}
                                  onChange={(e) => handleChangeNote(e.target.value, "size", orderSelector.item?.id)}
                                  className="mx-3"
                                />
                              </div>
                            )
                        })}
                      </div>

                      <div className="my-5">
                        <span>Thêm ghi chú cho quán</span>
                        <div className="mb-3"/>

                        <input 
                          placeholder="nhập ghi chú..."
                          className="my-3"
                          value={orderSelector.note.find(note => note.id === orderSelector.item.id)?.note || ""}
                          style={{width: "99%", height: "70px", borderRadius: "10px", border: '1px solid black'}}
                          onChange={(e) => handleChangeNote(e.target.value, "note", orderSelector.item.id)}
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
                    <div className="stylePopup-bottom">
                      <BtnConfirm radius={8} onClick={() => setPopup(false)}> 
                        <span className="text-white fw-bold ms-3 fs-5">Cập nhật giỏ hàng</span>
                      </BtnConfirm>
                    </div>
            </div>
          )}
          {orderSelector.order.length === 0 && (
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

              <div className="stylePopup-bottom">
                  <BtnConfirm radius={8} onClick={() => navigate(-1)}> 
                    <span className="text-white fw-bold ms-3 fs-5">Món ngon hôm nay</span>
                  </BtnConfirm>
              </div>
            </div>
          )}

          {orderSelector.order.length !== 0 && (
            <>
              <div className="Order">
                <div className="Order_top d-flex pt-3 justify-content-between">
                    <div className="col-1" onClick={() => navigate(-1)}>
                        <Icon name="iconArrowLeft" size="14" />
                    </div>
                </div>
                <div className="my-4 d-flex justify-content-between align-items-center">
                    <span className="fw-bold fs-5">Tóm tắt đơn hàng</span>
                    <span className="text-primary fw-bold" onClick={() => navigate(-1)}>Thêm món</span>
                </div>
                <div className="Order_cart">
                    {orderSelector.order.map((data, id) => (
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
          )}
        </>
    );
}

export default Orders;
