import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import PrintSelectedWCData from "./PrintSelectedWCData.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintSelectedWC = (props) => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  console.log(" props.dataItem.DocumentCode", props.dataItem);
  useEffect(() => {
    let tempData = PrintSelectedWCData.map((data) => {
      return {
        ...data,
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
      filterable: false,
      name: "ردیف",
      cell: IndexCell,
      footerCell: TotalTitle,
      sortable: false,
      reorderable: false,
    },
    {
      field: "orderCode",
      name: "کد کالا",
      className: "word-break text-center",
    },
    {
      field: "orderDescription",
      name: "شرح کالا",
      className: "word-break text-center",
    },
    {
      field: "count",
      name: "تعداد",
    },
    {
      field: "equipollent",
      name: "معادل",
      className: "word-break",
    },
  ];

  return (
    <>
      <Print
        printData={data}
        columnList={tempColumn}
        logo={CoddingIcon}
        title={t("نمایش جزییات")}
        subTitle={t("صورت حساب خرید")}
      >
        <div className="row betweens">
          <div className="col-lg-4 col-md-4 col-4">{t("کد")}:10001001</div>
          <div className="col-lg-4 col-md-4 col-4">
            {t("نام")}: شرکت آرانوش خاورمیانه
          </div>
          <div className="col-lg-4 col-md-4 col-4">
            {t("تلفن")}:09038608011
          </div>
          <div className="col-lg-6 col-md-6 col-6">
            {t("توضیحات ")}:درج شده از طریق منوی نیازمندیهای خرید
          </div>
        </div>
      </Print>
      <div className="container Signature">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="up"> {t("امضا مدیر عامل")} :</div>
            <div className="down"></div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="up"> {t("امضا مدیر فروش ")} :</div>
            <div className="down"></div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="up"> {t("امضا مسئول سفارش")} :</div>
            <div className="down"></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PrintSelectedWC;
