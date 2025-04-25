import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import gsap from 'gsap';
import numeral from 'numeral';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import './carouselitem.scss';

import Icon from "../../utils/Icon";
import { foodContent, Links } from "../../utils/constant";
import { addOrderData } from "../../context/slice/orderSlice";
//Ilovebebank



function CarouselItem({...props}) {
    const {listFood, setPopup, text, detail, positionRef} = props;
    const navigate = useNavigate();

    var orderSelector = useSelector((state) => state.order);
    const dispatch = useDispatch();

    const foodRefs = useRef([]);
    const btnRef = useRef(null);

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

    
    const handleClick = (food) => {
        
        const foodRef = foodRefs.current[food.id];
        if(!foodRef) return;

        const tl = gsap.timeline();

        tl.fromTo(foodRef, {
            duration: 0.5,
            scale: 0.85,
            opacity: .8,
            ease: "power3.in"
        }, {
            duration: 0.5,
            scale: 1,
            opacity: 1,
            ease: 'power2.inOut'
        })

        navigate(`${Links['food']}`, {state: {food}})
    }

    const handleBuy = (e, food) => {
        e.stopPropagation(); 
        setPopup(true);
        dispatch(addOrderData({ ...food}));
    }
    
  return (
    <div ref={positionRef} className='CarouselItem'>
        <div className='d-flex flex-row'>
            <div className="Food_content_item ">
                <Swiper 
                    slidesPerView={width <= 634 && 2 || width >= 1050 && 3 || 2} 
                    slidesPerGroup={1}
                    loop={true}
                    modules={[Pagination]}
                    pagination={true}
                    className='swiper_wrapper'
                >
                    {listFood.map((item, id) => (
                        <Fragment >
                            <SwiperSlide className='swiper-slide-custom' style={{display: 'flex', justifyContent: "center", alignItems:"center"}} key={item.id}>
                            <div ref={(e) => foodRefs.current[item.id] = e}  className="food_style_wrapper" onClick={() => handleClick(item)}>
                                <div className="item-wrapper">
                                    <div className="food_image">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            width={"100%"}
                                            height={"100%"}
                                        />
                                    </div>
                                </div>
                                <div className="item-wrapper">
                                    <div className="food_style_title">
                                        <span className="food_name text-truncate-1lines" >{item.name}</span>
                                        <span className="food_detail text-truncate-2lines">{item.detail}</span>
                                        <span className="food_price text-truncate-2lines fw-bold mt-2">${numeral(item.price).format("0,0")}</span>
                                        <div className='mt-5'/>
                                        <div className="d-flex justify-content-center" style={{position: "absolute", bottom: "-5%", left: width <= 634 ? "36%" : "38%", zIndex: 3}} onClick={(e) => handleBuy(e, item)}>
                                            <div className="item-button">
                                                <div className="icon" >
                                                    <Icon name="iconPlus" color="white" size="12"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </SwiperSlide>
                        </Fragment>
                    ))}

                </Swiper>
            </div>
            <div className="Food_content col-4 d-flex flex-column justify-content-center align-items-center px-3">
                <span className='Food_content_title ' style={{fontSize: "24px"}}>{text}</span>
                <span className='Food_content_detail d-flex flex-grow mt-3' style={{fontSize: "12px"}}>{detail}</span>

            </div>

        </div>

    </div>
  )
}

export default CarouselItem