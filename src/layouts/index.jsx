import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';


import { Links } from '../utils/constant';
import Icon from '../utils/Icon';
import services from '../utils/services';

function MainLayout() {

	const location = useLocation();
	const navigate = useNavigate();
	const pageOrder = location.pathname.startsWith(Links['orders']);
	const pageOrderDetail = location.pathname.startsWith(Links['orderDetail']);
	
	const pageCart = location.pathname === Links['carts'];
    var orderSelector = useSelector((state) => state.order);

	const [restaurantNumber, setRestaurantNumber ] = useState([]);
	const [restaurant, setRestaurant] = useState([]);
	const [expand, setExpand] = useState(false);
	const orderRef = useRef(null); 

	useEffect(() => {
		if(orderSelector.data.length === 0 ) return;
		setRestaurantNumber([...new Set(orderSelector.data.map(item => item.restaurantId))])

	}, [orderSelector.data]);

	// useEffect(() => {
	// 	if(restaurantNumber.length === 0) return;
	// 	const getRes = async () => {
	// 		const res = await services.getAllRestaurants();
	// 		const filter = res.filter(item => restaurantNumber.includes(item.id.toString()));

			
	// 		setRestaurant(filter);
	// 	}

	// 	getRes();
	// }, [restaurantNumber]);

	useEffect(() => {
		let orderEventSubscription;
		const subscribeToOrderAdded = async () => {
			orderEventSubscription = await services.listenForPlaceOrder((order) => {
				console.log("listen order page chính:", order);
				
				// const formatDataFood = {
				// 	id: food.id.toString(),
				// 	name: food.name,
				// 	detail: food.detail,
				// 	price: parseInt(food.price),
				// 	isVegan: food.isVegan,
				// 	isGlutenFree: food.isGlutenFree,
				// 	totalRatings: food.totalRatings.toString(),
				// 	totalStars: food.totalStars.toString(),
				// 	categoryId: food.categoryId.toString(),
				// 	img: `https://gateway.pinata.cloud/ipfs/${food.img}`
				// };
				// setListFood((prev) => {
				// 	if (!prev.find(item => item.id === formatDataFood.id)) {
				// 		return [...prev, formatDataFood];
				// 	}
				// 	return prev;
				// });
			});
		};
		subscribeToOrderAdded();
		return () => {
		  if (orderEventSubscription && orderEventSubscription.removeAllListeners) {
			  orderEventSubscription.removeAllListeners('data');
			  orderEventSubscription.removeAllListeners('error');
			  console.log("Đã hủy đăng ký lắng nghe sự kiện OrderAdded.");
		  }
	  };
	  }, []);
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


	
	
	return (
		<div className={`bg_main`} style={{position: 'relative'}}>
			<Outlet />
			{!pageCart && !pageOrder && !pageOrderDetail &&(
				<div className="styleSticky_topRight" style={{top: "8%"}}>
					<div className='styleCenter' onClick={() => navigate(Links['carts'])}>
						<Icon name="iconCart" color="green"/>
					</div>
				</div>
			)}
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