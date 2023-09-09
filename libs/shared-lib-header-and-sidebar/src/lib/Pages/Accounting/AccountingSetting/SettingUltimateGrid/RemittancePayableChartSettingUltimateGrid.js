import React, { useEffect, useState } from "react";
import dataForGrid from "./dataForGridSettingUltimateGrid.json";
import { useTranslation } from "react-i18next";
import ChartPage from '../../../../../components/chart/ChartPage'


function ChartRemittancePayable() {

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
                DocumentCode: parseInt(data.DocumentCode),
                PartnerTelephones: data.PartnerTelephones !== '' ? parseInt(data.PartnerTelephones) : '',
            }
        })
        setData(tempData)

    }, [i18n.language])

    const columnsObj = [
        { value: "IndexCell", title: t('ردیف') },
        { value: "DocumentCode", title: t('کد') },
        { value: "DocumentDate", title: t('تاریخ') },
        { value: "PartnerCode", title: t("کد طرف حساب") },
        { value: "PartnerName", title: t("طرف حساب") },
        { value: "PartnerLegalName", title: t("نام حقوقی") },
        { value: "PartnerTelephones", title: t("تلفن") },
        { value: "PartnerAddress", title: t("آدرس") },
        { value: "CashAccountName", title: t("حساب واریز کننده") },
        { value: "BankTransferCode", title: t("شماره فیش") },
        { value: "Price", title: t("مبلغ") },
        { value: "BankFee", title: t("کارمزد") },
        { value: "SettlementDocuments", title: t("تسویه") },
        { value: "DocumentDescription", title: t("توضیحات") },
    ]

    const chartObj = [
        { value: "Price", title: t('مبلغ') },
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