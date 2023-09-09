import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg"
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { getLangDate } from "../../../../utils/getLangDate";
import { Button } from '@mui/material';
import OfficeGrid from './OfficeGrid';
import OfficeTotalReportGrid from './OfficeTotalReportGrid';





const OfficeReportPrintNew = () => {

    /* --------------------------------- states --------------------------------- */
    const searchItems = JSON?.parse(localStorage?.getItem(`searchItems`))
    const ReportType = JSON?.parse(localStorage?.getItem(`ReportType`))
    const { t, i18n } = useTranslation();
    const [gridW, setGridW] = useState();
    const [fontSize, setFontSize] = useState(12);
    const gridContainer = useRef()
    /* -------------------------------------------------------------------------- */
    /*                           change font size method                          */
    /* -------------------------------------------------------------------------- */
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
    const handleResize = async () => {
        await timeout(500);
        setGridW(gridContainer?.current?.offsetWidth - 20)
    };
    useEffect(() => {
        setGridW(gridContainer?.current?.offsetWidth - 20)
    }, [])
    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }






    return (
        <div className="OfficeReportGrids" style={{ userSelect: "none" }}>
            <div className='officePrint d-flex justify-content-center flex-wrap '>
                <div style={{ width: "90%", padding: "0 !important" }} className='justify-content-center d-flex'>

                    <div style={{ direction: i18n.dir(), width: "100%", padding: "0 !important" }}>
                        <style jsx global>{`
                                                             tbody,tfoot
                                                            {
                                                                 font-size:${fontSize}px
                                                             }
                                                             thead .k-column-title{
                                                              font-size:${fontSize}px
                                                             }
                                                            .dx-overlay-wrapper .dx-list-item:last-child 
                                                            {
                                                              display: none !important;
                                                            }`
                        }</style>
                        <div style={{ width: "100%", padding: "0 !important" }} className='row'>
                            <div style={{ width: "100%", padding: "0 !important" }} className='col-lg-12 col-md-12 col-xs-12'>
                                <div style={{ width: "100%", padding: "0 !important", marginRight: "11px" }} className='header-print-grid-officeReport'>
                                    <div className='row mb-0' style={{ width: "100%", padding: "0 !important", height: "90px !important" }}>
                                        <div className='col-lg-4 col-md-4 col-4 m-0' style={{ height: "100%" }}>
                                            <img className='CoddingIcon' src={CoddingIcon} alt={'pic'} style={{ height: "100%" }} />
                                        </div>
                                        <div className='col-lg-4 col-md-4 col-4 m-0 d-flex align-items-center justify-content-center'>
                                            <div>
                                                <h2 className='title' style={{ marginRight: " -11px", fontSize: "26px" }}>{t("نمایش جزییات")}</h2>
                                                <h3 className='title ' style={{ fontSize: "15px" }}>{t('گزارش دفتر روزنامه کل')}</h3>
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-md-4 col-4 m-0'>
                                            <div className='date_icon' style={{ fontSize: "11px" }}>
                                                <div className='icons'>
                                                    <Button className='iconButton ' style={{ color: " #545454" }} onClick={() => DecreaseSize()}><ZoomOutIcon /></Button>
                                                    <Button className='iconButton' style={{ color: " #545454" }} onClick={() => AddSize()} ><ZoomInIcon /></Button>
                                                </div>

                                                <div className='date'>
                                                    <p> {t("تاریخ چاپ: ")}{getLangDate(i18n.language, new Date())}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div style={{ width: "90%", marginLeft: "1.4%" }} className='headerOfficeReport-Between'>
                    <div className="OfficeReportsPrint">
                        <div style={{ width: "50%", display: "flex", alignItems: "center" }}>
                            <div style={{ width: "20%" }}>{t("از سند")} :‌ {searchItems?.DocumentNumber[0] ? searchItems?.DocumentNumber[0] : ""}</div>
                            <div>{t("تا")} :‌ {searchItems?.DocumentNumber[1] ? searchItems?.DocumentNumber[1] : ""}</div>
                        </div>
                        <div style={{ width: "50%", display: "flex", alignItems: "center" }}>
                            <div style={{ width: "20%" }}> {t("از تاریخ")} :‌ {searchItems?.DocumentDate[0] ? getLangDate(i18n.language, searchItems?.DocumentDate[0]) : ""}</div>
                            <div >{t("تا")} :‌ {searchItems?.DocumentDate[1] ? getLangDate(i18n.language, searchItems?.DocumentDate[1]) : ""}</div>
                        </div>

                    </div>
                </div>


                <div className='OfficeReportPrintGrid justify-content-center d-flex' style={{ width: "89%", padding: "0 !important" }}>
                    {
                        ReportType == 1 ?
                            <OfficeGrid fontSize={fontSize} />
                            : <OfficeTotalReportGrid fontSize={fontSize} />
                    }
                </div>

            </div >
        </div>
    )
}

export default OfficeReportPrintNew
