import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import dataForGrid from './dataForGrid.json'
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintPage = () => {

    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    useEffect(() => {
        let tempData = dataForGrid.map((data) => {
            let temp = (data.Price).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                DocumentDate: getLangDate(lang,new Date(data.DocumentDate)),
                Price: cost,
                DocumentCode: data.DocumentCode !== '' ? parseInt(data.DocumentCode) : '',
                PartnerCode: data.PartnerCode !== '' ? parseInt(data.PartnerCode) : '',
                PartnerTelephones: data.PartnerTelephones !== '' ? parseInt(data.PartnerTelephones) : '',
                BankTransferCode: data.BankTransferCode !== '' ? parseInt(data.BankTransferCode) : '',
            }
        })
        setData(tempData)
    }, [lang])


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
            field: 'DocumentCode',
            name: "کد",
            className: 'word-break',
        },
        {
            field: 'DocumentDate',
            name: "تاریخ",
            // format: "{0:d}",
            className: 'word-break text-center',
        },
        {
            field: 'PartnerCode',
            name: "کد طرف حساب",
            className: 'word-break',
        },
        {
            field: "PartnerName",
            name: 'طرف حساب',
            className: 'word-break',
        },
        {
            field: 'PartnerLegalName',
            name: "نام حقوقی",
            className: 'text-center',
        },
        {
            field: 'PartnerTelephones',
            name: "تلفن",
            className: 'word-break',
        },
        {
            field: 'PartnerAddress',
            name: "آدرس",
            className: 'text-center',
        },
        {
            field: 'AccountName',
            name: "بانک",
            className: 'text-center',
        },
        {
            field: 'BankTransferCode',
            name: "شماره فیش",
            className: 'word-break',
        },
        {
            field: 'Cashier',
            name: "صندوقدار",
            className: 'text-center',
        },
        {
            field: 'CollectorName',
            name: "تحصیلدار",
            className: 'text-center',
        },
        {
            field: 'Price',
            name: "مبلغ",
            className: 'word-break',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'SettlementDocuments',
            name: "تسویه",
            width: '160px',
            className: 'word-break',
        },
        {
            field: 'DocumentDescription',
            name: "توضیحات",
            width: '160px',
            className: 'text-center',
        },
    ]

    return (

        <Print
            printData={data}
            columnList={tempColumn}
            logo={CoddingIcon}
            title={t("نمایش جزییات")}
            subTitle={t("دریافت بانکی")}

        />
    )
}
export default PrintPage









