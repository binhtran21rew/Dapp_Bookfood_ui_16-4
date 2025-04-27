import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import gsap from 'gsap';



import {Links, pageVariants} from '../utils/constant'
import BtnConfirm from './BtnConfirm/BtnConfirm';
import {
  resetItem,

} from '../context/slice/orderSlice';
import { useDispatch } from 'react-redux';

function Loadpage({ children, variants }) {

  const pageRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const btnRef = useRef(null);

  const pageFoodChange = location.pathname === Links["foodChange"];

  useEffect(() => {
    const ref = btnRef.current;
    if(!ref) return;

    gsap.fromTo(ref, {
      y: "200%",
      opacity: 0,
      ease: "power3.in",
    }, {
      duration: 0.32,
      y: 0,
      opacity: 1,
      ease: "power3.in",
    })
  }, [pageFoodChange]);
  const handleClick = (id) => {
    const ref = btnRef.current;
    if(!ref) return;

    gsap.to(ref, {
      onStart: () => {
        dispatch(resetItem());
        navigate(-1);
      },
      duration: .1,
      y: "300%",
      opacity: 0,
      ease: "power3.in",

    })


}

  return (
    <>
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
      {pageFoodChange && (
          <div ref={btnRef} className="stylePopup-bottom" style={{zIndex: 9999}}>
              <BtnConfirm radius={8} onClick={() => handleClick()}> 
                  <span className="text-white fw-bold ms-3 fs-5">Cập nhật giỏ hàng</span>
              </BtnConfirm>
          </div>
      )}
    </>
  );
}

export default Loadpage