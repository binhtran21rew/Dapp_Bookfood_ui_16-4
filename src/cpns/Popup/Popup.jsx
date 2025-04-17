import React from "react";
import { motion } from "framer-motion";

function Popup({ children, ...props }) {
    const {
        setIsOpen,
    } = props;
    return (
        <div className="Popup">
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 200 }}
                    dragElastic={0.5} // Smooth drag effect
                    onDragEnd={(e, info) => {
                        if (info.offset.y > 100) setIsOpen(false); // Close if swiped down enough
                    }}
                    className={`Popup`}
                
                >
                    {children}
                </motion.div>
        </div>
    );
}

export default Popup;
