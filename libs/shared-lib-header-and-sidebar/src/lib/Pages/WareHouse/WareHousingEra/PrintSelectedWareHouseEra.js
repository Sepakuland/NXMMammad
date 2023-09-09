import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import  { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import DataForSelectedPrint from "./DataForSelectedPrint.json";
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
    let tempData = DataForSelectedPrint.map((data) => {

      let temp = data.SystemInventoryPrice.toString().replaceAll(",", "");
      let temp2 = data.InventoryCountedPrice.toString().replaceAll(",", "");
      let temp3 = data.conflictPrice.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      let cost2 = parseFloat(temp2, 2);
      let cost3 = parseFloat(temp3, 2);
      return {
        ...data,
        DocumentDate: getLangDate(lang, new Date(data.DocumentDate)),
        ProductCode: data.ProductCode !== '' ? parseInt(data.ProductCode) : '',
        SystemInventoryNumber: data.SystemInventoryNumber !== '' ? parseInt(data.SystemInventoryNumber) : 0,
        InventoryCountedNumber: data.InventoryCountedNumber !== '' ? parseInt(data.InventoryCountedNumber) : 0,
        ConflictNumber: data.ConflictNumber !== '' ? parseInt(data.ConflictNumber) : 0,
        SystemInventoryPrice: data.SystemInventoryPrice !== '' ? cost : 0,
        InventoryCountedPrice: data.InventoryCountedPrice !== '' ? cost2 : 0,
        conflictPrice: data.conflictPrice !== '' ? cost3 : 0,
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
      footerCell: TotalTitle,
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
      name: "موجودی سیستمی",
      field: "SystemInventory",
      children: [
        {
          field: "SystemInventoryNumber",
          name: "تعدادی",
          filter: "numeric",
          className: "text-center",
          footerCell: CustomFooterSome
        },
        {
          field: "SystemInventoryPrice",
          name: "ریالی",
          filter: "numeric",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
          className: "word-break"
        },
      ],
    },
    {
      name: "موجودی شمارش شده",
      field: "InventoryCounted",
      children: [
        {
          field: "InventoryCountedNumber",
          name: "تعدادی",
          filter: "numeric",
          className: "text-center",
          footerCell: CustomFooterSome
        },
        {
          field: "InventoryCountedPrice",
          name: "ریالی",
          filter: "numeric",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
          className: "word-break"
        },
      ],
    }, {
      name: "مغایرت",
      field: "Conflict",
      children: [
        {
          field: "ConflictNumber",
          name: "تعدادی",
          filter: "numeric",
          className: "text-center",
          footerCell: CustomFooterSome
        },
        {
          field: "conflictPrice",
          name: "ریالی",
          filter: "numeric",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
          className: "word-break"
        },
      ],
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
        subTitle={t("چاپ دوره انبارگردانی")}
      >
        <div className="row betweens">

          <div className="col-lg-3 col-md-3 col-3">
            {t("تاریخ ثبت")}: 1301/10/03
          </div>
          <div className="col-lg-3 col-md-3 col-3">
            {t("انبار")} : گیج
          </div>
          <div className="col-lg-3 col-md-3 col-3">
            {t("انباردار")} : حمید رضا پرویزی
          </div>
          <div className="col-lg-3 col-md-3 col-3">
            {t("توضیحات")} : نگیر نخر نیا
          </div>
        </div>
      </Print>

    </>
  );
};
export default PrintSelected;
