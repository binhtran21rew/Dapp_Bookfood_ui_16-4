import React from 'react'

function CustomInput({...props}) {
  return (
    <input 
    placeholder={props.holder}
    style={{width: "99%", height: "100px", borderRadius: "10px"}}

  />
  )
}

export default CustomInput