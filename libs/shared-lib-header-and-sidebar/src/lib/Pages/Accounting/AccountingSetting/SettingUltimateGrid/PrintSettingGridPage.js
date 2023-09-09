import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import dataForGrid from './dataSettingUltimateGrid.json'
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintSettingGridPage = () => {

  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang')
  const [data, setData] = useState([])
  const dataRef = useRef()
  dataRef.current = data


   
  useEffect(() => {
    let tempData = dataForGrid.map((data) => {
        let temp = (data.DebtorTotal).toString().replaceAll(',', '')
        let cost = parseFloat(temp, 2)
  
        let temp2 = (data.CreditorTotal).toString().replaceAll(',', '')
        let cost2 = parseFloat(temp2, 2)
        
        let temp3 = (data.Remainder).toString().replaceAll(',', '')
        let cost3 = parseFloat(temp3, 2)
  
        let temp4 = (data.MatchedPrice).toString().replaceAll(',', '')
        let cost4 = parseFloat(temp4, 2)
  
        let temp5 = (data.NotMatchedPrice).toString().replaceAll(',', '')
        let cost5 = parseFloat(temp5, 2)
        return {
          ...data,
          DebtorTotal: cost,
          CreditorTotal: cost2,
          Remainder: cost3,
          MatchedPrice: cost4,
          NotMatchedPrice: cost5,
          EntityCode:parseInt(data.EntityCode),
         
        }
      })
      setData(tempData)
  }, [lang])


  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
  const CustomCurrency = (props) => <CurrencyCell {...props} cell={'Price'} />
  const CustomCurrency2 = (props) => <CurrencyCell {...props} cell={'BankFee'} />

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
          name: 'تفضیلی',
          field: 'PartnerName',
          children: [
              {
                  field: 'EntityCode',
                
                  name: "کد",
                  filter:'numeric'
                
                
              },
              {
                  field: 'EntityName',
                 
                  name: "نام",
                 
                 
              
              },
              {
                  field: 'PartnerLegalName',
                
                  name: "نام حقوقی",
              
                
              },
          ]
      },
      {
          name: 'دفتر مرکزی',
          field: 'PartnerName',
          // orderIndex:2,
          children: [
              {
                  field: 'CentralEntityCode',
                 
                  name: "کد",
                  filter: 'numeric',
                 
              },
              {
                  field: 'CentralEntityName',
                  
                  name: "نام",
                  
                 
              },
          ]
      },
      {
          name: 'گردش',
          field: 'PartnerLegalName',
        
          children: [
              {
                  field: 'DebtorTotal',
                  
                  name: "بدهکار",
                  filter: 'numeric',
                  cell:CurrencyCell,
                  footerCell: CustomFooterSome,
                  className: 'word-break',
              },
              {
                  field: 'CreditorTotal',
                  
                  name: "بستانکار",
                  cell: CurrencyCell,
                  footerCell: CustomFooterSome,
                  filter: 'numeric',
                  className: 'word-break',
                
              },
              {
                  field: 'Remainder',
                
                  name: "مانده",
                  cell: CurrencyCell,
                  footerCell: CustomFooterSome,
                  filter: 'numeric',
                  className: 'word-break',
                  
              },
              {
                  field: 'RemainderType',
                 
                  name: "تشخیص",
                
               
               
              },
          ]
      },
    {
        field: 'MatchedPrice',
    
      name: "تطبیق داده شده",
      cell: CurrencyCell,
      filter: 'numeric',
      footerCell: CustomFooterSome,
      className: 'word-break',
     
    },
    {
        field: 'NotMatchedPrice',
      
      filter: "numeric",
      name: "تطبیق داده نشده",
      footerCell: CustomFooterSome,
      cell: CurrencyCell,
      className: 'word-break',
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
export default PrintSettingGridPage









