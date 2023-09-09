import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import dataForGrid from './dataForGridSummaryGrid.json'
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintSummaryGrid = () => {

  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang')
  const [data, setData] = useState([])
  const dataRef = useRef()
  dataRef.current = data


  useEffect(() => {
    let tempData = dataForGrid.map((data) => {

      let temp = (data.TotalPrice).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)


      return {
        ...data,
        DocumentDate: getLangDate(lang,new Date(data.DocumentDate)),
        TotalPrice: cost,
       
        DocumentCode: parseInt(data.DocumentCode),
       
      }
    })
    setData(tempData)
  }, [lang])


  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />


  let tempColumn = [
    {
      field: 'IndexCell',
      filterable: false,
     
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      footerCell: TotalTitle,
      
      reorderable: false
    },
    {
      field: 'DocumentCode',
     className: "word-break",
      name: "کد",

     
     
    },
    {
      field: 'DocumentDate',
     
      name: "تاریخ",

      className: "word-break",


     
      },
      {
          name: 'تنخواه گردان / صندوق',
          field: 'test2',
         
          children: [
              {
                  field: 'CreditAccountCode',
                className: "word-break",
                  name: "کد",

                  // orderIndex:2
              },
              {
                  field: 'CreditAccountName',
                
                  name: "نام",
                  
                  
                 
              },
          ]
      },
    {
      field: 'TotalPrice',
     
      name: "جمع مبلغ",
      className: "word-break",
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
      
      },

    {
      field: 'DocumentDescription',
     
      width: '200px',
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
export default PrintSummaryGrid









