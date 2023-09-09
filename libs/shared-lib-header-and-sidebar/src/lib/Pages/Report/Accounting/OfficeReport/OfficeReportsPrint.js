import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import DateCell from '../../../../components/RKGrid/DateCell';
import CurrencyCell from '../../../../components/RKGrid/CurrencyCell';
import {PrintGrid} from 'sepakuland-component-print';
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg"
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { Button, CircularProgress } from '@mui/material';
import { getLangDate } from "../../../../utils/getLangDate";
import '../../../../components/RKGrid/style.css'


const OfficeReportsPrint = () => {
    const { t, i18n } = useTranslation();
    const OfficeReportsData = JSON?.parse(localStorage?.getItem(`OfficeReportsData`))
    const [printData, setPrintData] = useState([])
    const [gridW, setGridW] = useState();
    const [fontSize, setFontSize] = useState(12);
    const gridContainer = useRef()
    const [reportsIndex, setReportsIndex] = useState([]);
    const [footerIndex, setFooterIndex] = useState([]);
    const ReportsIndex = []



    /* ----------------------- calculation of footer index ---------------------- */
    let arr = []
    let x = 0;
    const calculateFooterIndex = (number) => {
        if (arr.length === 0) {
            arr.push(x + number + 1)
        }
        else {
            let y = arr[arr.length - 1] + x + number + 1
            arr.push(y)
        }
        setFooterIndex(arr)

    }
    /* -----------------------groupByDocumentNumber(data)------------------------ */
    useEffect(() => {
        var data = groupByDocumentNumber(OfficeReportsData)
        setPrintData(data)
    }, [])

    useEffect(() => {
        let previousIndex = null;
        let i = printData[0]?.[1]?.[0]?.OfficeIndex
        printData[0]?.map((item, index) => {
            ReportsIndex.push(item[0].OfficeIndex)
            item.forEach((x) => {
                ReportsIndex.push(i)
                i++;

            })
            if (previousIndex !== null && previousIndex !== index) {
                i++;
            }
            calculateFooterIndex(item.length)
            previousIndex = index;
        });
        ReportsIndex.map((data, index) => {
            setReportsIndex(x => [...x, index + 1])
        })
    }, [printData])
    function groupByDocumentNumber(data) {
        const groupedData = [];
        data?.forEach((item, index) => {
            
            const documentNumber = item.documentNumber;
            if (groupedData[documentNumber]) {
                groupedData[documentNumber].push({
                    ...item,
                    "OfficeIndex": index + 1
                }
                );
            } else {
                groupedData[documentNumber] = [{
                    ...item,
                    "OfficeIndex": index + 1
                }];
            }
        });
        return [groupedData];
    }
    const dataRef = useRef();

    dataRef.current = OfficeReportsData;
    const [final, setFinal] = useState([])

    const CustomFooterSome = () => {
        return (
            <tr>
                <td style={{ borderLeft: "unset", background: "rgb(242 242 242)", width: "10%", fontWeight: "100" }}>{t("به شرح سند")}:</td>
            </tr >
        )
    }
    let i = 0;

    const [ii, setII] = useState(0)
    const IndexFooter = (props) => {
        const { data, index } = props;
        if (index >= 0 && index < data.length) {
            if (index % 26 === 0) {
                setII(data[index])
                return (
                    <td>halalalay lalay</td>
                )
            }
            else {
                setII(data[index])
                return (
                    <td style={{ borderLeft: "1px solid #dadada", background: "rgb(242 242 242)", width: "10%", fontWeight: "100" }}>
                        {data[index]}
                    </td>
                );
            }

        }

        // Return an empty cell when i > data.length
        return <td ></td>;
    };

    const CustomFooterIndex = (props) => <IndexFooter {...props} data={footerIndex} index={i++} />
    const EmptyFooter = () => {
        return (
            <td style={{ background: "rgb(242 242 242)", border: "unset" }}></td>
        )
    }
    let tempColumn = [
        {
            field: 'OfficeIndex',
            filterable: false,
            width: '50px',
            name: "ردیف",
            sortable: false,
            reorderable: false,
            footerCell: CustomFooterIndex,
        },
        {
            field: 'documentNumber',
            filterable: true,
            name: "سند",
            filter: 'numeric',
            width: '60px',
            footerCell: CustomFooterSome,
        },
        {
            field: 'documentDate',
            cell: DateCell,
            filterable: true,
            name: "تاریخ",
            width: '60px',
            filter: 'numeric',
            footerCell: EmptyFooter
        },
        {
            field: 'totalName',
            filterable: true,
            name: "حساب کل",
            width: "150px",
            filter: 'numeric',
            footerCell: EmptyFooter
        },
        {
            field: 'debits',
            filterable: true,
            name: "بدهکار",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: EmptyFooter
        },
        {
            field: 'credits',
            filterable: true,
            name: "بستانکار",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: EmptyFooter

        },
        {
            field: 'Remainder',
            filterable: true,
            name: "مانده",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: EmptyFooter,
        },
        {
            field: 'recognize',
            filterable: true,
            name: "تشخیص",
            filter: 'numeric',
            width: '100px',
            footerCell: EmptyFooter

        },
    ]
    /* ---------------------------- Change font size ---------------------------- */
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);
    useEffect(() => {
        setGridW(gridContainer?.current?.offsetWidth - 20)
    }, [])
    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }
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
    /* --------------------------final data for show----------------------------- */
    let size = 0
    useEffect(() => {
        let temp = [];
        const filteredF = reportsIndex.filter((item) => !footerIndex.includes(item));
        if (!!printData[0]?.length) {
            let i = 0
            printData[0]?.map((data) => {
                let xyz = data?.map((item) => {
                    return (
                        {
                            ...item,
                            "OfficeIndex": filteredF[i++]
                        }
                    )
                })
                temp.push(xyz)
            })

            setFinal([temp])
            let x = 1;
            footerIndex?.forEach((element) => {
                if (element <= 26) {
                    x++
                }
            })
            chunkArray(26 - x + 1)
        }
    }, [footerIndex, reportsIndex])
    /* --------- calculation for every 26 row and show it in print page --------- */
    const [creditTotal, setCreditTotal] = useState([]);
    const [debitTotal, setDebitTotal] = useState([]);
    const [chunk, setChunk] = useState();
    function chunkArray(chunkSize) {
        const chunks = [];
        let i = 0;
        let totalC = 0;
        let totalD = 0;
        while (i < OfficeReportsData.length) {
            chunks.push(OfficeReportsData.slice(i, i + chunkSize));
            i += chunkSize;
        }
        /* ----------calculate sum of credit_debit every 26row ----------- */
        let preview = null;
        let credits = []
        let debits = []
        chunks?.map((data, index) => {
            preview = index
            data?.map((item) => {
                totalC += item?.credits
                totalD += item?.debits
            })
            credits.push(totalC)
            debits.push(totalD)
        })
        setChunk(chunks)
        setCreditTotal(credits)
        setDebitTotal(debits)
    }


    return (
        <div className="OfficeReportGrids">
            {final?.length <= 0 ? (
                <CircularProgress /> // Render the loading indicator
            ) : (

                final[0]?.map((item, index) => {
                    if (index === 0) {
                        return (
                            <div className='officePrint'>
                                <div className='row justify-content-center'>
                                    <div className='col-lg-11 col-md-12 col-sm-12 col-12'>
                                        <div
                                            style={{ direction: i18n.dir() }}>
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
                                            <div className='row'>
                                                <div className='col-lg-12 col-md-12 col-xs-12'>
                                                    <div className='header-print-grid-officeReport'>
                                                        <div className='row mb-0' style={{ height: "100px" }}>
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
                                </div>

                                <div >
                                    <PrintGrid
                                        printData={item}
                                        columnList={tempColumn}

                                    >
                                        <div className="OfficeReportsPrint">
                                            <div style={{ width: "50%", display: "flex", alignItems: "center" }}>
                                                <div style={{ width: "20%" }}>{t("از سند")} :</div>
                                                <div>{t("تا")} :</div>
                                            </div>
                                            <div style={{ width: "50%", display: "flex", alignItems: "center" }}>
                                                <div style={{ width: "20%" }}> {t("از تاریخ")} :</div>
                                                <div >{t("تا")} :</div>
                                            </div>

                                        </div>
                                    </PrintGrid>
                                </div >
                            </div >

                        )
                    } else {

                        if (index > 0) {
                            return (
                                <div className="GridReports" style={{ marginTop: "-37px" }}>
                                    <PrintGrid
                                        printData={item}
                                        columnList={tempColumn}
                                    ></PrintGrid>
                                </div>
                            )
                        }
                    }
                })
            )}
        </div>
    )
}
export default OfficeReportsPrint
