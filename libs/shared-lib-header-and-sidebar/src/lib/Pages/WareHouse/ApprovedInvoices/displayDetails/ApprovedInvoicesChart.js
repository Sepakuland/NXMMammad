import React, { useEffect, useState } from "react";
import DisplayDitailsData from "./DisplayDitailsData.json";
import { useTranslation } from "react-i18next";
import ChartPage from '../../../../components/chart/ChartPage'


function ApprovedInvoicesChart() {

    const [data, setData] = useState([])

    const { t, i18n } = useTranslation();

    const [savedCharts, setSavedCharts] = useState([
        { title: 'تست 1', dashboard: false },
        { title: 'تست 2', dashboard: true },
    ])

    useEffect(() => {
        let tempData = DisplayDitailsData.map((data) => {
            let temp = (data.OrderPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                OrderInsertDate: new Date(data.OrderInsertDate),
                OrderPrice: cost,
                OrderPreCode: data.OrderPreCode !== '' ? parseInt(data.OrderPreCode) : '',
                PartnerCode: data.PartnerCode !== '' ? parseInt(data.PartnerCode) : '',
                VolumeSum: data.VolumeSum !== '' ? parseInt(data.VolumeSum) : '',
                WeightSum: data.WeightSum !== '' ? parseInt(data.WeightSum) : '',
            }
        })
        setData(tempData)

    }, [i18n.language])

    const columnsObj = [
        { value: "IndexCell", title: t("ردیف") },
        { value: "OrderPreCode", title: t("شماره پیش فاکتور") },
        { value: "PartnerCode", title: t("کد طرف حساب") },
        { value: "PartnerName", title: t("نام طرف حساب") },
        { value: "PartnerZuneAndPath", title: t('منطقه و مسیر') },
        { value: "PartnerDistributionPath", title: t("مسیر توزیع") },
        { value: "PartnerAddress", title: t("آدرس") },
        { value: "OrderPrice", title: t("مبلغ") },
        { value: "SettlementType", title: t("نحوه تسویه") },
        { value: "PersonnelName", title: t("ویزیتور") },
        { value: "OrderInsertDate", title: t("تاریخ فاکتور") },
        { value: "Description", title: t("توضیحات") },
        { value: "VolumeSum", title: t("حجم (لیتر)") },
        { value: "WeightSum", title: t("وزن (Kg)") },


    ]

    const chartObj = [
        { value: "OrderPreCode", title: t("شماره پیش فاکتور") },
        { value: "PartnerCode", title: t("کد طرف حساب") },
        { value: "OrderPrice", title: t("مبلغ") },
        { value: "OrderInsertDate", title: t("تاریخ فاکتور") },
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

export default ApprovedInvoicesChart