import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg"
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { getLangDate } from "../../../../utils/getLangDate";
import { useLostBenefitReportQuery } from '../../../../features/slices/customerChosenCodingSlice';
import { CreateQueryString } from '../../../../utils/createQueryString';

const LostBenefitPrint = () => {
    const { t, i18n } = useTranslation();
    const gridContainer = useRef()
    const [fontSize, setFontSize] = useState(12);
    const [gridW, setGridW] = useState();
    const LostBenefitPrint = JSON.parse(localStorage?.getItem(`LostBenefitPrint`))

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
    /* -------------------------------------------------------------------------- */
    /*                              GetData from api                              */
    /* -------------------------------------------------------------------------- */
    const [query, setQuery] = useState("")

    const [skip, setSkip] = useState(true)
    const [OperatingRevenues, setOperatingRevenues] = useState([]);
    const [OperatingExpenses, setOperatingExpenses] = useState([]);
    const [OtherOperating, setOtherOperating] = useState([]);
    const [NonOperatingRevenues, setNonOperatingRevenues] = useState([]);
    const [NonOperatingExpenses, setNonOperatingExpenses] = useState([]);
    const [OtherNonOperating, setOtherNonOperating] = useState([]);

    useEffect(() => {
        setSkip(false)
        setQuery(CreateQueryString(LostBenefitPrint))
    }, [])

    const { data: LostBenefitReportResult = [], isFetching: LostBenefitReportIsFetching, error: LostBenefitReportError, currentData: LostBenefitReportCurrentData } =
        useLostBenefitReportQuery({ query: query }, { skip: skip });


    useEffect(() => {

        setOperatingRevenues(calculateSum(LostBenefitReportResult, 1));
        setOperatingExpenses(calculateSum(LostBenefitReportResult, 2));
        setOtherOperating(calculateSum(LostBenefitReportResult, 3));
        setNonOperatingRevenues(calculateSum(LostBenefitReportResult, 4));
        setNonOperatingExpenses(calculateSum(LostBenefitReportResult, 5));
        setOtherNonOperating(calculateSum(LostBenefitReportResult, 6));



    }, [LostBenefitReportIsFetching, LostBenefitReportCurrentData])
    function calculateSum(data, operationalStatus) {
        const result = {};

        data.forEach(item => {
            if (item.operationalStatus === operationalStatus) {
                // const Remainder = item.credits.reduce((acc, current) => acc + current, 0) - item.debits.reduce((acc, current) => acc + current, 0);
                if (item?.totalCodingNature == 1) {
                    if (result[item.codingParent.name]) {
                        // If the name already exists in the result, update the values
                        result[item.codingParent.name].debits += item.debits.reduce((acc, current) => acc + current, 0);


                    } else {
                        // If the name doesn't exist, create a new object
                        result[item.codingParent.name] = {
                            name: item.codingParent.name,
                            debits: item.debits.reduce((acc, current) => acc + current, 0),
                            credits: 0,

                        };
                    }
                }
                else {
                    if (result[item.codingParent.name]) {
                        // If the name already exists in the result, update the values
                        result[item.codingParent.name].credits += item.credits.reduce((acc, current) => acc + current, 0);

                    } else {
                        // If the name doesn't exist, create a new object
                        result[item.codingParent.name] = {
                            name: item.codingParent.name,
                            debits: 0,
                            credits: item.credits.reduce((acc, current) => acc + current, 0),

                        };
                    }
                }

            }
        });

        return Object.values(result);
    }
    function calculateFooterSum(data1, data2, data3) {
        let arr = []
        let remainder;
        let credits = 0
        let debits = 0
        let f = 0
        arr.push(data1)
        arr.push(data2)
        arr.push(data3)
        arr?.flat()?.map((item) => {
            credits += item?.credits;
            debits += item?.debits;
        })
        if (credits != 0 || debits != 0) {

            remainder = credits - debits
        }


        return remainder
    }
    function calculateTotalOfOneSection(data) {
        let remainder = 0;
        let credits = 0;
        let debits = 0;
        data.map((item) => {
            credits += item?.credits
            debits += item?.debits
        })
        remainder = credits - debits;
        return remainder;
    }
    let count = 0;
    return (
        <>
            <div className="LostBenefit" style={{ userSelect: "none" }}>
                <div className='LostBenefitPrint d-flex justify-content-center flex-wrap '>
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
                                                    <h3 className='title ' style={{ fontSize: "15px" }}>{t('گزارش سود و زیان')}</h3>
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
                                <div className='headerOfLostBenefit-Between'>

                                    <div style={{ width: "50%", display: "flex", alignItems: "center" }}>
                                        <div style={{ width: "20%" }}> {t("از تاریخ")} :‌ {LostBenefitPrint?.DocumentDate[0] ? getLangDate(i18n.language, LostBenefitPrint?.DocumentDate[0]) : ""}</div>
                                        <div >{t("تا")} :‌ {LostBenefitPrint?.DocumentDate[1] ? getLangDate(i18n.language, LostBenefitPrint?.DocumentDate[1]) : ""}</div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            <div className='codingGroup ' style={{ direction: i18n.dir() }}>
                <div>
                    {/* OperatingRevenues */}
                    <div className="top">
                        {OperatingRevenues?.map((item, index) => {
                            console.log("index", index)
                            return (
                                <section>
                                    <>
                                        <div className={`${index % 2 != 0 ? "border-none" : ""}`}>
                                            <section>{item?.name}</section>
                                        </div>
                                        <div className={`${index % 2 != 0 ? "border-none" : ""}`}>
                                            <section>{item?.debits?.toLocaleString()}</section>
                                        </div>
                                        <div className={`${index % 2 != 0 ? "border-none" : ""}`}>
                                            <section>{item?.credits?.toLocaleString()}</section>
                                        </div>
                                    </>
                                </section>)
                        })}

                    </div>
                    <div className="bottom">
                        <section style={{ borderBottom: "none" }}>{t("جمع")}:</section>
                        <section style={{ borderBottom: "none" }}>‌</section>
                        <section style={{ borderBottom: "none" }}>{Math.abs(calculateTotalOfOneSection(OperatingRevenues)).toLocaleString()}</section>
                    </div>
                    {/* OperatingExpenses */}
                    <div className="top">
                        {OperatingExpenses?.map((item, index) => {
                            count++;
                            return (
                                <section>
                                    <>
                                        <div className={`${count % 2 == 0 ? "border-none" : ""}`}>
                                            <section>{item?.name}</section>
                                        </div>
                                        <div className={`${count % 2 == 0 ? "border-none" : ""}`}>
                                            <section>{item?.debits?.toLocaleString()}</section>
                                        </div>
                                        <div className={`${count % 2 == 0 ? "border-none" : ""}`}>
                                            <section>{item?.credits?.toLocaleString()}</section>
                                        </div>
                                    </>

                                </section>)
                        })}
                    </div>
                    <div className="bottom">
                        <section>{t("جمع")}:</section>
                        <section>{Math.abs(calculateTotalOfOneSection(OperatingExpenses)).toLocaleString()}</section>
                        <section>‌</section>
                    </div>
                    <div className="bottom">
                        <section style={{ borderBottom: "none" }}>{t("سود(زیان) ناخالص")}:</section>
                        <section style={{ borderBottom: "none" }}>‌</section>
                        <section style={{ borderBottom: "none" }}> {calculateFooterSum(OperatingRevenues, OperatingExpenses, []) > 0 ? calculateFooterSum(OperatingRevenues, OperatingExpenses, []) : `(${Math.abs(calculateFooterSum(OperatingRevenues, OperatingExpenses, []))?.toLocaleString()})`}
                        </section>
                    </div>
                    {/* OtherOperating */}
                    <div className="top">
                        {OtherOperating?.map((item) => {
                            return (
                                <section>
                                    <>
                                        <div>
                                            <section>{item?.name}</section>
                                        </div>
                                        <div>
                                            <section>{item?.debits?.toLocaleString()}</section>
                                        </div>
                                        <div>
                                            <section>{item?.credits?.toLocaleString()}</section>
                                        </div>
                                    </>

                                </section>)
                        })}
                    </div>
                    <div className="bottom">
                        <section>{t("جمع")}:</section>
                        <section>‌</section>
                        <section>{`(${Math.abs(calculateTotalOfOneSection(OtherOperating)).toLocaleString()})`}</section>
                    </div>
                    <div className="bottom">
                        <section>{t("سود(زیان) عملیاتی")}:</section>
                        <section>‌</section>
                        <section> {`(${Math.abs((calculateFooterSum(OperatingRevenues, OperatingExpenses, [])) - Math.abs(calculateTotalOfOneSection(OtherOperating)))?.toLocaleString()})`}
                        </section>
                    </div>
                    {/* NonOperatingRevenues */}
                    <div className="top">
                        {NonOperatingRevenues?.map((item) => {
                            return (
                                <section>
                                    <>
                                        <div>
                                            <section>{item?.name}</section>
                                        </div>
                                        <div>
                                            <section>{item?.debits?.toLocaleString()}</section>
                                        </div>
                                        <div>
                                            <section>{item?.credits?.toLocaleString()}</section>
                                        </div>
                                    </>

                                </section>)
                        })}

                    </div>
                    {/* NonOperatingExpenses */}
                    <div className="top">
                        {NonOperatingExpenses?.map((item) => {
                            return (
                                <section>
                                    <>
                                        <div>
                                            <section>{item?.name}</section>
                                        </div>
                                        <div>
                                            <section>{item?.debits?.toLocaleString()}</section>
                                        </div>
                                        <div>
                                            <section>{item?.credits?.toLocaleString()}</section>
                                        </div>
                                    </>

                                </section>)
                        })}
                    </div>
                    {/* OtherNonOperating */}
                    <div className="top">
                        {OtherNonOperating?.map((item) => {
                            return (
                                <section>
                                    <>
                                        <div>
                                            <section>{item?.name}</section>
                                        </div>
                                        <div>
                                            <section>{item?.debits?.toLocaleString()}</section>
                                        </div>
                                        <div>
                                            <section>{item?.credits?.toLocaleString()}</section>
                                        </div>
                                    </>

                                </section>)
                        })}

                    </div>
                    <div className="bottom">
                        <section>{t("جمع")}:</section>
                        <section>{Math.abs(calculateFooterSum(NonOperatingExpenses, OtherNonOperating, NonOperatingRevenues)).toLocaleString()}</section>
                        <section>‌</section>
                    </div>
                    <div className="bottom">
                        <section>{t("سود(زیان) خالص")}:</section>
                        <section>‌</section>
                        <section>{(calculateFooterSum(OperatingRevenues, OperatingExpenses, []) - calculateTotalOfOneSection(OtherOperating) - (calculateFooterSum(NonOperatingExpenses, OtherNonOperating, NonOperatingRevenues))) > 0 ?
                            (calculateFooterSum(OperatingRevenues, OperatingExpenses, []) - calculateTotalOfOneSection(OtherOperating) - (calculateFooterSum(NonOperatingExpenses, OtherNonOperating, NonOperatingRevenues))).toLocaleString()
                            : `(${Math.abs(calculateFooterSum(OperatingRevenues, OperatingExpenses, [])
                                - calculateTotalOfOneSection(OtherOperating)
                                - calculateFooterSum(NonOperatingExpenses, OtherNonOperating, NonOperatingRevenues))
                            })`}</section>
                    </div>

                </div>
            </div>
            <div className="LostBenefitFooter row">
                <div className="col-lg-4 col-md-4 col-4 d-flex justify-content-end">{t("تنظیم کننده")}</div>
                <div className="col-lg-4 col-md-4 col-4 d-flex justify-content-end">{t("مدیر مالی")}</div>
                <div className="col-lg-4 col-md-4 col-4 d-flex justify-content-end">{t("مدیر عامل")}</div>
            </div>
        </>
    )


}
export default LostBenefitPrint;  