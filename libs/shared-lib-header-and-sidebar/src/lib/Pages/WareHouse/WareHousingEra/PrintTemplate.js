import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { FooterSome, CurrencyCell, IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import PrintTemplateData from "./PrintTemplateData.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";

const PrintSelected = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;


  useEffect(() => {
    let tempData = PrintTemplateData.map((data) => {
      let temp = data.Price.toString().replaceAll(",", "");
      let temp2 = data.Fee.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      let cost2 = parseFloat(temp2, 2);
      return {
        ...data,
        ProductCode: data.ProductCode !== '' ? parseInt(data.ProductCode) : '',
        Count: data.Count !== '' ? parseInt(data.Count) : 0,
        Price: data.Price !== '' ? cost : 0,
        Fee: data.Fee !== '' ? cost2 : 0,
      };
    });
    setData(tempData);

  }, [lang]);

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );

  let tempColumn = [
    {
      field: "IndexCell",
      filterable: false,
      with: "30px",
      name: "ردیف",
      cell: IndexCell,
    
    },
    {
      field: "ProductCode",
      name: "کد کالا",
      filter: "numeric",
      className: "word-break"
    },
    {
      field: "ProductName",
      name: "نام کالا",
      className: "word-break"
    },
    {
      field: "Unit",
      name: "واحد",
      className: "word-break"
    },
    {
      field: "Count",
      name: "تعداد",
      filter: "numeric",
      className: "text-center",

    },
    {
      field: "Fee",
      name: "فی",
      filter: "numeric",
      cell: CurrencyCell,

      className: "word-break"
    },
    {
      field: "Price",
      name: "مبلغ",
      filter: "numeric",
      cell: CurrencyCell,

      className: "word-break"
    },

    {
      field: "Description",
      name: "توضیحات",
      className: "word-break"
    },
  ];


  return (
    <>
      <Print
        printData={data}
        columnList={tempColumn}
        logo={CoddingIcon}
        title={t("نمایش جزییات")}
        subTitle={t("دوره های انبارگردانی")}
      >
        <div className="row betweens">

          <div className="col-lg-3 col-md-3 col-3">
            {t("تاریخ ثبت")}:
          </div>
          <div className="col-lg-3 col-md-3 col-3">
            {t("انبار")} :
          </div>
          <div className="col-lg-3 col-md-3 col-3">
            {t("انباردار")} :
          </div>
          <div className="col-lg-3 col-md-3 col-3">
            {t("توضیحات")} :
          </div>
        </div>
      </Print>

    </>
  );
};
export default PrintSelected;
