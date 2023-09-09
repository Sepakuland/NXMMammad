import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import products from "../../SaleTotalBatchReceipt/DisplayDetails/product.json";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const SaleTotalBatchReceiptPrintPage = () => {

  const { t, i18n } = useTranslation();
  const [data, setData] = useState([])
  const dataRef = useRef()
  dataRef.current = data


  useEffect(() => {
    let tempData = products.map((data, index) => {
      let temp = (data.TotalPrice).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)
      return {
        ...data,
        IndexCell: index + 1,
        TotalDate: getLangDate(i18n.language,new Date(data.TotalDate)),
        ShipmentDate: getLangDate(i18n.language,new Date(data.ShipmentDate)),
        TotalPrice: cost,
        TotalCode: parseInt(data.TotalCode),
        PayeeCode: parseInt(data.PayeeCode),
        DriverCode: parseInt(data.DriverCode),
      }
    })
    setData(tempData)

  }, [i18n.language])


  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
  const CustomCurrency = (props) => <CurrencyCell {...props} cell={'TotalPrice'} />

  let tempColumn = [
    {
      field: 'IndexCell',
      filterable: false,
      width: '60px',
      name: "ردیف",
      cell: IndexCell,
      footerCell: TotalTitle,
      sortable: false,
      reorderable: false
    },
    {
      field: 'TotalCode',
      className: 'word-break',
      filterable: false,
      name: "سرجمع",
    },
    {
      field: 'TotalDate',
      filterable: false,
      name: "تاریخ سرجمع",
      className: 'word-break',
    },
    {
      field: 'ShipmentDate',
      filterable: false,
      name: "تاریخ ارسال",
      className: 'word-break',
    },
    {
      field: 'PayeeCode',
      className: 'word-break',
      filterable: false,
      name: "کد موزع",
    },
    {
      field: 'PayeeName',
      filterable: false,
      name: "موزع",
    },
    {
      field: 'DriverCode',
      className: 'word-break',
      filterable: false,
      name: "کد راننده",
    },
    {
      field: 'DriverName',
      filterable: false,
      name: "نام راننده",
    },
    {
      field: 'TotalPrice',
      filterable: false,
      name: "مبلغ سرجمع",
      cell: CustomCurrency,
      className: 'word-break',
      footerCell: CustomFooterSome,
    },
    {
      field: 'Status',
      filterable: false,
      name: "وضعیت",
    },
    {
      field: 'TotalDescription',
      filterable: false,
      width: '140px',
      name: "توضیحات سرجمع",
    },

  ]

  return (

    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("کلی سرجمع")}
    />
  )
}
export default SaleTotalBatchReceiptPrintPage