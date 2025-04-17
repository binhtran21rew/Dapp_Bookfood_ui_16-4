import React from 'react'
import { useLocation } from 'react-router-dom';
import { motion } from "framer-motion";



import {pageVariants} from '../utils/constant'

function Loadpage({children}) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5 }}
        className="page"
      >
        {children}
      </motion.div>
    );
}

export default Loadpage