import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import  { FooterSome,IndexCell, CurrencyCell, TotalTitle,getLangDate,DateCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import dataForGrid from './dataForGrid.json'
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintPage = () => {

  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang')
  const [data, setData] = useState([])
  const dataRef = useRef()
  dataRef.current = data


  useEffect(() => {
    let tempData = dataForGrid.map((data) => {
      let temp = (data.Price).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)
      return {
        ...data,
        DocumentDate: getLangDate(lang, new Date(data.DocumentDate)),
        Price: cost,
        DocumentCode: parseInt(data.DocumentCode),
        PartnerTelephones: data.PartnerTelephones !== '' ? parseInt(data.PartnerTelephones) : '',
      }
    })
    setData(tempData)
  }, [lang])


  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
  const CustomCurrency = (props) => <CurrencyCell {...props} cell={'Price'} />

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
      field: 'DocumentCode',
      className: 'text-center word-break',
      filterable: false,
      name: "کد",
      width: '60px',
    },
    {
      field: 'DocumentDate',
      filterable: false,
      name: "تاریخ",
      width: '80px',
      // format: "{0:d}",
      className: 'word-break',
      cell: DateCell,
    },
    {
      field: 'PartnerCode',
      filterable: false,
      name: "کد طرف حساب",
      width: '100px',
      className: 'word-break',
    },
    {
      field: 'PartnerName',
      filterable: false,
      name: "طرف حساب",
      width: '120px',
    },
    {
      field: 'PartnerLegalName',
      filterable: false,
      name: "نام حقوقی",
    },
    {
      field: 'PartnerTelephones',
      filterable: false,
      name: "تلفن",
      className: 'word-break',
      width: '100px',
    },
    {
      field: 'PartnerAddress',
      filterable: false,
      width: '150px',
      name: "آدرس",
    },
    {
      field: 'CashAccountName',
      filterable: false,
      name: "صندوق",
    },
    {
      field: 'CollectorName',
      name: "تحصیلدار",
      className: 'text-center',
    },
    {
      field: 'Price',
      filterable: false,
      name: "مبلغ",
      className: 'word-break',
      cell: CustomCurrency,
      footerCell: CustomFooterSome,
    },
    {
      field: 'SettlementDocuments',
      name: "تسویه",
      className: 'word-break',
    },
    {
      field: 'DocumentDescription',
      width: '140px',
      name: "توضیحات",
    },

  ]

  return (

    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
          title={t("نمایش جزییات")}
          subTitle={t("دریافت نقد")}
      

    />
  )
}
export default PrintPage









