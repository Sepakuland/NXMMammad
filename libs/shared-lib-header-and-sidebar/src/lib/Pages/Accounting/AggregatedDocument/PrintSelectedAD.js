import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import PrintSelectedADData from './PrintSelectedADData.json'
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";
import StringFooterSome from './StringFooterSome'

const PrintSelectedAD = () => {

    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data




    useEffect(() => {
        let tempData = PrintSelectedADData.map((data) => {
            let temp = (data.debtor).toString().replaceAll(',', '')
            let temp2 = (data.creditor).toString().replaceAll(',', '')
            let cost = data.debtor !== '' ? parseFloat(temp, 2) : 0
            let cost2 = data.creditor !== '' ? parseFloat(temp2, 2) : 0
            return {
                ...data,
                debtor: cost,
                creditor: cost2,
                moein: data.moein !== '' ? parseInt(data.moein) : '',
                comparative: data.comparative !== '' ? parseInt(data.comparative) : '',

            }
        })
        setData(tempData)
    }, [lang])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    const CustomStringFooterSome = (props) => <StringFooterSome {...props} fieldSome={'debtor'} lang={lang} data={dataRef.current} />

    const NoneFooter = (props) => <></>

    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: 'moein',
            name: "معین",
            // width: '80px',
            filter: 'numeric',
            footerCell: NoneFooter

        },
        {
            field: 'comparative',
            name: "تفضیلی",
            // width: '80px',
            footerCell: NoneFooter
        },
        {
            field: 'Description',
            width: '800px',
            name: "توضیحات",
            footerCell: CustomStringFooterSome
        },
        {
            field: 'debtor',
            // width: '80px',
            name: "بدهکار",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'creditor',
            // width: '80px',
            name: "بستانکار",
            footerCell: CustomFooterSome,
            cell: CurrencyCell,

        },


    ]

    return (
        <>
            <Print
                printData={data}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("نمایش جزییات")}
                subTitle={t("سند حسابداری")}
            >

                <div className='row betweens'>
                    <div className='col-lg-4 col-md-4 col-4'>{t("شماره سند")}: 31763</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("شماره پیگیری")}:33043 </div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("تاریخ سند")}: 1401/05/30</div>
                    <div className='col-lg-6 col-md-6 col-6'>{t("شرح سند  ")}:بابت</div>
                </div>
            </Print>

            <div className='row footer-AggregatedDocument'>
                <div className='col-lg-6 col-md-6 col-6'>{t("تنظیم کننده")}:</div>
                <div className='col-lg-6 col-md-6 col-6'>{t("تایید کننده")}:</div>
            </div>

        </>
    )
}
export default PrintSelectedAD








