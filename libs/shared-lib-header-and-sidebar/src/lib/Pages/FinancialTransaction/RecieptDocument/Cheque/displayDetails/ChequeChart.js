import React, { useEffect, useState } from "react";
import dataForGrid from "./dataForGrid.json";
import { useTranslation } from "react-i18next";
import ChartPage from '../../../../../components/chart/ChartPage'


function ChequeChart() {

    const [data, setData] = useState([])

    const { t, i18n } = useTranslation();

    const [savedCharts, setSavedCharts] = useState([
        { title: 'تست 1', dashboard: false },
        { title: 'تست 2', dashboard: true },
    ])

    useEffect(() => {
        let tempData = dataForGrid.map((data) => {
            let temp = (data.InputPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                DocumentDate: new Date(data.DocumentDate),
                InputPrice: cost,
                DocumentCode: parseInt(data.DocumentCode),
                PartnerTelephones: data.PartnerTelephones !== '' ? parseInt(data.PartnerTelephones) : '',
            }
        })
        setData(tempData)

    }, [i18n.language])

    const columnsObj = [
        { value: "IndexCell", title: t('ردیف') },
        { value: "DocumentCode", title: t("پشت نمره") },
        { value: "ChequeCode", title: t("شماره چک") },
        { value: "BankAccountNumber", title: t("شماره حساب") },
        { value: "BankName", title: t("بانک") },
        { value: "Branch", title: t("شعبه") },
        { value: "DocumentDate", title: t("تاریخ") },
        { value: "PartnerCode", title: t("کد طرف حساب") },
        { value: "PartnerName", title: t("طرف حساب") },
        { value: "PartnerTelephones", title: t("تلفن") },
        { value: "PartnerAddress", title: t("آدرس") },
        { value: "Delivery", title: t("تحویل دهنده") },
        { value: "CashAccount", title: t("صندوق") },
        { value: "Cashier", title: t("صندوق") },
        { value: "Issuance", title: t("صندوقدار") },
        { value: "CashAccount", title: t("محل صدور") },
        { value: "MaturityDate", title: t("تاریخ سررسید") },
        { value: "InputPrice", title: t("مبلغ") },
        { value: "SettlementDocuments", title: t("تسویه") },
        { value: "PayedToPartnerName", title: t("خرج به") },
        { value: "DocumentDescription", title: t("توضیحات") },
    ]

    const chartObj = [
        { value: "InputPrice", title: t('مبلغ') },
        { value: "DocumentCode", title: t("پشت نمره") },
        { value: "BankAccountNumber", title: t("شماره حساب") },
        { value: "PartnerCode", title: t("کد طرف حساب") },
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