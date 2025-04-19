import React, { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom';


import { Links } from '../utils/constant'

import MainLayout from '../layouts';
import Loadpage from '../cpns/Loadpage';

import Home from '../page/Home/Home';
import Categories from '../page/Categories/Categories';
import Order from '../page/Order/Order';
import Restaurant from '../page/Restaurant/Restaurant';
import Carts from '../page/Cart/Cart';
import OrderDetail from '../page/OrderDetail/OrderDetail';

function AppRouter() {
  const location = useLocation();


  return (
    <Routes location={location} key={location.pathname} >
        <Route element={<MainLayout />}>
            <Route  path={Links['home']} element={<Loadpage><Home /></Loadpage>} />
            <Route  path={Links['categories']} element={<Loadpage><Categories /></Loadpage>} />
            <Route  path={`${Links['orders']}/:id`} element={<Loadpage><Order /></Loadpage>} />
            <Route  path={`${Links['restaurant']}/:id`} element={<Loadpage><Restaurant /></Loadpage>} />
            <Route  path={`${Links['carts']}`} element={<Loadpage><Carts /></Loadpage>} />
            <Route  path={`${Links['orderDetail']}/:id`} element={<Loadpage><OrderDetail /></Loadpage>} />

        </Route>
    </Routes>
  )
}

export default AppRouter