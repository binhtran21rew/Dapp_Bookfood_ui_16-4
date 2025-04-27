import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ToastContainer, toast } from 'react-toastify';

import { Links } from '../utils/constant';
import Icon from '../utils/Icon';
import services from '../utils/services';
import { Button } from 'react-bootstrap';
import {resetLastItem, updateLastItem} from '../context/slice/orderSlice';
import { AnimatePresence } from 'framer-motion';
import BtnConfirm from '../cpns/BtnConfirm/BtnConfirm';
import numeral from 'numeral';


const orderEventChannel = new BroadcastChannel('order_placed_events');

function MainLayout() {

	const location = useLocation();
	const navigate = useNavigate();

	const pageOrder = location.pathname.startsWith(Links['orders']);
	const pageOrderDetail = location.pathname.startsWith(Links['orderDetail']);
	const pageHome = location.pathname === Links['home'];
	
	const pageCart = location.pathname === Links['carts'];
    var orderSelector = useSelector((state) => state.order);
    const dispatch = useDispatch();

	const orderRef = useRef(null); 
	const btnRef = useRef(null);

	const [restaurantNumber, setRestaurantNumber ] = useState([]);
	const [restaurant, setRestaurant] = useState([]);
	const [expand, setExpand] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

	const [totalOrder, setTotalOrder] = useState(0);
	const [totalPrice, setTotalPrice] = useState(0);

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

	// useEffect(() => {
	// 	window.scrollTo(0, 0);

	// }, []);

	useEffect(() => {
		if(orderSelector.data.length === 0 ) return;
		setRestaurantNumber([...new Set(orderSelector.data.map(item => item.restaurantId))])

	}, [orderSelector.data]);

	useEffect(() => {
		if(orderSelector.data.length === 0) return;
		const total = orderSelector.data.reduce((sum, item) => sum + item.price * item.quantity, 0);
		const order = orderSelector.data.reduce((sum, item) => sum + item.quantity, 0);

		setTotalOrder(order);
		setTotalPrice(total);
	}, [orderSelector.data]);

	
	
	useEffect(() => {
		if(!orderSelector.lastItem) return;
		
		toast.success(`Đơn hàng mới đã cập nhật ${orderSelector.lastItem}`);
		return () => {
			dispatch(resetLastItem());
		}
	}, [orderSelector.lastItem]);

	// useEffect(() => {
	// 	if(restaurantNumber.length === 0) return;
	// 	const getRes = async () => {
	// 		const res = await services.getAllRestaurants();
	// 		const filter = res.filter(item => restaurantNumber.includes(item.id.toString()));

			
	// 		setRestaurant(filter);
	// 	}

	// 	getRes();
	// }, [restaurantNumber]);


	// const handleClick = (type, idRes) => {

	// 	const currentRef = orderRef.current;
	// 	const iconTime = currentRef.querySelector('.iconTime');
	// 	const orderWrapper = currentRef.querySelector('.order_wrapper');
	// 	const restaurant = currentRef.querySelector('.restaurant');
	
	// 	const tl = gsap.timeline();

	// 	if(type === "close"){
	// 		setExpand(false);
	// 		gsap.to(iconTime, {
	// 			display: "none"
	// 		})
	// 		tl.to(restaurant, {
	// 			display: 'none'
	// 		})
	// 		tl.to(currentRef, {
	// 			right: "10%",
	// 			width: "50px",
	// 			height: "50px",
	// 			borderRadius: "50%",
	// 			bottom: "5%",
	// 		})
	// 		tl.to(orderWrapper, {
	// 			display: "flex"
	// 		})
	// 	}

	// 	if(type === "open"){
	// 		setExpand(true);

	// 		tl.to(orderWrapper,{
	// 			display:"none"
	// 		})
	// 		tl.to(currentRef, {
	// 			right: 0,
	// 			bottom: 0,
	// 			width: "100%",
	// 			height: "500px",
	// 			borderRadius: "unset"
	// 		})
	// 		tl.to(iconTime,{
	// 			duration: 0.1,
	// 			display:"block"
	// 		})
	// 		tl.to(restaurant, {
	// 			duration: 0.1,
	// 			display: 'block'
	// 		})
	// 	}

	// 	if(type === "item"){
	// 		navigate(`${Links['orders']}/${idRes}`);
	// 	}
		
	// }

	
	// console.log(orderSelector.lastItem);
	
	
	return (
		<div className={``} style={{position: 'relative'}}>
			<Outlet context={{width}}/>
			<div className="grid place-items-center h-dvh bg-zinc-900/15">
				<ToastContainer />
			</div>

			{pageHome && orderSelector.data.length !== 0 && (
              <div ref={btnRef} className="FoodItem_mobile stylePopup-bottom">
                <BtnConfirm  radius={28} className="d-flex justify-content-around  align-items-center" onClick={() => navigate(`${Links['orders']}`)}> 
                  <div className="d-flex align-items-center" >
                    <span className="text-white fw-bold fs-5">Giỏ hàng</span>
                    <li className="text-white ms-3">{totalOrder} món</li>
                  </div>
                  <div className="text-white">${numeral(totalPrice).format('0,0 ')}</div>
                </BtnConfirm>
              </div>
            )}
			{/* {!pageCart && !pageOrder && !pageOrderDetail &&(
				<div className="styleSticky_topRight" style={{top: "8%", boxShadow: "0 0 5px rgba(93, 93, 93, 0.8)", zIndex: 999}}>
					<div className='styleCenter' onClick={() => navigate(Links['carts'])}>
						<Icon name="iconCart" color="green"/>
					</div>
				</div>
			)} */}
			{/* {orderSelector.data.length > 0 && !pageOrder &&(
				<div ref={orderRef} className="styleSticky_bottomRight" >
					<div className='iconTime' style={{
						position: 'absolute',
						top: "5%",
						left: "5%",
						display: "none"
					}} onClick={() => handleClick("close")}>
						<Icon name="iconTimes"/>
					</div>
					<div className="order_wrapper styleCenter">
						<div style={{
							position: "absolute",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							top: "-13%",
							right: "-10%",
							width: 20,
							height: 20,
							background: "green",
							borderRadius: "50%"
						}} className='number'>
							<span className='text-white'>
								{restaurantNumber.length} 
							</span>
						</div>
						<div className="icon" onClick={() => handleClick("open")}>
							<Icon name="iconShop" color="green" size="24"/>
						</div>
					</div>
					<div style={{display: "none", width: "100%", height: "100%"}} className='restaurant'>
						<div className="text-center" style={{marginTop: "20px"}}>
							<span className='text-center fw-bold fs-5'>Giỏ hàng</span>
						</div>
						<div className="m-3">
							{restaurant.map((item, id) => (
								<div className="styleLineUnder" key={id} onClick={() => handleClick("item", item.id.toString())}>
									<span className='text-capitalize'>
										{item.name}
									</span>
								</div>
							))}
						</div>
					
					</div>

				</div>
			)}  */}

		</div>

	)
}

export default MainLayout