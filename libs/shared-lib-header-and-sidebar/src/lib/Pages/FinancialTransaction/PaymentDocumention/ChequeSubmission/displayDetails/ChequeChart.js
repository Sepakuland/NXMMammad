import React, { useEffect, useRef, useState } from "react";
import dataForGrid from "./dataForGrid.json";
import { useTranslation } from "react-i18next";
import ChartPage from "../../../../../components/chart/ChartPage";

function ChequeChart() {
  const [data, setData] = useState([]);

  const { t, i18n } = useTranslation();

  const [savedCharts, setSavedCharts] = useState([
    { title: "تست 1", dashboard: false },
    { title: "تست 2", dashboard: true },
  ]);

  useEffect(() => {
    let tempData = dataForGrid.map((data,index) => {
      let temp = data.OutputPrice.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      return {
        ...data,
        IndexCell:index+1,
        DocumentDate: new Date(data.DocumentDate),
        OutputPrice: cost,
        DocumentCode: parseInt(data.DocumentCode),
        PartnerTelephones:
          data.PartnerTelephones !== "" ? parseInt(data.PartnerTelephones) : "",
      };
    });
    setData(tempData);
  }, [i18n.language]);

  const columnsObj = [
    { value: "IndexCell", title: t("ردیف") },
    { value: "DocumentCode", title: t("پشت نمره") },
    { value: "ChequeCode", title: t("سریال") },
    { value: "DocumentDate", title: t("تاریخ") },
    { value: "PartnerCode", title: t("کد طرف حساب") },
    { value: "PartnerName", title: t("طرف حساب") },
    { value: "PartnerTelephones", title: t("تلفن") },
    { value: "PartnerAddress", title: t("آدرس") },
    { value: "BankName", title: t("بانک") },
    { value: "Branch", title: t("شعبه") },
    { value: "Delivery", title: t("تحویل گیرنده") },
    { value: "Issuance", title: t("محل صدور") },
    { value: "MaturityDate", title: t("تاریخ سررسید") },
    { value: "OutputPrice", title: t("مبلغ") },
    { value: "SettlementDocuments", title: t("تسویه") },
    { value: "chequeState", title: t("وضعیت") },
    { value: "DocumentDescription", title: t("توضیحات") },
  ];

  const chartObj = [
    { value: "OutputPrice", title: t("مبلغ") },
    { value: "DocumentCode", title: t("پشت نمره") },
  ];

  return (
    <>
      <ChartPage
        data={data}
        columnsObj={columnsObj}
        chartObj={chartObj}
        savedCharts={savedCharts}
      />
    </>
  );
}

export default ChequeChart;
