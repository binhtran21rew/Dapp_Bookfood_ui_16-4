import React from 'react'

function BtnConfirm({children, ...props}) {
  return (
    <div className={`text-center ${props.className}`} style={{
        backgroundColor: `${props.color ? props.color : "black "}`,
        margin: "20px 20px",
        padding: "15px",
        borderRadius: props.radius ? props.radius : 18,
      }}
        onClick={() => props.onClick()}
      >
          {children}
    </div>
  )
}

export default BtnConfirm