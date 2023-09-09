import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid"
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
            let temp = (data.InputPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                DocumentDate: getLangDate(lang, new Date(data.DocumentDate)),
                InputPrice: cost,
                DocumentCode: parseInt(data.DocumentCode),
                PartnerTelephones: data.PartnerTelephones !== '' ? parseInt(data.PartnerTelephones) : '',
            }
        })
        setData(tempData)
    }, [lang])


    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: true,

            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            width: "40px",
            reorderable: true
        },
        {
            field: 'DocumentCode',
            name: "پشت نمره",
            filter: 'numeric',
            className: "word-break",
        },
        {
            field: 'ChequeCode',
            name: "شماره چک",
            filter: 'numeric',
            className: "word-break",
        },
        {
            field: 'BankAccountNumber',
            filter: "nameric",
            name: "شماره حساب",
            className: "word-break",
        },
        {
            field: 'BankName',
            name: "بانک",
            reorderable: true
        },
        {
            field: 'Branch',
            name: "شعبه",
        },
        {
            field: 'DocumentDate',
            name: "تاریخ",
            // format: "{0:d}",
            filter: 'date',
            className: "word-break",
        },
        {
            field: 'PartnerCode',
            className: "word-break",
            name: "کد طرف حساب",
        },
        {
            field: 'PartnerName',
            name: "طرف حساب",
        },
        {
            field: 'PartnerTelephones',
            name: "تلفن",
            className: 'text-center word-break',
        },
        {
            field: 'PartnerAddress',
            name: "آدرس",
        },
        {
            field: 'Delivery',

            name: "تحویل دهنده",
            className: 'text-center',
        },
        {
            field: 'CashAccount',

            name: "صندوق",
            className: 'text-center',
        },
        {
            field: 'Cashier',

            name: "صندوقدار",
            className: 'text-center',
        },
        {
            field: 'Issuance',

            name: "محل صدور",
            className: 'text-center',
        },
        {
            field: 'MaturityDate',
            name: "تاریخ سررسید",
            // format: "{0:d}",
            filter: 'date',
            className: "word-break",
        },
        {
            field: 'InputPrice',
            name: "مبلغ",
            filter: 'numeric',
            className: "word-break",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'SettlementDocuments',
            name: "تسویه",
            className: 'text-center',
        },
        {
            field: 'PayedToPartnerName',
            name: "خرج به",
            className: 'text-center',
        },
        {
            field: 'chequeState',
            name: "وضعیت ",
            className: 'text-center',
        },
        {
            field: 'DocumentDescription',
            name: "توضیحات",
            className: 'text-center',
        },


    ]

    return (

        <Print
            printData={data}
            columnList={tempColumn}
            logo={CoddingIcon}
            title={t("نمایش جزییات")}
            subTitle={t("دریافت چک")}

        />
    )
}
export default PrintPage









