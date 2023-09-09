import React, { useEffect, useState } from "react";
import data2 from "./CashData.json";
import { useTranslation } from "react-i18next";
import ChartPage from '../../../../../components/chart/ChartPage'


function Chart() {

    const [data, setData] = useState([])

    const { t, i18n } = useTranslation();

    const [savedCharts, setSavedCharts] = useState([
        { title: 'تست 1', dashboard: false },
        { title: 'تست 2', dashboard: true },
    ])


    useEffect(() => {
        let tempData = data2.map((data) => {
            let temp = (data.Price).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)

            return {
                ...data,
                DocumentDate: new Date(data.DocumentDate),
                Price: cost,
                DocumentCode: parseInt(data.DocumentCode),
                PartnerCode: data.PartnerCode ? parseInt(data.PartnerCode) : '',
                // PartnerTelephones: data.PartnerTelephones !== '' ? parseInt(data.PartnerTelephones) : '',
            }
        })
        setData(tempData)

    }, [i18n.language])


    console.log('data', data)

    const columnsObj = [
        { value: "DocumentCode", title: t('کد') },
        { value: "DocumentDate", title: t('تاریخ') },
        { value: "PartnerCode", title: t('کد طرف حساب') },
        { value: "PartnerName", title: t('طرف حساب') },
        { value: "PartnerLegalName", title: t('نام حقوقی') },
        { value: "PartnerTelephones", title: t('تلفن') },
        { value: "PartnerAddress", title: t('ادرس') },
        { value: "CashAccountName", title: t('صندوق') },
        { value: "Price", title: t('مبلغ') },




    ]

    const chartObj = [

        { value: "PartnerCode", title: t('کد طرف حساب') },
        { value: "Price", title: t('مبلغ') },
        { value: "DocumentCode", title: t('کد') },
        { value: "DocumentDate", title: t('تاریخ') },

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

export default Chart