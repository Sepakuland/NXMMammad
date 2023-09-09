import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import {
  FooterSome,
  CurrencyCell,
  TotalTitle,
  IndexCell,
} from "rkgrid";
import { useTranslation } from "react-i18next";
import Data from "../Data.json";
import CoddingIcon from "../../../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintPage = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  useEffect(() => {
    let tempData = Data.map((data) => {
      let temp = data.TotalPrice.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      return {
        ...data,
        TotalPriceTotalDate: new Date(data.TotalPriceTotalDate),
        PossibleShipmentDate: new Date(data.PossibleShipmentDate),
        TotalPrice: cost,
        TotalCode: data.TotalCode !== "" ? parseInt(data.TotalCode) : "",
        OrdersCount: data.OrdersCount !== "" ? parseInt(data.OrdersCount) : "",
        VolumeSum: data.VolumeSum !== "" ? parseInt(data.VolumeSum) : "",
        WeightSum: data.WeightSum !== "" ? parseInt(data.WeightSum) : "",
      };
    });
    setData(tempData);
  }, [i18n.language]);

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );
  let tempColumn = [
    {
      field: "IndexCell",
      width: "40px",
      name: "ردیف",
      cell: IndexCell,
      footerCell: TotalTitle,
    },
    {
      field: "TotalCode",
      width: "70px",
      name: "شماره سرجمع",
      filter: "numeric",
    },
    {
      field: "TotalDate",
      // format: "{0:d}",
      filter: "date",
      // cell: DateCell,
      name: "تاریخ سرجمع",
    },
    {
      field: "PossibleShipmentDate",
      // format: "{0:d}",
      filter: "date",
      // cell: DateCell,
      name: "تاریخ پیشنهادی ارسال",
    },
    {
      field: "PayeeName",
      name: "موزع",
    },
    {
      field: "DriverName",
      name: "راننده",
    },
    {
      field: "Machine",
      name: "خودرو",
    },
    {
      field: "OrdersCount",
      name: "تعداد پیش فاکتور",
      // width: '70px',
      filter: "numeric",
    },
    {
      field: "TotalPrice",
      name: "جمع مبلغ",
      filter: "numeric",
      // width: '60px',
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
    },
    {
      field: "VolumeSum",
      filter: "numeric",
      name: "حجم (لیتر)",
      // width: '60px',
      className: "text-center",
      footerCell: CustomFooterSome,
    },
    {
      field: "WeightSum",
      name: "وزن (Kg)",
      filter: "numeric",
      // width: '60px',
      className: "text-center",
      footerCell: CustomFooterSome,
    },

    {
      field: "TotalDescription",
      name: "توضیحات",
    },
  ];
  return (
    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("ارسال سرجمع های ارسال نشده")}
    />
  );
};
export default PrintPage;
