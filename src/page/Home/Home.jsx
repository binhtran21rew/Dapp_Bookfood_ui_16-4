import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { useOutletContext } from 'react-router-dom';
import { Button, Form, FormControl } from 'react-bootstrap';
import gsap from 'gsap';


import './home.scss';

import {groupByCategory} from '../../utils/functionUtils';
import FoodItem from '../../cpns/FoodItem/FoodItem';
import services from '../../utils/services';
import BtnConfirm from '../../cpns/BtnConfirm/BtnConfirm';
import Icon from '../../utils/Icon'
import BlockFood from '../../cpns/BlockFood/BlockFood';
import { useSelector } from 'react-redux';


function Home() {

  const [listFood, setListFood] = useState([]);
  var orderSelector = useSelector((state) => state.order);

  const filterRef = useRef(null);
  const searchRef = useRef(null);
  const navCateRef = useRef([]);
  const inputRef = useRef(null);
  const { width } = useOutletContext();

  const [temp, setTemp] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [filterVegan, setFilterVegan] = useState(false);
  const [filterGlutenFree, setFilterGlutenFree] = useState(false);
  const [foodCategories, setFoodCategories] = useState([]);
  const [nameCate, setNameCate] = useState(null);
  const [isSearch, setIsSearch] = useState(false);



  useEffect(() => {
    const getData = async () =>{ 
      try{
        const resFood = await services.getAllFoods();
        
        const res = await services.getAllCategories();
        setCategories(res);
        const formatDataFood = resFood.map((food) => {
          const category = res.find(cat => String(cat.id) === String(food.categoryId));
          
          return ({
            id: food.id.toString(),
            categoryId: food.categoryId.toString(),
            categoryName: category ? category.name : "Không rõ",
            name: food.name,
            detail: food.detail,
            price: parseInt(food.price),
            isVegan: food.isVegan,
            isGlutenFree: food.isGlutenFree,
            totalRatings: food.totalRatings.toString(),
            totalStars: food.totalStars.toString(),
            img: `https://gateway.pinata.cloud/ipfs/${food.img}`,
            time: food.time
          })
        });

        setListFood(formatDataFood);
        setTemp(formatDataFood);
        setFoodCategories(groupByCategory(formatDataFood));
        
      }catch(err){
        console.log("Lỗi khi lấy danh sách món ăn:", err);
      }
    }
    getData();
  }, []);
  

  useEffect(() => {
    let foodEventSubscription;
    const subscribeToFoodAdded = async () => {
        foodEventSubscription = await services.listenForAddFood((food) => {
            const formatDataFood = {
                id: food.id.toString(),
                name: food.name,
                detail: food.detail,
                price: parseInt(food.price),
                isVegan: food.isVegan,
                isGlutenFree: food.isGlutenFree,
                totalRatings: food.totalRatings.toString(),
                totalStars: food.totalStars.toString(),
                categoryId: food.categoryId.toString(),
                img: `https://gateway.pinata.cloud/ipfs/${food.img}`,
                time: food.time
            };
            
            setListFood((prev) => {
                if (!prev.find(item => item.id === formatDataFood.id)) {
                    return [...prev, formatDataFood];
                }
                return prev;
            });
        });
    };
    subscribeToFoodAdded();
    return () => {
      if (foodEventSubscription && foodEventSubscription.removeAllListeners) {
          foodEventSubscription.removeAllListeners('data');
          foodEventSubscription.removeAllListeners('error');
          console.log("Đã hủy đăng ký lắng nghe sự kiện FoodAdded.");
      }
  };
  }, []);

  useEffect(() => {
    const ref = filterRef.current;
    if(!showFilterModal || !ref) return;

    gsap.fromTo(ref, {
      y: "100%",
      opacity: .6,
    }, {
      duration: .5,
      y: 0,
      opacity: 1,
      ease: "power3.in"
    })


  }, [showFilterModal]);

  const handleToogleSearch = () =>{
    const ref = searchRef.current;
    const input = inputRef.current;

    if(!isSearch){
      setIsSearch(true);
  
        gsap.fromTo(ref, {
          display: "flex",
          x: "100%",
          opacity: .8
        }, {
          duration: .3,
          x: 0,
          opacity: 1,
          ease: "power3.in",
          onComplete: () => {
            input.focus();
          }
        })
        
    }else{
      setIsSearch(false);
      gsap.fromTo(ref, {
        x: 0,
        opacity: 1
      }, {
        duration: .3,
        display: "none",
        x: "100%",
        opacity: .8,
        ease: "power3.in"
      })
    }
  }


  

  const handleSearch = async () => {

    const idRes = new Set();
    try {

      const foods = await services.searchFood(searchQuery);
      // const restaurants = await services.searchRestaurants(searchQuery);
      
      if(foods.length > 0){
        const formatDataFood = foods.map((food) => ({
          id: food.id.toString(),
          name: food.name,
          price: parseInt(food.price),
          isVegan: food.isVegan,
          isGlutenFree: food.isGlutenFree,
          totalRatings: food.totalRatings.toString(),
          totalStars: food.totalStars.toString(),
          // restaurantId: food.restaurantId.toString(),
          categoryId: food.categoryId.toString(),
          img: `https://gateway.pinata.cloud/ipfs/${food.img}`,
          time: food.time,
          detail: food.detail
        }));
  
        setListFood(formatDataFood);
      }
      // }else{
      //   const res = await services.getAllFoods();
      //   const formatDataFood = res.map((food) => ({
      //     id: food.id.toString(),
      //     name: food.name,
      //     price: parseInt(food.price),
      //     isVegan: food.isVegan,
      //     isGlutenFree: food.isGlutenFree,
      //     totalRatings: food.totalRatings.toString(),
      //     totalStars: food.totalStars.toString(),
      //     // restaurantId: food.restaurantId.toString(),
      //     categoryId: food.categoryId.toString(),
      //     img: `https://gateway.pinata.cloud/ipfs/${food.img}`
      //   }));
      //   setListFood(formatDataFood);

      // }
      
    } catch (error) {
      console.error("Lỗi khi lấy danh sách món ăn:", error);
    }
  };


  const handleFilter = () => {
    setListFood(
      temp.filter(
        (food) =>
          (!minPrice || food.price >= minPrice) &&
          (!maxPrice || food.price <= maxPrice) &&
          (!selectedCategory || food.categoryId == selectedCategory) &&
          (Number(food.totalRatings) > 0 ? Number(food.totalStars)/ Number(food.totalRatings) >= minRating : true) &&
          (!filterVegan || food.isVegan) &&
          (!filterGlutenFree || food.isGlutenFree)
      )
    );
    setShowFilterModal(false);
  }

  const handleClose = () => {
    const ref = filterRef.current;
    gsap.to(ref, {
      duration: .5,
      y: "100%",
      opacity: .6,
      ease: "power3.in",
      onComplete: () => {
        setShowFilterModal(false)
      }
    })
  }

  const handleFood = (name, id) => {
    if(name === nameCate){
      navCateRef.current.forEach((el) => {
        gsap.to(el, { backgroundColor: "transparent" });
  
        const text = el.querySelector(".cate_text");
        if (text) {
          gsap.to(text, { color: "black" });
        }
      });

      setListFood(temp);
      setNameCate(null)
      return;
    }
    navCateRef.current.forEach((el) => {
      gsap.to(el, { backgroundColor: "rgba(236, 235, 235, 0.5)", duration: 0.3 });
  
      const text = el.querySelector(".cate_text");
      if (text) {
        gsap.to(text, { color: "black", duration: 0.3 });
      }
    });

    const ref = navCateRef.current[id];
    const textRef = ref.querySelector(".cate_text");
  
    gsap.to(ref, {
      backgroundColor: "black",
      duration: 0.3,
    });
  
    gsap.to(textRef, {
      color: "white",
      duration: 0.3,
    });
    
    setListFood(foodCategories[name]);
    setNameCate(name)
  }

  console.log("orderSelector.data",orderSelector.data);
  
  
  return (
    <div className='Home'>
      {showFilterModal && (
        <div ref={filterRef} className='stylePopup-bottom p-4' style={{height: 500}}>
          <div className="" style={{
            position: "absolute",
            top: "3%",
            right: "5%",
          }} onClick={() => handleClose()}>
            <Icon name="iconTimes"/>
          </div>
          <Form className='mx-3 my-4'>
            <Form.Group className="mb-3">
              <Form.Label>💰 Khoảng:</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="number"
                  placeholder={"giá thấp nhất"}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="me-2"
                />
                <Form.Control
                  type="number"
                  placeholder={"giá cao nhất"}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>🍽 Danh sách loại thức ăn:</Form.Label>
              <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Tất cả</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>⭐ Đánh giá thấp nhất:</Form.Label>
              <Form.Select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                {[0, 1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>{rating} ⭐</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Check
              type="checkbox"
              label={`🌱 thực phẩm chay`}
              checked={filterVegan}
              onChange={(e) => setFilterVegan(e.target.checked)}
              className="text-capitalize"
            />
            <Form.Check
              type="checkbox"
              label={`🚫 thực phẩm chứa gluten`}
              checked={filterGlutenFree}
              onChange={(e) => setFilterGlutenFree(e.target.checked)}
              className="text-capitalize"
            />
          </Form>
          <BtnConfirm  radius={28} className="mt-5" onClick={() => handleFilter()}> 
              <span className='text-white fs-5 text-capitalize'>lọc</span>
          </BtnConfirm>
        </div>
      )}
      {/* <div className="py-3">
        <div className="search">
          <input
            type="search"
            placeholder={`Tìm kiếm...`}
            className="me-2 w-100" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="search_icon" onClick={() =>  handleSearch()}>
            <Icon name="iconSearch"/>
          </div>
        </div>
        <div className="filter d-flex ps-3 pt-2" onClick={() => setShowFilterModal(true)}>
          <div className="me-3">
            <Icon name="iconFilter" size={16}/>
          </div>
          <span>
            Lọc nâng cao
          </span>
        </div>
      </div> */}
      {width <= 634  && (
        <div ref={searchRef} className="search">
          <div className="search_wrapper">
            <input
              ref={inputRef}
              type="search"
              placeholder={`Tìm kiếm...`}
              className="me-2 w-100" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {!searchQuery && (
              <div className="search_icon"  onClick={() => handleToogleSearch()}>
                <Icon name="iconTimes"/>
              </div>
            )}
            {searchQuery && (
              <div className="search_icon"  onClick={() => handleSearch()}>
                <Icon name="iconSearch"/>
              </div>
            )}
          </div>
        </div>
      
      )}

      <div className="mobile_view">
        <div className='d-flex row mb-3'>
          <div className='col-10 d-flex flex-column'>
            <span className='cate_title'>delicious {nameCate ? nameCate : "food"}</span>
            <span className='cate_detail'>We made fresh and Healthy food</span>
          </div>
          <div className='col-2 text-center align-content-center' onClick={() => handleToogleSearch(true)}>
            <Icon name={"iconSearch"}/>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <Swiper 
            slidesPerView={3} 
            loop={true}
          >
            {Object.keys(foodCategories).map((data, id) => (
              <SwiperSlide key={id} className='catelories_wrapper'>
                <div ref={(e) => navCateRef.current[id] = e} className="catelories_item" onClick={() => handleFood(data, id)}>
                  <span className='cate_text'>{data}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="col-2 mt-3 text-center" onClick={() => setShowFilterModal(true)}>
            <Icon name="iconFilter"/>
          </div>

        </div>
      </div>

      <div className="">
        <FoodItem listFood={listFood}/>
      </div>


    </div>
  )
}

export default Home