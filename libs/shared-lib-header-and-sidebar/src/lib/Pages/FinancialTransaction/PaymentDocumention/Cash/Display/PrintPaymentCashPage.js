import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import CashData from './CashData.json'
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintPaymentCashPage = () => {

  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang')
  const [data, setData] = useState([])
  const dataRef = useRef()
  dataRef.current = data


  useEffect(() => {
      let tempData = CashData.map((data) => {
      let temp = (data.Price).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)
     
      return {
        ...data,
        DocumentDate: getLangDate(lang,new Date(data.DocumentDate)),
        Price: cost,
        DocumentCode: parseInt(data.DocumentCode),
        PartnerTelephones: data.PartnerTelephones !== '' ? parseInt(data.PartnerTelephones) : '',
      }
    })
    setData(tempData)
  }, [lang])


  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: 'DocumentCode',
            filterable: false,
            name: "کد",
            className: 'word-break',
        },
        {
            field: 'DocumentDate',
            name: "تاریخ",
            className: 'word-break',
        },
        {
            field: 'PartnerCode',
            filterable: false,
            name: "کد طرف حساب",
            className: 'word-break',
        },
        {
            field: 'PartnerName',
            filterable: false,
            name: "طرف حساب",
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
        },
        {
            field: 'PartnerAddress',
            filterable: false,
            width: '100px',
            name: "آدرس",
        },
        {
            field: 'CashAccountName',
            filterable: false,
            name: "صندوق",
        },

        {
            field: 'Price',
            filterable: false,
            name: "مبلغ",
            className: 'word-break',
            filter: 'numeric',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },

        {
            field: 'SettlementDocuments',
            filterable: false,
            name: "تسویه",
            className: 'text-center',
            reorderable: false
        },
        {
            field: 'DocumentDescription',
            filterable: false,
            name: "توضیحات",
            className: 'text-center',
            reorderable: false
        }
      
    ]

  return (

    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("واریز به بانک")}

    />
  )
}
export default PrintPaymentCashPage









