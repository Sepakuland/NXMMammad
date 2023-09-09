import React, { useEffect, useState } from "react";
import dataForGrid from "./dataForGrid.json";
import { useTranslation } from "react-i18next";
import ChartPage from "../../../../../components/chart/ChartPage";

function ChartRemittancePayable() {
  const [data, setData] = useState([]);

  const { t, i18n } = useTranslation();

  const [savedCharts, setSavedCharts] = useState([
    { title: "تست 1", dashboard: false },
    { title: "تست 2", dashboard: true },
  ]);

  useEffect(() => {
    let tempData = dataForGrid.map((data) => {
      return {
        ...data,
        BankAccountCode: data.BankAccountCode !== "" ? parseInt(data.BankAccountCode) : "",
        BankAccountNumber: data.BankAccountNumber !== "" ? parseInt(data.BankAccountNumber) : "",
        StartSerial: data.StartSerial !== "" ? parseInt(data.StartSerial) : "",
        PaperCount: data.PaperCount !== "" ? parseInt(data.PaperCount) : "",
      };
    });
    setData(tempData);
  }, [i18n.language]);

  const columnsObj =[
    {
      "value": "IndexCell",
      "title": t("ردیف")
    },
    {
      "value": "BankAccountCode",
      "title": t("حساب بانکی - کد"),
    },
    {
      "value": "BankAccountName",
      "title": t("حساب بانکی - عنوان"),
    },
    {
      "value": "BankAccountNumber",
      "title": t("حساب بانکی - شماره حساب"),
    },
    {
      "value": "ChequeDefinitionCode",
      "title": t("دسته چک - کد"),
    },
    {
      "value": "StartSerial",
      "title": t("دسته چک - سریال شروع"),
    },
    {
      "value": "PaperCount",
      "title": t("دسته چک - تعداد برگ"),
    },
    {
      "value": "Serial",
      "title": t("سریال برگ ابطال شده")
    },
    {
      "value": "Reason",
      "title": t("دلیل ابطال")
    }
  ] ;

  const chartObj = [ { value: "BankAccountNumber", title: t("شماره حساب") },];

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

export default ChartRemittancePayable;
