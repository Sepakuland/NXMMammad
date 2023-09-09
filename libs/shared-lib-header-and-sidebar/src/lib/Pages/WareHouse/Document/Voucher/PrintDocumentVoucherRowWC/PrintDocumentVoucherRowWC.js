import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next"
import DocumentVoucherRowData from "../DocumentVoucherRowData.json"
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import Print from "sepakuland-component-print";
import {  CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import PrintArrayWC from './PrintArrayWC'
import PrintTotalSumWC from "./PrintTotalSumWC";

const PrintDocumentVoucherRowWC = () => {
    const { t, i18n } = useTranslation();
    
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data[0]



    useEffect(() => {
        let tempData = DocumentVoucherRowData.map((data) => {
            return data.Value.map((moreData) => {
                let temp = (moreData.Fee).toString().replaceAll(',', '')
                let fee = temp !== '' ? parseFloat(temp, 2) : 0

                temp = (moreData.Amount).toString().replaceAll(',', '')
                let amount = temp !== '' ? parseFloat(temp, 2) : 0
                return {
                    ...moreData,
                    Fee: fee,
                    Amount: amount
                }
            })
        })
        setData(tempData)

    }, [i18n.language])

    const CustomFooterSumCount = (props) => {

        const [totalCount, setTotalCount] = useState(0)

        useEffect(() => {
            if (dataRef.current?.length) {
                let tempTotalCount = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotalCount(tempTotalCount)
            }

        }, [dataRef.current])

        return (
            <td>
                {totalCount?.toLocaleString()}
            </td>
        );
    };
    const CustomFooterSumEqual = (props) => {

        const [totalEqual, setTotalEqual] = useState(0)

        useEffect(() => {
            if (dataRef.current?.length) {
                let tempTotalEqual = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotalEqual(tempTotalEqual)
            }

        }, [dataRef.current])

        return (
            <td>
                {totalEqual?.toLocaleString()}
            </td>
        );
    };
    const CustomFooterSumAmount = (props) => {

        const [totalAmount, setTotalAmount] = useState(0)

        useEffect(() => {
            if (dataRef.current?.length) {
                let tempTotalAmount = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotalAmount(tempTotalAmount)
            }

        }, [dataRef.current])

        return (
            <td>
                {totalAmount?.toLocaleString()}
            </td>


        );
    };
    const [sumPrintData, setSumPrintData] = useState([{
        "Code": "",
        "Name": "",
        "Count": "",
        "Equal": "",
        "Fee": "",
        "Amount": 0,
        "Description": ""
    }])

    useEffect(() => {
        let tempSum = 0
        let tempData = data.flat()
        tempData.forEach(data => {
            tempSum += data.Amount
        });
        setSumPrintData([{
            "Code": "",
            "Name": "",
            "Count": "",
            "Equal": "",
            "Fee": "",
            "Amount": tempSum,
            "Description": ""
        }])
    }, [data])




    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: "Code",
            name: "کد کالا"
        },
        {
            field: "Name",
            name: "نام کالا"
        },
        {
            field: "Count",
            name: "تعداد",
            footerCell: CustomFooterSumCount
        },
        {
            field: "Equal",
            name: "معادل",
            footerCell: CustomFooterSumEqual
        },
        {
            field: "Fee",
            name: "فی"
        },
        {
            field: "Amount",
            name: "مبلغ",
            cell: CurrencyCell,
            footerCell: CustomFooterSumAmount,
        },
        {
            field: "Description",
            name: "توضیحات"
        }
    ]

    return (
        <>

            {data?.length && <Print
                printData={data[0]}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("نمایش جزئیات")}
                subTitle={t("چاپ رسید")}
            >
                <div className="row betweens">
                    <div className="col-lg-4 col-md-6 col-6">
                        {t("شماره رسید")}:  986
                    </div>
                    <div className="col-lg-4 col-md-6 col-6">
                        {t("تحویل‌دهنده")} :   مدیر سیستم
                    </div>
                    <div className="col-lg-4 col-md-6 col-6">
                        {t("انباردار")} : حمید رضا پرویزی
                    </div>
                    <div className="col-lg-4 col-md-6 col-6">
                        {t("تاریخ رسید")} : 1401/08/22
                    </div>
                    <div className="col-lg-4 col-md-6 col-6">
                        {t("توضیحات")} :  برگشت از توزیع سرجمع شماره 904
                    </div>
                </div>
            </Print>}
            <div style={{ padding: '0 16px' }}>
                {data?.length && data?.slice(1, data?.length).map((item, index) => {
                    let temp = 0
                    for (let i = 0; i <= index; i++) {
                        temp = temp + data[index].length
                    }
                    return <PrintArrayWC key={index} start={temp} data={item} />
                })}
                <PrintTotalSumWC data={sumPrintData} />
            </div>
            <div className='container Signature'>
                <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                        <div className='up'> {t("امضا تحویل‌دهنده")} :</div>
                        <div className='down'></div>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                        <div className='up'> {t("امضا تحویل‌گیرنده")} :</div>
                        <div className='down'></div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default PrintDocumentVoucherRowWC