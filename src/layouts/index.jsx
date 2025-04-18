import React from 'react'

import { Outlet, useLocation } from 'react-router-dom';
import { Links } from '../utils/constant';

function MainLayout() {

	const location = useLocation();
	const pageCart = location.pathname === Links['orders'];

	return (
		<div className={`bg_main `} >
			<Outlet />
		</div>
	)
}

export default MainLayout