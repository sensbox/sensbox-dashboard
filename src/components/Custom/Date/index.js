import React from 'react'

const CustomDate = ({ raw }) => {
  if (!raw) return <div> - </div>
  const dateObject = new Date(raw)
  return <div>{dateObject.toLocaleString()}</div>
}

export default CustomDate
