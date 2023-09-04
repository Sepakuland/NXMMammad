import {useState,useEffect} from 'react'


const ImgPreview = ({file}) => {
    const objectUrl = URL.createObjectURL(file)
  return(
      <>
        <img src={objectUrl}/>
      </>
  )
}

export default ImgPreview