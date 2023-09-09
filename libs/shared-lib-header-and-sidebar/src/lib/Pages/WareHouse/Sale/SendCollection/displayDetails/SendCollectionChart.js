import React, { useEffect, useRef, useState } from "react";
import Data from './Data.json'
import { useTranslation } from "react-i18next";
import ChartPage from '../../../../../components/chart/ChartPage'


function SendCollectionChart() {

    const [data, setData] = useState([])

    const { t, i18n } = useTranslation();

    const [savedCharts, setSavedCharts] = useState([
        { title: 'تست 1', dashboard: false },
        { title: 'تست 2', dashboard: true },
    ])

    useEffect(() => {
        let tempData = Data.map((data) => {
            let temp = (data.TotalPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                TotalPriceTotalDate: new Date(data.TotalPriceTotalDate),
                PossibleShipmentDate: new Date(data.PossibleShipmentDate),
                TotalPrice: cost,
                TotalCode: data.TotalCode !== '' ? parseInt(data.TotalCode) : '',
                OrdersCount: data.OrdersCount !== '' ? parseInt(data.OrdersCount) : '',
                VolumeSum: data.VolumeSum !== '' ? parseInt(data.VolumeSum) : '',
                WeightSum: data.WeightSum !== '' ? parseInt(data.WeightSum) : '',
            }
        })
        setData(tempData)

    }, [i18n.language])

    const columnsObj = [
        { value: "IndexCell", title: t("ردیف") },
        { value: "TotalCode", title: t("شماره سرجمع") },
        { value: "TotalDate", title: t("تاریخ سرجمع") },
        { value: "PossibleShipmentDate", title: t("تاریخ پیشنهادی ارسال") },
        { value: "PayeeName", title: t("موزع") },
        { value: "DriverName", title: t("راننده") },
        { value: "Machine", title: t("خودرو") },
        { value: "OrdersCount", title: t("تعداد پیش فاکتور") },
        { value: "TotalPrice", title: t("مبلغ") },
        { value: "VolumeSum", title: t("حجم (لیتر)") },
        { value: "WeightSum", title: t("وزن (Kg)") },
        { value: "TotalDescription", title: t("توضیحات") },
    ]

    const chartObj = [
        { value: "TotalCode", title: t("شماره سرجمع") },
        { value: "TotalDate", title: t("تاریخ سرجمع") },
        { value: "PossibleShipmentDate", title: t("تاریخ پیشنهادی ارسال") },
        { value: "Machine", title: t("خودرو") },
        { value: "OrdersCount", title: t("تعداد پیش فاکتور") },
        { value: "TotalPrice", title: t("مبلغ") },
        { value: "VolumeSum", title: t("حجم (لیتر)") },
        { value: "WeightSum", title: t("وزن (Kg)") },

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

export default SendCollectionChart