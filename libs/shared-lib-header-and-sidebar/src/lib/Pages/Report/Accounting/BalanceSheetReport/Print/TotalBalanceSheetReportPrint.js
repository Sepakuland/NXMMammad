import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { getLangDate } from "../../../../../utils/getLangDate";
import { CreateQueryString } from '../../../../../utils/createQueryString';
import { useTotalBalanceSheetReportQuery } from '../../../../../features/slices/customerChosenCodingSlice';
import { useSelector } from 'react-redux';
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import { func } from 'prop-types';




const TotalBalanceSheetReportPrint = () => {
    const { t, i18n } = useTranslation();
    const gridContainer = useRef()
    const [fontSize, setFontSize] = useState(12);
    const [gridW, setGridW] = useState();
    const BalanceSheetReport = JSON.parse(localStorage?.getItem(`BalanceSheetReportPrint`))
    const fiscalYear = JSON.parse(localStorage?.getItem(`fiscalYear`))

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
    const [data, setData] = useState([])

    useEffect(() => {
        setSkip(false)
        setQuery(CreateQueryString(BalanceSheetReport))
    }, [])

    const { data: BalanceSheetReportResult = [], isFetching: BalanceSheetReportIsFetching, error: BalanceSheetReportError, currentData: BalanceSheetReportCurrentData } =
        useTotalBalanceSheetReportQuery({ query: query, fiscalYearId: fiscalYear }, { skip: skip });
    useEffect(() => {

        console.log("qqqqqqqqqqqqqqqqqqqq", BalanceSheetReportResult)
        let temp = BalanceSheetReportResult?.map((item) => {
            let creditTotal = item?.credits?.reduce(
                (acc, current) => acc + current,
                0
            );
            let debitTotal = item?.debits?.reduce(
                (acc, current) => acc + current,
                0
            );
            return {
                "totalTitle": item?.codingParent?.name,
                "title": item?.codingParentParent?.name,
                "moeinTitle": item?.name,
                "credit": creditTotal,
                "debit": debitTotal,
                "totalCodingNature": item?.totalCodingNature
            }
        })


        var list = groupData(temp)

        setData(list)
    }, [BalanceSheetReportResult, BalanceSheetReportIsFetching, BalanceSheetReportCurrentData])

    function groupData(data) {
        const mergedData = data.reduce((result, item) => {
            const existingItem = result.find((existingItem) => existingItem.mergedTitle === item.moeinTitle);
            if (existingItem) {
                existingItem.credit += item.credit;
                existingItem.debit += item.debit;
            } else {
                result.push({
                    ...item,
                    mergedTitle: item.moeinTitle,
                    title: item.title,
                    totalTitle: item.totalTitle,
                });
            }
            return result;
        }, []);

        const groupedByCodingNature = mergedData.reduce((result, item) => {
            const codingNature = item.totalCodingNature;
            if (!result[codingNature]) {
                result[codingNature] = [];
            }
            result[codingNature].push(item);
            return result;
        }, {});

        const groupedData = Object.keys(groupedByCodingNature).reduce((result, codingNature) => {
            const items = groupedByCodingNature[codingNature];
            const groupedByGroupTitle = items.reduce((groupedResult, item) => {
                const mergedTitle = item.mergedTitle;
                if (!groupedResult[mergedTitle]) {
                    groupedResult[mergedTitle] = {
                        // mergedTitle: mergedTitle,
                        title: item.title,
                        moeinTitle: item.totalTitle,
                        credit: 0,
                        debit: 0,
                    };
                }
                groupedResult[mergedTitle].credit += item.credit;
                groupedResult[mergedTitle].debit += item.debit;
                return groupedResult;
            }, {});
            result[codingNature] = Object.values(groupedByGroupTitle);
            return result;
        }, {});

        return groupedData;
    }
    /* -------------------------------------------------------------------------- */
    /*                              groupig by title                              */
    /* -------------------------------------------------------------------------- */
    const [debtorData, SetDebtorData] = useState([])
    const [creditorData, setCreditorData] = useState([])
    useEffect(() => {

        var t1 = groupTitleData(data[1])
        var t2 = groupTitleData(data[2])
        // console.log("tttttttttttt", t1, t2)
        if (t2?.length) {
            SetDebtorData(t2)
        }
        if (t1?.length) {
            setCreditorData(t1)
        }


    }, [data])
    console.log("tttttttttttt?", creditorData, debtorData)
    console.log("tttttttttttt!", data[1], data[2])
    function groupTitleData(data) {
        const groupedData = {};

        data?.forEach(item => {
            const key = item.moeinTitle;
            if (!groupedData[key]) {
                groupedData[key] = { ...item };
            } else {
                groupedData[key].credit += item.credit;
                groupedData[key].debit += item.debit;
            }
        });

        return Object.values(groupedData);
    }
    /* -------------------------------------------------------------------------- */
    /*                           get sum of every table                           */
    /* -------------------------------------------------------------------------- */
    function sumOfTable(item, temp) {
        let total = 0;
        item?.map((x) => {
            if (x?.title == temp) {
                total += (x?.credit - x?.debit)
            }
        })

        return total;
    }
    /* ------------------------ get total of every column ----------------------- */
    function totalOfColumn(data) {
        let total = 0
        data?.map((x) => {
            total += (x?.credit - x?.debit)
        })
        return total;
    }

    let temp;
    let tempArr = [];
    let tempArr2 = [];

    let temp2;
    return (
        <>
            <div style={{ userSelect: "none", direction: i18n.dir() }}>
                <div className='TotalBalanceSheetReportPrint d-flex justify-content-center flex-wrap '>
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
                                <div style={{ padding: "0px !important" }} className='col-lg-12 col-md-12 col-xs-12 p-0'>
                                    <div className='header-print-grid'>
                                        <div className='row mb-0'>
                                            <div className='col-lg-4 col-md-4 col-4 m-0'>
                                                <img className='CoddingIcon' src={CoddingIcon} alt={'pic'} />
                                            </div>
                                            <div className='col-lg-4 col-md-4 col-4 m-0 d-flex align-items-center justify-content-center'>
                                                <div>
                                                    <h2 className='title m-0 mb-2'>{t("تست و دمو")}</h2>
                                                    <h3 className='title m-0'>{t("ترازنامه")}</h3>
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-4 col-4 m-0'>
                                                <div className='date_icon'>
                                                    <div className='icons'>

                                                        <Button className='iconButton ' onClick={() => DecreaseSize()}><ZoomOutIcon /></Button>
                                                        <Button className='iconButton' onClick={() => AddSize()} ><ZoomInIcon /></Button>


                                                    </div>

                                                    <div className='date'>
                                                        <p> {t("تاریخ چاپ: ")}{getLangDate(i18n.language, new Date())}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='headerOfLostBenefit-Between header-print-grid'>

                                        <div style={{ width: "50%", display: "flex", alignItems: "center" }}>
                                            <div style={{ width: "20%" }}> {t("از تاریخ")} :‌ {BalanceSheetReport?.DocumentDate[0] ? getLangDate(i18n.language, BalanceSheetReport?.DocumentDate[0]) : ""}</div>
                                            <div >{t("تا")} :‌ {BalanceSheetReport?.DocumentDate[1] ? getLangDate(i18n.language, BalanceSheetReport?.DocumentDate[1]) : ""}</div>
                                        </div>

                                    </div>
                                </div>

                                <div className='TotalBalanceSheetReportPrintBody col-lg-12 col-md-12 col-xs-12 p-0'>
                                    <section className='col-6'>
                                        <div className="debits">
                                            <div>عنوان</div>
                                            <div>بدهکار</div>
                                            {creditorData?.map((item, index) => {
                                                if (index == 0) {
                                                    temp = item?.title
                                                    tempArr.push(item?.title)
                                                }
                                                if (temp != item?.title) {
                                                    temp = item?.title
                                                    tempArr.push(item?.title)
                                                }
                                                console.log("xxxxxxxxxxxxxxxxxxxx", tempArr)
                                                return (
                                                    <>
                                                        {(index > 0 && temp != creditorData[index - 1]?.title) || index == 0 ?
                                                            <div className='totalTitle justify-content-start' style={{ paddingRight: "5px" }}>{temp}</div>
                                                            : <></>}
                                                        <div className='assests p-0'>
                                                            <div style={{ background: "white" }}>{item?.moeinTitle}</div>
                                                            <div style={{ background: "white" }}>{Math.abs(item?.credit - item?.debit)}</div>
                                                        </div>

                                                        {(index > 0 && temp != creditorData[index + 1]?.title) ? <div className='assestsSum p-0'>
                                                            <div>{t("جمع")}‌{temp}:</div>
                                                            <div>{Math.abs(sumOfTable(creditorData, temp))}</div>
                                                        </div> : <></>}

                                                    </>
                                                )
                                            })}




                                        </div>

                                    </section>
                                    <section className='col-6'>
                                        <div className="debits">
                                            <div>عنوان</div>
                                            <div>بدهکار</div>
                                            {debtorData?.map((item, index) => {
                                                if (index == 0) {
                                                    temp2 = item?.title
                                                    tempArr2.push(temp2)
                                                }
                                                if (temp2 != item?.title) {
                                                    temp2 = item?.title
                                                    tempArr2.push(temp2)
                                                }
                                                console.log("temp2", temp2)
                                                return (
                                                    <>
                                                        {(index > 0 && temp2 != debtorData[index - 1]?.title) || index == 0 ?
                                                            <div className='totalTitle justify-content-start' style={{ paddingRight: "5px" }}>{temp2}</div>
                                                            : <></>}
                                                        <div className='assests p-0'>
                                                            <div style={{ background: "white" }}>{item?.moeinTitle}</div>
                                                            <div style={{ background: "white" }}>{Math.abs(item?.credit - item?.debit)}</div>
                                                        </div>

                                                        {(temp2 != debtorData[index - 1]?.title) ? <div className='assestsSum p-0'>
                                                            <div>{t("جمع")}‌{temp2}:</div>
                                                            <div>{Math.abs(sumOfTable(debtorData, temp2))}</div>
                                                        </div> : <></>}

                                                    </>
                                                )
                                            })}




                                        </div>

                                    </section>

                                </div>
                                <div className='col-lg-12 col-md-12 col-xs-12 p-0 d-flex'>
                                    <section className="col-6 d-flex " >
                                        <div className="col-8">{t("مجموع")}‌{tempArr.join(" و ")}:</div>
                                        <div className="col-4">{Math.abs(totalOfColumn(creditorData))}</div>
                                    </section>
                                    <section className="col-6 d-flex " >
                                        <div className="col-8">{t("مجموع")}‌{tempArr2.join(" و ")}:</div>
                                        <div className="col-4">{Math.abs(totalOfColumn(debtorData))}</div>
                                    </section>
                                </div>

                            </div>
                        </div>
                    </div>
                </div >



            </div ></>
    )
}

export default TotalBalanceSheetReportPrint