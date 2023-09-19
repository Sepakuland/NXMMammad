import { useTranslation } from "react-i18next";
import Print from "sepakuland-component-print";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import StringFooterSome from "./StringFooterSum";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

const PrintSingleDoc = ({ accountingDocumentPrintData,loading=false }) => {
  const location = useLocation();
  const params = new URLSearchParams(location?.search);
  const obj = Object.fromEntries(params);
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState([]);

  useEffect(() => {
    let arr = [];
    let tempData = accountingDocumentPrintData?.documentArticles?.map(
      (data) => {
        arr = [];
        let splittedFormersNames = data?.moeinAccountFormersNames?.split(" / ");
        arr.push(`${splittedFormersNames?.[1]} / ${splittedFormersNames?.[2]}`);
        data.detailed6Name !== null
          ? arr.push(
              `${data.detailed4Name} / ${data.detailed5Name} / ${data.detailed6Name}`
            )
          : data.detailed5Name !== null
          ? arr.push(`${data.detailed4Name} / ${data.detailed5Name} `)
          : data.detailed4Name !== null
          ? arr.push(`${data.detailed4Name}`)
          : arr.push("---");
        data.notes === null || data.notes === ""
          ? arr.push("---")
          : arr.push(data.notes);
        return {
          ...data,
          documentDescription: arr.join("\n"),
        };
      }
    );
    setData({ ...data, documentArticles: tempData });
  }, [accountingDocumentPrintData]);

  const dataRef = useRef();
  dataRef.current = data;

  const CustomFooterSome = (props) => (
    <FooterSome
      {...props}
      data={accountingDocumentPrintData?.documentArticles}
    />
  );
  const CustomStringFooterSome = (props) => (
    <StringFooterSome {...props} fieldSome={"Debits"} data={dataRef.current} />
  );

  const NoneFooter = (props) => <></>;

  let tempColumn = [
    {
      field: "IndexCell",
      width: "60px",
      name: "ردیف",
      cell: IndexCell,
      footerCell: TotalTitle,
    },
    {
      field: "moeinAccountCompleteCode",
      name: "معین",
    },
    {
      field: "detailed4Name",
      name: "تفضیلی سطح4",
    },
    {
      field: "detailed5Name",
      name: "تفضیلی سطح5",
    },
    {
      field: "detailed6Name",
      name: "تفضیلی سطح6",
    },
    {
      field: "documentDescription",
      width: "300px",
      name: "توضیحات",
    },
    {
      field: "debits",
      name: "بدهکار",
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
    },
    {
      field: "credits",
      name: "بستانکار",
      footerCell: CustomFooterSome,
      cell: CurrencyCell,
    },
  ];

  return (
    <>
      <Print
        printData={data?.documentArticles}
        columnList={tempColumn}
        logo={CoddingIcon}
        title={t("نمایش جزییات")}
        subTitle={t("سند حسابداری")}
        loading={loading}
      >
        <div className="row betweens">
          <div className="col-lg-4 col-md-4 col-4">
            {t("شماره سند")}: {accountingDocumentPrintData?.documentNumber}
          </div>
          <div className="col-lg-4 col-md-4 col-4">
            {t("شماره پیگیری")}:12312
          </div>
          <div className="col-lg-4 col-md-4 col-4">
            {t("تاریخ سند")}:{" "}
            {getLangDate(
              i18n.language,
              accountingDocumentPrintData?.documentDate
            )}
          </div>
          <div className="col-lg-6 col-md-6 col-6">
            {t("شرح سند")}:{accountingDocumentPrintData?.documentDescription}
          </div>
        </div>
      </Print>
      <div className="p-3" style={{ direction: i18n.dir() }}>
        <div className="row justify-content-center">
          <div className="col-lg-11 col-md-12 col-sm-12 col-12 Signature">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="up">{t("تنظیم‌کننده")}:</div>
                <div className="down"></div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="up">{t("تایید‌کننده")}:</div>
                <div className="down"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintSingleDoc;
