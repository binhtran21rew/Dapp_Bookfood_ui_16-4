import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';


import { foodVariants, homeVariants, Links } from '../utils/constant'

import MainLayout from '../layouts';
import Loadpage from '../cpns/Loadpage';

import Home from '../page/Home/Home';
import Categories from '../page/Categories/Categories';
import Order from '../page/Order/Order';
import Food from '../page/Food/Food';
import Carts from '../page/Cart/Cart';
import OrderDetail from '../page/OrderDetail/OrderDetail';

function AppRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (navigate && navigate.scrollRestoration) {
  //     navigate.scrollRestoration = 'manual';
  //   }

  //   return () => {
  //     if (navigate && navigate.scrollRestoration) {
  //       navigate.scrollRestoration = 'auto';
  //     }
  //   };
  // }, [navigate]);

  return (
    <AnimatePresence mode="wait"> 
      <Routes location={location} key={location.pathname} >
          <Route element={<MainLayout />}>
              <Route  path={Links['home']} element={
                <Loadpage 
                variants={homeVariants}
              >
                <Home /></Loadpage>} />
              <Route  path={Links['categories']} element={<Loadpage ><Categories /></Loadpage>} />
              <Route  path={`${Links['orders']}`} element={<Loadpage><Order /></Loadpage>} />
              <Route  path={`${Links['food']}`} element={
                <Loadpage 
                  variants={foodVariants}
                ><Food /></Loadpage>} />
              <Route  path={`${Links['carts']}`} element={<Loadpage><Carts /></Loadpage>} />
              <Route  path={`${Links['orderDetail']}/:id`} element={<Loadpage><OrderDetail /></Loadpage>} />

          </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default AppRouter