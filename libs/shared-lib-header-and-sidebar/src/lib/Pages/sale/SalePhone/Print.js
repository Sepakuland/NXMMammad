import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";
import gData from "./gData.json";

const TestPrint = (props) => {

    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    useEffect(() => {
        let tempData = gData.map((data) => {
            return {
                ...data,
                LastOrderDate:data.LastOrderDate!==''? getLangDate(i18n.language,data.LastOrderDate):'',
                UpdateDate:data.UpdateDate!==''? getLangDate(i18n.language,data.UpdateDate):'',
                PartnerCode: parseInt(data.PartnerCode),
            }
        })
        setData(tempData)
    }, [lang])


    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            reorderable: false
        },
        {
            field: 'accountParty',
            name: "طرف حساب",
            children:[
                {
                    field: 'PartnerCode',
                    filterable: false,
                    className:'word-break',
                    name: "کد",
                },
                {
                    field: 'PartnerName',
                    filterable: false,
                    name: "نام",
                },
                {
                    field: 'PartnerLegalName',
                    filterable: false,
                    name: "نام حقوقی",
                },
                {
                    field: 'PartnerZoneAndRoute',
                    filterable: false,
                    name: "منطقه/مسیر",
                },
                {
                    field: 'PartnerGroupName',
                    filterable: false,
                    name: "گروه مشتری",
                },

                {
                    field: 'PartnerTelephones',
                    filterable: false,
                    className:'word-break',
                    name: "تلفن ها",
                },
            ]
        },
        {
            field: 'LastOrderDate',
            filterable: false,
            className:'word-break',
            name: "آخرین خرید",
        },
        {
            field: 'PartnerDebt',
            filterable: false,
            className:'word-break',
            name: "مانده حساب",
        },
        {
            field: 'ConversationResult',
            filterable: false,
            name: "نتیجه مکالمه",
        },
        {
            field: 'OrderPreCode',
            filterable: false,
            name: "پیش فاکتور",
        },
        {
            field: 'lastChange',
            name: "آخرین تغییر",
            children: [
                {
                    field: 'VisitDescription',
                    filterable: false,
                    name: "شرح",
                },
                {
                    field: 'UpdateDate',
                    filterable: false,
                    className:'word-break',
                    name: "تاریخ",
                },

            ]
        },
        {
            field: 'UpdateTime',
            filterable: false,
            className:'word-break',
            name: "ساعت",
        }
    ]


    return (
        <>
            <Print
                printData={data}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("تست و دمو")}
                subTitle={t("فروش تلفنی")}
            />

        </>)
}
export default TestPrint