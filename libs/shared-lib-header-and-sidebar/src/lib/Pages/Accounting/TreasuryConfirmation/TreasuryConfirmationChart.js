import React, { useEffect, useState } from "react";
import dataForGrid from "./dataForGrid.json";
import { useTranslation } from "react-i18next";
import ChartPage from "../../../components/chart/ChartPage";

function ChartTreasuryConfirmation() {
  const [data, setData] = useState([]);

  const { t, i18n } = useTranslation();

  const [savedCharts, setSavedCharts] = useState([
    { title: "تست 1", dashboard: false },
    { title: "تست 2", dashboard: true },
  ]);

  useEffect(() => {
    let tempData = dataForGrid.map((data) => {
      let temp = data.Price.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      return {
        ...data,
        DocumentDate: new Date(data.DocumentDate),
        MaturityDate: new Date(data.MaturityDate),
        Price: cost,
        DocumentCode: parseInt(data.DocumentCode),
        PartnerTelephones:
          data.PartnerTelephones !== "" ? parseInt(data.PartnerTelephones) : "",
      };
    });
    setData(tempData);
  }, [i18n.language]);

  const columnsObj = [
    { value: "IndexCell", title: t("ردیف") },
    { value: "DocumentType", title: t("نوع تراکنش") },
    { value: "DocumentCode", title: t("کد تراکنش") },
    { value: "Operation", title: t("عملیات") },
    { value: "DocumentDate", title: t("تاریخ") },
    { value: "PayerCode", title: t("کد پرداخت کننده") },
    { value: "PayerName", title: t("نام پرداخت کننده") },
    { value: "RecipientCode", title: t("کد دریافت کننده") },
    { value: "RecipientName", title: t("نام دریافت کننده") },
    { value: "Price", title: t("مبلغ") },
    { value: "ChequeCode", title: t("سریال چک") },
    { value: "MaturityDate", title: t("تاریخ سررسید") },
  ];

  const chartObj = [
    { value: "Price", title: t("مبلغ") },
    { value: "DocumentCode", title: t("کد سند") },
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

export default ChartTreasuryConfirmation;
