import React from 'react'

function BtnConfirm({children, ...props}) {
  return (
    <div className={`text-center ${props.className}`} style={{
        backgroundColor: `${props.color ? props.color : "rgb(18, 158, 0) "}`,
        margin: "20px 20px",
        padding: 10,
        borderRadius: props.radius ? props.radius : 18,
      }}
        onClick={() => props.onClick()}
      >
          {children}
    </div>
  )
}

export default BtnConfirm