import React, {useEffect, useState} from "react";
import gData from "./gData.json";
import {useTranslation} from "react-i18next";
import ChartPage from '../../../components/chart/ChartPage'


function SalePhoneChart() {

    const [data, setData] = useState([])

    const {t, i18n} = useTranslation();

    const [savedCharts, setSavedCharts] = useState([
        {title: 'تست 1', dashboard: false},
        {title: 'تست 2', dashboard: true},
    ])


    useEffect(() => {
        let tempData = gData.map((data, index) => {
            return {
                ...data,
                IndexCell: index + 1,
                LastOrderDate: data.LastOrderDate !== '' ? new Date(data.LastOrderDate) : '',
                UpdateDate: data.UpdateDate !== '' ? new Date(data.UpdateDate) : '',
                PartnerCode: parseInt(data.PartnerCode),
            }
        })
        setData(tempData)

    }, [i18n.language])



    const columnsObj = [
        {
            value: "IndexCell",
            title: t("ردیف")
        },
        {
            value: "PartnerCode",
            title: t("طرف حساب - کد"),
        },
        {
            value: "PartnerName",
            title: t("طرف حساب - نام"),
        },
        {
            value: "PartnerLegalName",
            title: t("طرف حساب - نام حقوقی"),
        },
        {
            value: "PartnerZoneAndRoute",
            title: t("طرف حساب - منطقه/مسیر"),
        },
        {
            value: "PartnerGroupName",
            title: t("طرف حساب - گروه مشتری"),
        },
        {
            value: "PartnerTelephones",
            title: t("طرف حساب - تلفن ها"),
        },
        {
            value: "editAccountParty12",
            title: t("ویرایش طرف حساب")
        },
        {
            value: "LastOrderDate",
            title: t("آخرین خرید")
        },
        {
            value: "PartnerDebt",
            title: t("مانده حساب")
        },
        {
            value: "ConversationResult",
            title: t("نتیجه مکالمه")
        },
        {
            value: "OrderPreCode",
            title: t("پیش فاکتور")
        },
        {
            value: "VisitDescription",
            title: t("آخرین تغییر - شرح"),
        },
        {
            value: "UpdateDate",
            title: t("آخرین تغییر - تاریخ"),
        },
        {
            value: "UpdateTime",
            title: t("ساعت")
        }
    ]

    const chartObj = [
        {value: "PartnerCode", title: t('کد')},
    ]

    return (
        <>
            <ChartPage
                data={data}
                columnsObj={columnsObj}
                chartObj={chartObj}
                savedCharts={savedCharts}
            />
        </>
    )
}

export default SalePhoneChart