import React from 'react'

import { Outlet } from 'react-router-dom';

function MainLayout() {
	return (
		<div className='bg_main'>
			<Outlet />
		</div>
	)
}

export default MainLayout