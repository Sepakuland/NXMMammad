import React, { useEffect,  useState } from "react";
import dataForGrid from "./dataForGrid.json";
import { useTranslation } from "react-i18next";
import ChartPage from '../../../../../components/chart/ChartPage'


function RemittanceReceivableChart() {

    const [data, setData] = useState([])

    const { t, i18n } = useTranslation();

    const [savedCharts, setSavedCharts] = useState([
        { title: 'تست 1', dashboard: false },
        { title: 'تست 2', dashboard: true },
    ])

    useEffect(() => {
        let tempData = dataForGrid.map((data) => {
            let temp = (data.Price).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                DocumentDate: new Date(data.DocumentDate),
                Price: cost,
                DocumentCode: data.DocumentCode !== '' ? parseInt(data.DocumentCode) : '',
                PartnerCode: data.PartnerCode !== '' ? parseInt(data.PartnerCode) : '',
                PartnerTelephones: data.PartnerTelephones !== '' ? parseInt(data.PartnerTelephones) : '',
                BankTransferCode: data.BankTransferCode !== '' ? parseInt(data.BankTransferCode) : '',
            }
        })
        setData(tempData)

    }, [i18n.language])

    const columnsObj = [
        { value: "IndexCell", title: t('ردیف') },
        { value: "DocumentCode", title: t("کد") },
        { value: "DocumentDate", title: t("تاریخ") },
        { value: "PartnerCode", title: t("کد طرف حساب") },
        { value: "PartnerName", title: t('طرف حساب') },
        { value: "PartnerLegalName", title: t("نام حقوقی") },
        { value: "PartnerTelephones", title: t("تلفن") },
        { value: "PartnerAddress", title: t("آدرس") },
        { value: "AccountName", title: t("بانک") },
        { value: "BankTransferCode", title: t("شماره فیش") },
        { value: "Cashier", title: t("صندوقدار") },
        { value: "CollectorName", title: t("تحصیلدار") },
        { value: "Price", title: t("مبلغ") },
        { value: "SettlementDocuments", title: t("تسویه") },
        { value: "DocumentDescription", title: t("توضیحات") },
       
    ]

    const chartObj = [
        { value: "Price", title: t('مبلغ') },
        { value: "DocumentCode", title: t("کد") },
        { value: "BankAccountNumber", title: t("شماره حساب") },
        { value: "PartnerTelephones", title: t("تلفن") },
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

export default RemittanceReceivableChart