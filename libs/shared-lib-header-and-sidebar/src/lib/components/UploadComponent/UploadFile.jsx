import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {useEffect, useRef, useState} from "react";
import ImgPreview from "./ImgPreview";
import './UploadFileStyle.css'
import { useTranslation } from "react-i18next";


function UploadFile({uploadError,updateFileList,multiple,title,accept,size='normal'}) {
    const { t, i18n } = useTranslation();
    const [fileList,setFileList]=useState([])
    const inputFile=useRef()

    function addFiles(file) {
        if (multiple){
            setFileList([...fileList,...file])
            inputFile.current.value=''
        }else{
            setFileList([...file])
        }
    }

    function deleteFile(item){
        let temp=fileList.filter(f => f !== item)
        setFileList(temp)
        inputFile.current.value=''
    }

    useEffect(()=>{
        updateFileList(fileList)
    },[fileList])



    return(
        <div className={`d-flex ${size==='small'?'small-box':''}`}>
            <div className='form-design p-0 mb-0'>
                {((!multiple&&!fileList.length)||multiple)&&<div className={`file-uploader d-flex align-items-center justify-content-center ${i18n.dir() == "ltr"?'ltr':''}`}>
                    <label 
                           className={`ant-upload d-flex align-items-center justify-content-center `}
                    >
                        <input
                            
                            type="file"
                            ref={inputFile}
                            accept={accept}
                            onChange={(e) => addFiles(e.target.files)}
                            multiple={multiple}
                            style={{display: "none"}}
                        />

                        <div>
                            <svg width="26" height="35" viewBox="0 0 26 35" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M24.6548 2.63174C25.3975 2.63195 26 2.04446 26 1.31954C26 0.594628 25.3983 0.00679634 24.6556 0.00658604L1.34522 5.64408e-08C0.602489 -0.000210241 0 0.587281 0 1.3122C0 2.03711 0.601711 2.62494 1.34444 2.62516L24.6548 2.63174ZM12.8175 34.988L13 35C13.6808 35 14.2435 34.5062 14.3326 33.8655L14.3448 33.6874L14.343 9.73726L21.0166 16.2482C21.4941 16.7142 22.2413 16.7565 22.7677 16.3751L22.9185 16.248C23.3959 15.782 23.4392 15.0528 23.0485 14.539L22.9183 14.3918L13.957 5.64717C13.4798 5.18149 12.7332 5.13895 12.2067 5.51971L12.0559 5.64663L3.0842 14.3912C2.55865 14.9035 2.55807 15.7345 3.0829 16.2475C3.56001 16.7138 4.3071 16.7567 4.83385 16.3757L4.98477 16.2488L11.6534 9.74951L11.6552 33.6874C11.6552 34.3519 12.1611 34.9011 12.8175 34.988Z"
                                    fill="#0078D4"/>
                            </svg>
                            <div>{title}</div>
                        </div>

                    </label>

                </div>}
                {uploadError ? (
                    <div className='error-msg'>
                        {t('بارگذاری فایل الزامی است')}
                    </div>
                ) : null}
            </div>
            <div className='upload-files'>
                {fileList?.map((item,index)=>(
                    <div className='ant-upload-list-picture-card-container rtl-mg' key={index}>
                        <div className='item'>
                            <button title={t("حذف فایل")} type="button" className="remove-actions-btn" onClick={()=>deleteFile(item)}>
                                <DeleteOutlineIcon />
                            </button>
                            {(item.type.split('/'))[0]==='image'?
                                <ImgPreview file={item} alt='pic'/>:
                                <div className='info'>
                                    {item?.name}
                                </div> }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default UploadFile