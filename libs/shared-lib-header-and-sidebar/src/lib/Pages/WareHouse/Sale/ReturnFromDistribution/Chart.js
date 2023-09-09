import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ChartPage from '../../../../components/chart/ChartPage'
import { SaleReturnDistData } from "./SaleReturnDistData";


function Chart() {

    const [data, setData] = useState([])

    const { t, i18n } = useTranslation();

    const [savedCharts, setSavedCharts] = useState([
        { title: 'تست 1', dashboard: false },
        { title: 'تست 2', dashboard: true },
    ])

    useEffect(() => {
        let tempData = SaleReturnDistData.map((data) => {
            return {
                ...data,
                TotalId: data.Value.TotalId,
                TotalCode: data.Value.TotalCode !== '' ? parseInt(data.Value.TotalCode) : '',
                TotalDate: new Date(data.Value.TotalDate),
                TotalDescription: data.Value.TotalDescription,
                PayeeCode: data.Value.PayeeCode !== '' ? parseInt(data.Value.PayeeCode) : '',
                PayeeName: data.Value.PayeeName,
                DriverCode: data.Value.DriverCode !== '' ? parseInt(data.Value.DriverCode) : '',
                DriverName: data.Value.DriverName,
                Status: data.Value.Status
            }
        })
        setData(tempData)

    }, [i18n.language])


    const columnsObj = [
        { value: "TotalCode", title: t('سرجمع') },
        { value: "TotalDate", title: t('تاریخ') },
        { value: "TotalDescription", title: t('توضیحات') },
        { value: "PayeeCode", title: t('کد موزع') },
        { value: "PayeeName", title: t('نام موزع') },
        { value: "DriverName", title: t('نام راننده') },
        { value: "Status", title: t('وضعیت') },
    ]

    const chartObj = [
        { value: "TotalCode", title: t("سرجمع") },
        { value: "TotalDate", title: t("تاریخ") },
        { value: "PayeeCode", title: t("کد موزع") },
        { value: "DriverCode", title: t("کد راننده") }
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