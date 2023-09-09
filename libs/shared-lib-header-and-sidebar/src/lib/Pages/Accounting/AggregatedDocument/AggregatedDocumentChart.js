import React, { useEffect, useState } from "react";
import DataForMainGrid from "./DataForMainGrid.json";
import { useTranslation } from "react-i18next";
import ChartPage from '../../../components/chart/ChartPage';


function AggregatedDocumentChart() {

    const [data, setData] = useState([])

    const { t, i18n } = useTranslation();

    const [savedCharts, setSavedCharts] = useState([
        { title: 'تست 1', dashboard: false },
        { title: 'تست 2', dashboard: true },
    ])

    useEffect(() => {
        let tempData = DataForMainGrid.map((data) => {
            let temp = (data.DocumentBalance).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                DocumentInsertDate: new Date(data.DocumentInsertDate),
                DocumentBalance: cost,
                DocumentCode: data.DocumentCode !== '' ? parseInt(data.DocumentCode) : '',
            }
        })
        setData(tempData)

    }, [i18n.language])

    const columnsObj = [
        { value: "IndexCell", title: t('ردیف') },
        { value: "DocumentCode", title: t("ش سند") },
        { value: "DocumentInsertDate", title: t('تاریخ') },
        { value: "DocumentBalance", title: t("تراز") },
        { value: "InsertUser", title: t("درج") },
        { value: "LastUpdateUser", title: t("آخرین تغییر") },
        { value: "DocumentState", title: t("وضعیت") },
        { value: "DocumentDescription", title: t("شرح") },

    ]

    const chartObj = [
        { value: "DocumentBalance", title: t('تراز') },
        { value: "DocumentCode", title: t('ش سند') },
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

export default AggregatedDocumentChart