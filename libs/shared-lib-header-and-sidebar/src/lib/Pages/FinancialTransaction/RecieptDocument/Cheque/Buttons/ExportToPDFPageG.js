import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const ExportToPDFPageG = () => {
    const emptyCheque = { serial: "", BackNumber: "", maturity: "", bankCode: "", bankName: "", amount: "", partnerCode: "", partnerName: "", legalName: "", description: "" }

    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data
    const datasource = JSON.parse(localStorage.getItem(`cheque`))
    console.log("datasource", datasource)
    useEffect(() => {
        let tempData = datasource.map((data) => {

            let temp = (data.amount).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                maturity: getLangDate(lang, new Date(data.maturity)),
                amount: cost,
                serial: parseInt(data.serial),
                BackNumber: data.BackNumber !== '' ? parseInt(data.BackNumber) : '',
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
            field: 'BackNumber',
            name: "پشت نمره",
            filter: 'numeric',
            className: "word-break",
        },
        {
            field: 'maturity',
            name: "تاریخ سررسید",
            // format: "{0:d}",
            filter: 'date',
         
            className: "word-break",
        },
        {
            field: 'serial',
            filter: "nameric",
            name: "سریال",
            className: "word-break",
        },
        {
            field: 'bankCode',
            name: "کد بانک",
            reorderable: true
        },
        {
            field: 'bankName',
            name: "نام بانک",
        },
        {
            field: 'amount',
            name: "مبلغ",
            filter: 'numeric',
            className: "word-break",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'partnerCode',
            className: "word-break",
            name: "کد طرف حساب",
        },
        {
            field: 'partnerName',
            name: "نام طرف حساب",
        },
        {
            field: 'legalName',
            name: "نام حقوقی",
            className: 'text-center word-break',
        },
        {
            field: 'description',
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
            subTitle={t("چک های بازپسداده شده")}

        />
    )
}
export default ExportToPDFPageG









