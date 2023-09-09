import React, { useEffect, useState, useRef } from "react";
import Print from "../../../components/print";
import IndexCell from "../../../components/RKGrid/IndexCell";
import TotalTitle from "../../../components/RKGrid/TotalTitle";
import CurrencyCell from "../../../components/RKGrid/CurrencyCell";
import FooterSome from "../../../components/RKGrid/FooterSome";
import { useTranslation } from "react-i18next";
import PrintSelectedWCData from "./PrintSelectedData.json";
import { getLangDate } from "../../../utils/getLangDate";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";
import { ColumnMenu, DateMenu } from "../../../components/RKGrid/ColumnMenu";

const PrintSelected = (props) => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  console.log(" props.dataItem.DocumentCode", props.dataItem);
  useEffect(() => {
    let tempData = PrintSelectedWCData.map((data) => {
      let temp = data.count.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      let temp2 = data.equipollent.toString().replaceAll(",", "");
      let cost2 = parseFloat(temp2, 2);
      let temp3 = data.orderPrice.toString().replaceAll(",", "");
      let cost3 = parseFloat(temp3, 2);
      let temp4 = data.orderDiscount.toString().replaceAll(",", "");
      let cost4 = parseFloat(temp4, 2);
      let temp5 = data.afterDiscount.toString().replaceAll(",", "");
      let cost5 = parseFloat(temp5, 2);
      let temp6 = data.addedTaxAmount.toString().replaceAll(",", "");
      let cost6 = parseFloat(temp6, 2);
      let temp7 = data.total.toString().replaceAll(",", "");
      let cost7 = parseFloat(temp7, 2);
      return {
        ...data,
        count: cost,
        equipollent: cost2,
        orderPrice: cost3,
        orderDiscount: cost4,
        afterDiscount: cost5,
        addedTaxAmount: cost6,
        total: cost7,
      };
    });
    setData(tempData);
  }, [lang]);

  const CustomFooterSome1 = (props) => {
    const [total, setTotal] = useState(0);

    useEffect(() => {
      if (dataRef.current?.length) {
        let tempTotal = dataRef.current?.reduce(
          (acc, current) => acc + parseFloat(current[props.field]) || 0,
          0
        );
        setTotal(tempTotal);
      }
    }, [dataRef.current]);

    return (
      <td className={"td-p0 border-left-0"} style={{ height: "72px" }}>
        <div>
          <div
            className={` word-break empty-footer-border ${
              props?.className ? props?.className : ""
            }`}
            style={props.style}
          >
            {total?.toLocaleString()}
          </div>
          <div className={"empty-footer-border border-left-0"}></div>
          <div className={"empty-footer border-left-0"}></div>
        </div>
      </td>
    );
  };
  const CustomTotalTitle = (props) => {
    return (
      <td
        className={`td-p0 ${lang == "en" ? "border-right-0" : "border-left-0"}`}
        colSpan={3}
        style={{ height: "72px" }}
      >
        <div
          className={`empty-footer-border justify-content-start ${
            lang == "en" ? "border-right-1" : "border-left-1"
          }`}
        >
          {t("جمع")}
        </div>
        <div
          className={`empty-footer-border ${
            lang == "en" ? "border-right-0" : "border-left-0"
          }`}
        >
          {" "}
        </div>
        <div
          className={`empty-footer ${
            lang == "en" ? "border-right-0" : "border-left-0"
          }`}
        >
          {" "}
        </div>
      </td>
    );
  };
  const NoFooterCell = (props) => {
    return (
      <td
        className={`td-p0 ${lang == "en" ? "border-right-0" : "border-left-0"}`}
        style={{ height: "72px" }}
      >
        <div className={`empty-footer-border `}> </div>
        <div
          className={`empty-footer-border ${
            lang == "en" ? "border-right-0" : "border-left-0"
          }`}
        >
          {" "}
        </div>
        <div
          className={`empty-footer ${
            lang == "en" ? "border-right-0" : "border-left-0"
          }`}
        >
          {" "}
        </div>
      </td>
    );
  };
  const CustomFooterSome2 = (props) => {
    const [total, setTotal] = useState(0);

    useEffect(() => {
      if (dataRef.current?.length) {
        let tempTotal = dataRef.current?.reduce(
          (acc, current) => acc + parseFloat(current[props.field]) || 0,
          0
        );
        setTotal(tempTotal);
      }
    }, [dataRef.current]);

    return (
      <td
        className={"td-p0 border-left-0"}
        style={{ height: "72px", overflow: "visible" }}
      >
        <div>
          <div
            className={` word-break empty-footer-border ${
              props?.className ? props?.className : ""
            }`}
            style={props.style}
          >
            {total?.toLocaleString()}
          </div>
          <div
            className={`empty-footer-border  ${i18n.dir()} justify-content-end nowrap`}
          >
            {t("برگشت از تخفیف حجمی(0%)")}
          </div>
          <div
            className={`empty-footer  ${i18n.dir()} justify-content-end nowrap`}
          >
            {t(" مبلغ نهایی برگشتی:")}
          </div>
        </div>
      </td>
    );
  };
  const CustomFooterSome3 = (props) => {
    const [total, setTotal] = useState(0);

    useEffect(() => {
      if (dataRef.current?.length) {
        let tempTotal = dataRef.current?.reduce(
          (acc, current) => acc + parseFloat(current[props.field]) || 0,
          0
        );
        setTotal(tempTotal);
      }
    }, [dataRef.current]);

    return (
      <td
        className={"td-p0 border-left-0"}
        style={{ height: "72px", overflow: "visible" }}
      >
        <div>
          <div
            className={` word-break empty-footer-border ${
              props?.className ? props?.className : ""
            }`}
            style={props.style}
          >
            {total?.toLocaleString()}
          </div>
          <div
            className={`empty-footer-border ${i18n.dir()} justify-content-end word-break`}
          >
            {"0 تومان".toLocaleString()}
          </div>
          <div
            className={`empty-footer ${i18n.dir()} justify-content-end word-break`}
          >
            {"300000000 تومان".toLocaleString()}
          </div>
        </div>
      </td>
    );
  };
  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );
  const CustomCurrency = (props) => <CurrencyCell {...props} />;

  let tempColumn = [
    {
      field: "IndexCell",
      name: "ردیف",
      cell: IndexCell,
      footerCell: CustomTotalTitle,
    },
    {
      field: "orderCode",
      name: "کد کالا",
      className: "word-break text-center",
      footerCell: () => <></>,
    },
    {
      field: "orderDescription",
      name: "شرح کالا",
      className: "word-break text-center",
      footerCell: () => <></>,
    },
    {
      field: "count",
      name: "تعداد",
      footerCell: CustomFooterSome1,
    },
    {
      field: "equipollent",
      name: "معادل",
      className: "word-break",
      footerCell: CustomFooterSome1,
    },
    {
      field: "fee",
      name: "فی",
      className: "word-break text-center",
      footerCell: NoFooterCell,
    },
    {
      field: "orderPrice",
      name: "مبلغ",
      className: "word-break",
      footerCell: CustomFooterSome1,
    },
    {
      field: "orderDiscount",
      name: "تخفیف",
      className: "word-break",
      footerCell: CustomFooterSome1,
    },
    {
      field: "afterDiscount",
      name: "پس از کسر تخفیف",
      className: "word-break",
      footerCell: CustomFooterSome1,
    },
    {
      field: "addedTaxAmount",
      name: "مالیات ا.ا",
      className: "word-break",
      footerCell: CustomFooterSome2,
    },
    {
      field: "total",
      name: "مبلغ نهایی",
      className: "word-break ",
      footerCell: CustomFooterSome3,
    },
  ];

  return (
    <>
      <Print
        printData={data}
        columnList={tempColumn}
        logo={CoddingIcon}
        title={t("نمایش جزییات")}
        subTitle={t("صورت حساب بر‌گشت از خرید")}
      >
        <div className="row betweens">
          <div className="col-lg-4 col-md-4 col-4">
            {t("شماره فاکتور خرید")}:29
          </div>
          <div className="col-lg-4 col-md-4 col-4">
            {t("تاریخ خرید")}:1400/04/06
          </div>
          <div className="col-lg-4 col-md-4 col-4">{t("مبلغ خرید")}:0</div>
          <div className="col-lg-4 col-md-4 col-4">
            {t("کد تامین کننده")}:10001007
          </div>
          <div className="col-lg-4 col-md-4 col-4">
            {t("نام تامین کننده")}: شرکت سیمین سپهر سپاهان
          </div>
          <div className="col-lg-4 col-md-4 col-4">{t("تلفن")}:09038608011</div>
          <div className="col-lg-6 col-md-6 col-6">
            {t("توضیحات ")}:درج شده از طریق منوی نیازمندیهای خرید
          </div>
        </div>
      </Print>
      <div className="container Signature">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="up"> {t("امضا مدیر مالی")} :</div>
            <div className="down"></div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="up"> {t("امضا حسابدار")} :</div>
            <div className="down"></div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="up"> {t("امضاانبار‌دار")} :</div>
            <div className="down"></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PrintSelected;
