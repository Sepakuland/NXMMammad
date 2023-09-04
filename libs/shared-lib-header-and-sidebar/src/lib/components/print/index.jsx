import React, { useEffect, useState, useRef } from 'react'
import '../RKGrid/default-main-dark.css'
import '../RKGrid/default-ocean-blue.css'
import '../RKGrid/style.css'
import { loadLangMsg } from '../../utils/loadLangMsg'
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { LocalizationProvider } from "@progress/kendo-react-intl";
import { getLangDate } from "../../utils/getLangDate";
import { useSearchParams } from 'react-router-dom';
import '../../components/RKGrid/style.css'

const Print = ({ printData, columnList, logo, title, subTitle, children,showZoom=true }) => {


    const [fontSize, setFontSize] = useState(12);
    console.log("fontSize...", fontSize)
    const [data, setData] = useState([]);
    const [searchParams] = useSearchParams();
    const gridId = searchParams.get('id')

    const { t, i18n } = useTranslation();
    const [gridW, setGridW] = useState();
    const printSetting = JSON.parse(localStorage.getItem(`print_${gridId}`));
    const [autoWidth, setAutoWidth] = useState('75px')
    const gridContainer = useRef()

    let tempColumn = columnList


    let pObj = {}

    tempColumn.forEach((item) => {
        pObj[item.field] = true
    })

    const [fields, setFields] = useState(printSetting || pObj)


    //
    // useEffect(()=>{
    //     let widthList=tempColumn.map((item)=>{
    //         if(item?.width!==autoWidth){
    //             let wi=item?.width?.replace('px','')
    //             return parseInt(wi)
    //         }
    //     })
    //     widthList=widthList.filter( Boolean )
    //     let fixWidth=widthList?.reduce((a, b) => a + b, 0)
    //
    //     console.log('widthList',widthList)
    //     console.log('fixWidth',fixWidth)
    //     let w=gridW-fixWidth
    //     let count=Object.keys(fields).length-widthList.length
    //     let cellW=parseInt(w/count)
    //     console.log('cellW',cellW)
    //     cellW=cellW<75?75:cellW
    //     setAutoWidth(`${cellW}px`)
    // },[gridW])


    useEffect(() => {
        loadLangMsg(i18n.language)
    }, [i18n.language])
    useEffect(() => {
        setData(printData)
    }, [printData])
    const AddSize = () => {
        if (fontSize <= 25) {
            setFontSize(fontSize + 1);
        }
    }
    const DecreaseSize = () => {
        if (fontSize >= 9) {
            setFontSize(fontSize - 1);
        }
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);
    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    const handleResize = async () => {
        await timeout(500);
        setGridW(gridContainer?.current?.offsetWidth - 20)
    };

    useEffect(() => {
        setGridW(gridContainer?.current?.offsetWidth - 20)
    }, [])



    return (

        <div className='p-3 print-page'>
            <div className='row justify-content-center'>
                <div className='col-lg-11 col-md-12 col-sm-12 col-12'>
                    <div
                        style={{ direction: i18n.dir() }}>
                        <style jsx global>{`
                  ${showZoom?`tbody,tfoot
                  {
                      font-size:${fontSize}px
                  }
                  thead .k-column-title{
                   font-size:${fontSize}px
                  }`:''}
                .dx-overlay-wrapper .dx-list-item:last-child 
                {
                  display: none !important;
                }`
                        }</style>
                        <div className='row'>
                            <div className='col-lg-12 col-md-12 col-xs-12'>
                                <div className='header-print-grid'>
                                    <div className='row mb-0'>
                                        <div className='col-lg-4 col-md-4 col-4 m-0'>
                                            <img className='CoddingIcon' src={logo} alt={'pic'} />
                                        </div>
                                        <div className='col-lg-4 col-md-4 col-4 m-0 d-flex align-items-center justify-content-center'>
                                            <div>
                                                <h2 className='title m-0 mb-2'>{title}</h2>
                                                <h3 className='title m-0'>{subTitle}</h3>
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-md-4 col-4 m-0'>
                                            <div className='date_icon'>
                                                <div className='icons'>
                                                    {showZoom?<>
                                                        <Button className='iconButton ' onClick={() => DecreaseSize()}><ZoomOutIcon /></Button>
                                                        <Button className='iconButton' onClick={() => AddSize()} ><ZoomInIcon /></Button>
                                                    </>:<></>}
                                                    
                                                </div>

                                                <div className='date'>
                                                    <p> {t("تاریخ چاپ: ")}{getLangDate(i18n.language, new Date())}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {children}
                            <div className='col-lg-12 col-md-12 col-12'>

                                <div className='grid' >
                                    <div className={`print-grid ${i18n.dir() === 'ltr' ? 'ltr-p' : ''}`} ref={gridContainer}>

                                        <LocalizationProvider
                                            language={`${i18n.language === 'fa' ? 'fa-IR' : i18n.language === 'ar' ? 'ar' : 'en'}`}>
                                            <Grid
                                                total={printData?.length}
                                                take={printData?.length}
                                                data={data}
                                                pageable={false}
                                                sortable={false}
                                                filterable={false}
                                                reorderable={false}
                                                className={`main-grid rk-print ${i18n.language === 'en' ? 'ltr' : 'rtl'}`}
                                            >

                                                {/*{tempColumn.map((column,index)=>(*/}
                                                {/*    fields[column.field] &&*/}
                                                {/*    <GridColumn {...column} key={index} title={t(`${column.name}`)} />*/}
                                                {/*))}*/}

                                                {tempColumn?.map((column, index) => {
                                                    if (!column?.children?.length) {
                                                        return fields[column.field] && <GridColumn {...column} key={index} title={t(`${column.name}`)} />

                                                    } else {
                                                        return (fields[column.field] && <GridColumn key={index} {...column} title={t(`${column.name}`)} >
                                                            {column?.children.map((children, indexC) => {
                                                                return <GridColumn {...children} key={indexC} title={t(`${children.name}`)} />
                                                            }
                                                            )}
                                                        </GridColumn>)
                                                    }
                                                })}

                                            </Grid>
                                        </LocalizationProvider>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Print









