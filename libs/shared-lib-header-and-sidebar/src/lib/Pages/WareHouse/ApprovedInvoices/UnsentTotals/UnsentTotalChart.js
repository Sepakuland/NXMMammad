import React, { useEffect, useState } from "react";
import DataForGrid from "./DataForGrid.json";
import { useTranslation } from "react-i18next";
import ChartPage from '../../../../components/chart/ChartPage'


function ChequeChart() {

    const [data, setData] = useState([])

    const { t, i18n } = useTranslation();

    const [savedCharts, setSavedCharts] = useState([
        { title: 'تست 1', dashboard: false },
        { title: 'تست 2', dashboard: true },
    ])

    useEffect(() => {
        let tempData = DataForGrid.map((data) => {
            let temp = (data.TotalPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                TotalPrice: cost,
                TotalCode: data.TotalCode !== '' ? parseInt(data.TotalCode) : '',
                OrdersCount: data.OrdersCount !== '' ? parseInt(data.OrdersCount) : '',
                MachineVolumeCapacity: data.MachineVolumeCapacity !== '' ? parseInt(data.MachineVolumeCapacity) : '',
                VolumeSum: data.VolumeSum !== '' ? parseInt(data.VolumeSum) : '',
                VolumeSumPercent: data.VolumeSumPercent !== '' ? parseInt(data.VolumeSumPercent) : '',
                MachineWeightCapacity: data.MachineWeightCapacity !== '' ? parseInt(data.MachineWeightCapacity) : '',
                WeightSum: data.WeightSum !== '' ? parseInt(data.WeightSum) : '',
                WeightSumPercent: data.WeightSumPercent !== '' ? parseInt(data.WeightSumPercent) : '',

            }
        })
        setData(tempData)

    }, [i18n.language])

    const columnsObj = [
        { value: "IndexCell", title: t('ردیف') },
        { value: "TotalCode", title: t("شماره سرجمع") },
        { value: "PayeeName", title: t("موزع") },
        { value: "DriverName", title: t("راننده") },
        { value: "Machine", title: t("خودرو") },
        { value: "OrdersCount", title: t("تعداد پیش فاکتور") },
        { value: "TotalPrice", title: t("جمع مبلغ") },
        { value: "MachineVolumeCapacity", title: t("ظرفیت حجمی(dm3/لیتر)") },
        { value: "VolumeSum", title: t("مجموع حجم(dm3/لیتر)") },
        { value: "VolumeSumPercent", title: t("درصد حجم اشغال شده") },
        { value: "MachineWeightCapacity", title: t("ظرفیت وزنی(Kg)") },
        { value: "WeightSum", title: t("مجموع وزن(Kg)") },
        { value: "WeightSumPercent", title: t("درصد وزن اشغال شده") },

    ]

    const chartObj = [
        { value: "TotalCode", title: t("شماره سرجمع") },
        { value: "OrdersCount", title: t("تعداد پیش فاکتور") },
        { value: "TotalPrice", title: t("جمع مبلغ") },
        { value: "MachineVolumeCapacity", title: t("ظرفیت حجمی(dm3/لیتر)") },
        { value: "VolumeSum", title: t("مجموع حجم(dm3/لیتر)") },
        { value: "VolumeSumPercent", title: t("درصد حجم اشغال شده") },
        { value: "MachineWeightCapacity", title: t("ظرفیت وزنی(Kg)") },
        { value: "WeightSum", title: t("مجموع وزن(Kg)") },
        { value: "WeightSumPercent", title: t("درصد وزن اشغال شده") },

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

export default ChequeChart