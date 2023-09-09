import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import DatePrintData from '../../SaleTotalBatchReceipt/DisplayDetails/DatePrintData.json'
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const DatePrint = (props) => {


    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    useEffect(() => {
        let tempData = DatePrintData.map((data) => {
            let temp = (data.TotalInvoices).toString().replaceAll(',', '')
            let temp2 = (data.CashReceive).toString().replaceAll(',', '')
            let temp3 = (data.PaymentInCash).toString().replaceAll(',', '')
            let temp4 = (data.BankReceive).toString().replaceAll(',', '')
            let temp5 = (data.ChequeReceive).toString().replaceAll(',', '')
            let temp6 = (data.CashReceiveDistributor).toString().replaceAll(',', '')
            let temp7 = (data.DistributedDeficit).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            let cost2 = parseFloat(temp2, 2)
            let cost3 = parseFloat(temp3, 2)
            let cost4 = parseFloat(temp4, 2)
            let cost5 = parseFloat(temp5, 2)
            let cost6 = parseFloat(temp6, 2)
            let cost7 = parseFloat(temp7, 2)
            return {
                ...data,
                TotalInvoices: cost,
                CashReceive: cost2,
                PaymentInCash: cost3,
                BankReceive: cost4,
                ChequeReceive: cost5,
                CashReceiveDistributor: cost6,
                DistributedDeficit: cost7,

                productCode: parseInt(data.productCode),

            }
        })
        setData(tempData)
    }, [i18n.language])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: 'Total',
            name: "سرجمع",
            className: 'word-break',
            // width: '60px',
        },
        {
            field: 'DistributorCode',
            name: "کد موزع",
            className: 'word-break',
            // width: '60px',
        },
        {
            field: 'DistributorName',
            name: "نام موزع",
            // width: '60px',
        },
        {
            field: 'TotalInvoices',
            // width: '60px',
            name: "جمع فاکتورها",
            footerCell: CustomFooterSome,
            className: 'word-break',
            cell: CurrencyCell,
        },
        {
            field: 'CashReceive',
            // width: '60px',
            name: "دریافت نقد",
            className: 'word-break',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'PaymentInCash',
            // width: '60px',
            name: "پرداخت نقد",
            className: 'word-break',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'BankReceive',
            // width: '60px',
            name: "دریافت بانک",
            className: 'word-break',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'ChequeReceive',
            // width: '60px',
            name: "دریافت چک",
            className: 'word-break',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'CashReceiveDistributor',
            // width: '60px',
            name: "دریافت نقد از موزع",
            className: 'word-break',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'DistributedDeficit',
            // width: '60px',
            name: "کسری موزع",
            className: 'word-break',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
    ]

    return (
        <>
            <Print
                printData={data}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("تست و دمو")}
                subTitle={t("چاپ روزانه دریافت سرجمع")}
            >

            </Print>
        </>)
}
export default DatePrint