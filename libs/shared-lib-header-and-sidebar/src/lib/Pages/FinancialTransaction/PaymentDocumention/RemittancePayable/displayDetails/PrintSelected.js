import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { CurrencyCell, IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import PrintSelectedData from "./PrintSelectedData.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintSelected = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  useEffect(() => {
    let tempData = PrintSelectedData.map((data) => {
      let temp = data.Price.toString().replaceAll(",", "");
      let temp2 = data.ComplyWithReceipt.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      let cost2 = parseFloat(temp2, 2);
      return {
        ...data,
        Price: cost,
        ComplyWithReceipt: cost2,
      };
    });
    setData(tempData);
  }, [lang]);




  let tempColumn = [
    {
      field: "IndexCell",
      filterable: false,
      width: "60px",
      name: "ردیف",
      cell: IndexCell,
    },
    {
      field: "type",
      className: "text-center",
      name: "نوع",
    },
    {
      field: "number",
      className: "text-center word-break",
      name: "شماره",
    },
    {
      field: "Price",
      filterable: false,
      cell:CurrencyCell,
      className: 'word-break',
      name: "مبلغ",
    },
    {
      field: "ComplyWithReceipt",
      filterable: false,
      cell:CurrencyCell,
      className: 'word-break',
      name: "تطبیق با این دریافت",
    },
  ];

  return (
    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("پرداخت حواله")}
    >
      <div className="row betweens">
        <div className="col-lg-4 col-md-6 col-6">{t("کد‌پرداخت")}: 598</div>
        <div className="col-lg-4 col-md-6 col-6">
          {t("تاریخ پرداخت")} : 1401/06/23
        </div>
        <div className="col-lg-4 col-md-6 col-6">
          {t("طرف حساب")}:تنخواه تست(مانده:4,233,000 بستانکار)
        </div>
        <div className="col-lg-4 col-md-6 col-6">
          {t("بانک")}:بانک سپه اول دوره
        </div>
        <div className="col-lg-4 col-md-6 col-6">
          {t("شماره حواله")} :132132
        </div>
        <div className="col-lg-4 col-md-6 col-6">
          {t("مبلغ")} :180,800,000,000
        </div>
        <div className="col-lg-4 col-md-6 col-6">{t("شرح")} :بابت</div>
      </div>
    </Print>
  );
};
export default PrintSelected;
