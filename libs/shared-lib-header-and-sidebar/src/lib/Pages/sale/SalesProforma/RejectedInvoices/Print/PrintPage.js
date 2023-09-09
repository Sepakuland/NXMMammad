import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { useTranslation } from "react-i18next";
import Data from '../Data.json'
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";

const PrintPage = () => {

    const { t, i18n } = useTranslation();
    const lang = i18n.language
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    useEffect(() => {
        let tempData = Data.map((data) => {
            let temp = data.OrderPrice !== '' ? (data.OrderPrice).toString().replaceAll(',', '') : 0;
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                PartnerInsertDate: new Date(data.PartnerInsertDate),
                OrderInsertDate: new Date(data.OrderInsertDate),
                OrderPrice: cost,
                OrderPreCode: data.OrderPreCode !== '' ? parseInt(data.OrderPreCode) : '',
                PartnerCode: data.PartnerCode !== '' ? parseInt(data.PartnerCode) : '',
                WeightSum: data.WeightSum !== '' ? parseInt(data.WeightSum) : '',
                VolumeSum: data.VolumeSum !== '' ? parseInt(data.VolumeSum) : '',
            }
        })
        setData(tempData)
    }, [i18n.language])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    let tempColumn = [
        {
            field: 'IndexCell',
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: 'OrderPreCode',
            name: "پیش فاکتور",
            filter: 'numeric',
            className: "word-break",
        },
        {
            field: "AccountParty",
            name: "طرف حساب",
            children: [
                {
                    field: 'PartnerCode',
                    name: "کد",
                    filter: 'numeric',
                    className: "word-break",
                },
                {
                    field: 'PartnerName',
                    name: "نام",
                },
                {
                    field: 'PartnerLegalName',
                    name: "نام حقوقی",
                },
                {
                    field: 'PartnerInsertDate',
                    name: "تاریخ",
                    // format: "{0:d}",
                    filter: 'date',
                },
                {
                    field: "PartnerAddress",
                    name: "آدرس",
                },
                {
                    field: "PartnerZuneAndPath",
                    name: "منطقه/مسیر",
                },
                {
                    field: 'Remainder',
                    name: "مانده حساب",
                    width: '100px',
                    filter: 'numeric',
                    className: "word-break",
                    cell: CurrencyCell,
                },
                {
                    field: 'OrderDiscountPercent',
                    name: "درصد تخفیف",
                    className: "word-break",
                    filter: 'numeric',
                },
            ]
        },
        {
            field: "FreeProducts",
            name: "اشانتیون ها",
        },
        {
            field: 'OrderPrice',
            name: "مبلغ",
            filter: 'numeric',
            className: "word-break",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'WeightSum',
            name: "وزن (KG)",
            filter: 'numeric',
            className: "word-break",
        },
        {
            field: 'VolumeSum',
            name: "حجم (لیتر)",
            filter: 'numeric',
            className: "word-break",
        },
        {
            field: "SettlementType",
            name: "نحوه تسویه",
        },
        {
            field: "PersonnelName",
            name: "فروشنده",
        },
        {
            field: 'OrderInsertDate',
            name: "تاریخ سفارش",
            // format: "{0:d}",
            filter: 'date',
        },
        {
            field: "OrderInsertDateTime",
            name: "ساعت",
        },
        {
            field: "Description",
            name: "توضیحات",
        },
        {
            field: "RejectReason",
            name: "دلیل عدم تأیید",
        },
       
    ]

    return (

        <Print
            printData={data}
            columnList={tempColumn}
            logo={CoddingIcon}
            title={t("نمایش جزییات")}
            subTitle={t("تایید پیش فاکتور")}

        />
        
    )
}
export default PrintPage









