import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";



import {pageVariants} from '../utils/constant'


function Loadpage({ children, variants }) {

  const pageRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();


  return (
    <motion.div
      className="page"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: .5 }}
    >
      {React.isValidElement(children)
        ? React.cloneElement(children)
        : children}
    </motion.div>
  );
}

export default Loadpage