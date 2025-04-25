import React, { useEffect, useRef, useState } from 'react'
import Icon from '../../utils/Icon'


import './home.scss';

import capitalizeWords from '../../utils/functionUtils';
import FoodItem from '../../cpns/FoodItem/FoodItem';
import services from '../../utils/services';
import { Button, Form, FormControl } from 'react-bootstrap';
import BtnConfirm from '../../cpns/BtnConfirm/BtnConfirm';
import gsap from 'gsap';
import BlockFood from '../../cpns/BlockFood/BlockFood';

function Home() {

  const [listFood, setListFood] = useState([]);

  const filterRef = useRef(null);

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
            img: `https://gateway.pinata.cloud/ipfs/${food.img}`
          })
        });

        

        
  
        setListFood(formatDataFood);
        setTemp(formatDataFood);
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
                img: `https://gateway.pinata.cloud/ipfs/${food.img}`
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

  const handleSearch = async () => {

    const idRes = new Set();
    try {

      const foods = await services.searchFood(searchQuery);
      // const restaurants = await services.searchRestaurants(searchQuery);
      console.log(foods, 'sss');
      
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
          img: `https://gateway.pinata.cloud/ipfs/${food.img}`
        }));
  
        setListFood(formatDataFood);
      }else{
        const res = await services.getAllFoods();
        const formatDataFood = res.map((food) => ({
          id: food.id.toString(),
          name: food.name,
          price: parseInt(food.price),
          isVegan: food.isVegan,
          isGlutenFree: food.isGlutenFree,
          totalRatings: food.totalRatings.toString(),
          totalStars: food.totalStars.toString(),
          // restaurantId: food.restaurantId.toString(),
          categoryId: food.categoryId.toString(),
          img: `https://gateway.pinata.cloud/ipfs/${food.img}`
        }));
        setListFood(formatDataFood);

      }
      
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
  

  return (
    <div className='Home'>
      {/* {showFilterModal && (
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
      )} */}
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

      <div className="">
        <FoodItem listFood={listFood}/>
      </div>


    </div>
  )
}

export default Home