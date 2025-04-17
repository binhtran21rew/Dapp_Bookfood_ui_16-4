import React, { useEffect, useState } from 'react'
import Icon from '../../utils/Icon'


import './home.scss';

import capitalizeWords from '../../utils/functionUtils';
import FoodItem from '../../cpns/FoodItem/FoodItem';
import services from '../../utils/services';

function Home() {

  const [listFood, setListFood] = useState([]);


  useEffect(() => {
    const getData = async () =>{ 
      try{
        const resFood = await services.getAllFoods();

        const formatDataFood = resFood.map((food) => ({
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
  
        setListFood(formatDataFood)
      }catch(err){
        console.log("Lỗi khi lấy danh sách món ăn:", err);
        
      }
    }
    getData();
  }, []);

  
  
  return (
    <div className='Home'>
      <div className="">
        <FoodItem listFood={listFood}/>
      </div>

    </div>
  )
}

export default Home