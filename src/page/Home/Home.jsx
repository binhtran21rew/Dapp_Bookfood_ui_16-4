import React, { useEffect, useState } from 'react'
import Icon from '../../utils/Icon'


import './home.scss';

import capitalizeWords from '../../utils/functionUtils';
import FoodItem from '../../cpns/FoodItem/FoodItem';
import services from '../../utils/services';
import { Button, Form, FormControl } from 'react-bootstrap';
import BtnConfirm from '../../cpns/BtnConfirm/BtnConfirm';

function Home() {

  const [listFood, setListFood] = useState([]);


  const [foods, setFoods] = useState([]);
  const [temp, setTemp] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
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
        const formatDataFood = resFood.map((food) => ({
          id: food.id.toString(),
          name: food.name,
          price: parseInt(food.price),
          isVegan: food.isVegan,
          isGlutenFree: food.isGlutenFree,
          totalRatings: food.totalRatings.toString(),
          totalStars: food.totalStars.toString(),
          restaurantId: food.restaurantId.toString(),
          categoryId: food.categoryId.toString(),
          img: `https://gateway.pinata.cloud/ipfs/${food.img}`
        }));
  
        setListFood(formatDataFood);
        setTemp(formatDataFood);
      }catch(err){
        console.log("Lỗi khi lấy danh sách món ăn:", err);
        
      }
    }
    getData();
  }, []);

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
          restaurantId: food.restaurantId.toString(),
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
          restaurantId: food.restaurantId.toString(),
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

    
  };
  

  return (
    <div className='Home'>
      {showFilterModal && (
        <div className='stylePopup-bottom' style={{height: 500}}>
          <div className="" style={{
            position: "absolute",
            top: "3%",
            right: "5%",
          }} onClick={() => setShowFilterModal(false)}>
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

            {/* Dropdown chọn Category */}
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

            {/* Min Rating */}
            <Form.Group className="mb-3">
              <Form.Label>⭐ Đánh giá thấp nhất:</Form.Label>
              <Form.Select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                {[0, 1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>{rating} ⭐</option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Checkboxes */}
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
      <div className="py-3">
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
          {/* <Button style={{width: "120px"}} variant="secondary" className="px-4 text-capitalize" onClick={() => setShowFilterModal(true)}>lọc</Button> */} 
        </div>
        <div className="d-flex ps-3 pt-2" onClick={() => setShowFilterModal(true)}>
          <div className="me-3">
            <Icon name="iconFilter" size={16}/>
          </div>
          <span>
            Lọc nâng cao
          </span>
        </div>
      </div>
      <div className="">
        <FoodItem listFood={listFood}/>
      </div>

    </div>
  )
}

export default Home