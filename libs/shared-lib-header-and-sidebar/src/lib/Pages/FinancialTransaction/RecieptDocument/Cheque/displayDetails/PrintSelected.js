import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import PrintSelectedData from './PrintSelectedData.json'
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintSelected = () => {

    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data


    useEffect(() => {
        let tempData = PrintSelectedData.map((data) => {
            let temp = (data.Price).toString().replaceAll(',', '')
            let temp2 = (data.ComplyWithReceipt).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            let cost2 = parseFloat(temp2, 2)
            return {
                ...data,
                DocumentDate: getLangDate(lang, new Date(data.DocumentDate)),
                Price: cost,
                ComplyWithReceipt: cost2
            }
        })
        setData(tempData)
    }, [lang])


    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
        },
        {
            field: 'type',
            className: 'text-center',
            name: "نوع",
        },
        {
            field: 'number',
            className: 'text-center',
            name: "شماره",
        },
        {
            field: 'Price',
            name: "مبلغ",
            cell:CurrencyCell,
        },
        {
            field: 'ComplyWithReceipt',
            cell:CurrencyCell,
            name: "تطبیق با این دریافت",
        }]

    return (
        <Print
            printData={data}
            columnList={tempColumn}
            logo={CoddingIcon}
            title={t("نمایش جزییات")}
            subTitle={t("دریافت حواله")}
        >
            <div className='row betweens'>
                <div className='col-lg-6 col-md-6 col-6'>{t("پشت نمره")}: 598</div>
                <div className='col-lg-6 col-md-6 col-6'>{t("تاریخ دریافت")} : 1401/06/11</div>
                <div className='col-lg-6 col-md-6 col-6'>{t("شماره چک")} :31510000</div>
                <div className='col-lg-6 col-md-6 col-6'>{t("مبلغ")} :180,800</div>
                <div className='col-lg-6 col-md-6 col-6'>{t("تاریخ سررسید")} : 1401/06/13</div>
                <div className='col-lg-6 col-md-6 col-6'>{t("نام بانک")} : شرکت دولتی پست بانک شرکت دولتی پست بانک</div>
                <div className='col-lg-6 col-md-6 col-6'>{t("نام شعبه")} :1365</div>
                <div className='col-lg-6 col-md-6 col-6'>{t("کد شعبه")} :132132</div>
                <div className='col-lg-6 col-md-6 col-6'>{t("شهر محل صدور")} :شیرکوه </div>
                <div className='col-lg-6 col-md-6 col-6'>{t("طرف حساب ")} :سیسی فتاحی(مانده: 495,338,289 بستانکار)</div>
                <div className='col-lg-6 col-md-6 col-6'>{t("تحویل دهنده")} :ییبی</div>
                <div className='col-lg-6 col-md-6 col-6'>{t("شرح")} :</div>
            </div>
        </Print>

    )
}
export default PrintSelected









