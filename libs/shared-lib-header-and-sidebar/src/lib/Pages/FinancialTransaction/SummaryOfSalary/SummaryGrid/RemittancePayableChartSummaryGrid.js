import React, { useEffect, useRef, useState } from "react";
import dataForGrid from "./dataForGridSummaryGrid.json";
import { useTranslation } from "react-i18next";
import ChartPage from '../../../../components/chart/ChartPage'


function ChartRemittancePayable() {

    const [data, setData] = useState([])

    const { t, i18n } = useTranslation();

    const [savedCharts, setSavedCharts] = useState([
        { title: 'تست 1', dashboard: false },
        { title: 'تست 2', dashboard: true },
    ])

    useEffect(() => {
        let tempData = dataForGrid.map((data) => {

            let temp = (data.TotalPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
      
      
            return {
              ...data,
              DocumentDate: new Date(data.DocumentDate),
              TotalPrice: cost,
             
              DocumentCode: parseInt(data.DocumentCode),
             
            }
          })
          setData(tempData)

    }, [i18n.language])
// "DocumentCode": "2",
  // "DocumentDate": "1401/04/22",
  // "CreditAccountCode": "30000001",
  // "CreditAccountName": "صندوق اصلی",
  // "TotalPrice": "20,000,000",
  // "DocumentDescription": "بابت",
  // "DocumentId": "af3c4392-c6e0-4213-ae67-21142199f697"
    const columnsObj = [
        { value: "IndexCell", title: t('ردیف') },
        { value: "DocumentCode", title: t('کد') },
        { value: "DocumentDate", title: t('تاریخ') },
        { value: "TotalPrice", title: t("جمع مبلغ") },
        { value: "CreditAccountName", title: t("نام") },      
        { value: "DocumentDescription", title: t("توضیحات") },
    ]

    const chartObj = [
        
        { value: "TotalPrice", title: t("جمع مبلغ") },
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

export default ChartRemittancePayable