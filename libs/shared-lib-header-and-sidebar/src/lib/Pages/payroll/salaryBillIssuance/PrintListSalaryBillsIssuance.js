import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import dataForGrid from "./dataForGrid.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";

const PrintListSalaryBillsIssuance = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  useEffect(() => {
    let tempData = dataForGrid.map((data) => {
      let temp = data.BasicSalary.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      let temp2 = data.HousingRight.toString().replaceAll(",", "");
      let cost2 = parseFloat(temp2, 2);
      let temp3 = data.GroceriesRight.toString().replaceAll(",", "");
      let cost3 = parseFloat(temp3, 2);
      let temp4 = data.SuperJobRight.toString().replaceAll(",", "");
      let cost4 = parseFloat(temp4, 2);
      let temp5 = data.CustodyRights.toString().replaceAll(",", "");
      let cost5 = parseFloat(temp5, 2);
      let temp6 = data.DescendantsRight.toString().replaceAll(",", "");
      let cost6 = parseFloat(temp6, 2);
      let temp7= data.Pursant.toString().replaceAll(",", "");
      let cost7= parseFloat(temp7, 2);
      let temp8= data.FamilyAllowance.toString().replaceAll(",", "");
      let cost8= parseFloat(temp8, 2);
      let temp9= data.InsuranceWorker.toString().replaceAll(",", "");
      let cost9= parseFloat(temp9, 2);
      let temp10= data.Favor.toString().replaceAll(",", "");
      let cost10= parseFloat(temp10, 2);
      let temp11= data.SalesToPersonnel.toString().replaceAll(",", "");
      let cost11= parseFloat(temp11, 2);
      let temp12= data.PayrollTax.toString().replaceAll(",", "");
      let cost12= parseFloat(temp12, 2);
      let temp13= data.CurePrice.toString().replaceAll(",", "");
      let cost13= parseFloat(temp13, 2);
      return {
        ...data,
        BasicSalary:cost,
        HousingRight:cost2,
        GroceriesRight:cost3,
        SuperJobRight:cost4,
        CustodyRights:cost5,
        DescendantsRight:cost6,
        Pursant:cost7,
        FamilyAllowance:cost8,
        InsuranceWorker:cost9,
        Favor:cost10,
        SalesToPersonnel:cost11,
        PayrollTax:cost12,
        CurePrice:cost13
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
      name: "ردیف",
      cell: IndexCell,
      footerCell: TotalTitle,
      sortable: false,
      reorderable: false,
    },
    {
      field: "Year",
      name: "سال",
      className: "text-center word-break",
    },
    {
      field: "Month",
      name: "ماه",
      className: "text-center word-break",
    },
    {
      field: "PerssonelCode",
      name: "کد پرسنل",
      className: "text-center word-break",
    },
    {
      field: "Name",
      name: "نام",
      className: "text-center",
    },
    {
      field: "AccountNumber",
      name: "شماره حساب",
      className: "text-center word-break",
    },
    {
      name: "حقوق‌ و مزایا",
      field: "RightsAndBenefits",
      children: [
        {
          field: "BasicSalary",
          name: "حقوق پایه",
          className: "text-center word-break",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
        },
        {
          field: "HousingRight",
          name: "حق مسکن",
          className: "text-center word-break",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
        },
        {
          field: "GroceriesRight",
          name: "حق خواربار",
          className: "text-center word-break",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
        },
        {
          field: "SuperJobRight",
          name: "فوق العاده شغل",
          className: "text-center word-break",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
        },
        {
          field: "CustodyRights",
          name: "حق سرپرستی",
          className: "text-center word-break",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
        },
        {
          field: "DescendantsRight",
          name: "حق اولاد",
          className: "text-center word-break",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
        },
        {
          field: "Pursant",
          name: "پورسانت",
          className: "text-center word-break",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
        },
        {
          field: "FamilyAllowance",
          name: "حق عائله مندی",
          className: "text-center word-break",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
        },
        {
          field: "AttractRight",
          name: "حق جذب",
          className: "text-center word-break",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
        },
      ],
    },
    {
        name: "کسورات",
        field: "Deductions",
        children: [
          {
            field: "InsuranceWorker",
            name: "بیمه سهم کارگر",
            className: "text-center word-break",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
          },
          {
            field: "Favor",
            name: "مساعده",
            className: "text-center word-break",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
          },
          {
            field: "SalesToPersonnel",
            name: "فروش به پرسنل",
            className: "text-center word-break",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
          },
          {
            field: "PayrollTax",
            name: "مالیات بر حقوق",
            className: "text-center word-break",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
          },
        ],
      },
    {
      field: "CurePrice",
      name: "خالص پرداختنی",
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
    },
    {
        field: "Sign",
        name: "امضا",
        className: "text-center",
      },
  ];

  return (
    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("لیست حقوق")}
    />
  );
};
export default PrintListSalaryBillsIssuance;
