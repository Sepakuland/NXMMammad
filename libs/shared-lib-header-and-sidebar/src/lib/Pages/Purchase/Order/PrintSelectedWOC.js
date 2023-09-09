import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import PrintSelectedWCData from "./PrintSelectedWCData.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";

const PrintSelectedWOC = (props) => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  console.log(" props.dataItem.DocumentCode", props.dataItem);
  useEffect(() => {
    let tempData = PrintSelectedWCData.map((data) => {
      let temp = data.price.toString().replaceAll(",", "");
      let temp2 = data.amount.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      let cost2 = parseFloat(temp2, 2);
      return {
        ...data,
        price: cost,
        amount: cost2,
        productCode: parseInt(data.productCode),
      };
    });
    setData(tempData);
  }, [lang]);

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );
  const CustomCurrency = (props) => <CurrencyCell {...props} />;

  let tempColumn = [
    {
      field: "IndexCell",
      width: "60px",
      name: "ردیف",
      cell: IndexCell,
      footerCell: TotalTitle,
    },
    {
      field: "productCode",
      name: "کد کالا",
      filter: "numeric",
    },
    {
      field: "productName",
      name: "نام کالا",
    },
    {
      field: "count",
      name: "تعداد",
      footerCell: CustomFooterSome,
      cell: CustomCurrency,
    },
    {
      field: "equipollent",
      name: "معادل",
      cell: CustomCurrency,
      footerCell: CustomFooterSome,
    },
    {
      field: "price",
      name: "فی",
    },
    {
      field: "Description",
      width: "120px",
      name: "توضیحات",
    },
  ];

  return (
    <>
     <Print
        printData={data}
        columnList={tempColumn}
        logo={CoddingIcon}
        title={t("نمایش جزییات")}
        subTitle={t("چاپ حواله")}
      >
        <div className="row betweens">
          <div className="col-lg-4 col-md-4 col-4">
            {t("شماره رسید")}:1088
          </div>
          <div className="col-lg-4 col-md-4 col-4">
            {t("تحویل دهنده")}:انبار ضایعات
          </div>
          <div className="col-lg-4 col-md-4 col-4">
            {t("انباردار")}:حمید رضا پرویزی
          </div>
          <div className="col-lg-4 col-md-4 col-4">
            {t("تاریخ رسید")}:1401/06/28
          </div>
          <div className="col-lg-4 col-md-4 col-4">
            {t("انبار تحویل گیرنده")}:{t("انبار اصلی")}
          </div>
          <div className="col-lg-6 col-md-6 col-6">{t("توضیحات ")}:---</div>
        </div>
      </Print>
      <div className="container Signature">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6 col-12">
            <div className="up"> {t("امضا تحویل‌دهنده")} :</div>
            <div className="down"></div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-12">
            <div className="up"> {t("امضا تحویل‌گیرنده")} :</div>
            <div className="down"></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PrintSelectedWOC;
