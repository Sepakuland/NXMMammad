import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import Data from './Data.json'
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";

const PrintIncomeConfirmationPage = () => {

  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang')
  const [data, setData] = useState([])
  const dataRef = useRef()
  dataRef.current = data


    useEffect(() => {
        let tempData = Data.map((data) => {
            let temp = (data.TotalPayingPrices).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)

            return {
                ...data,
                TotalPayingPrices: cost,

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
            field: 'Year',
            filterable: false,
            name: "سال",
            filter: 'numeric',
            className:'word-break'
        },
        {
            field: 'Month',
            filterable: false,
            name: "ماه",
        },
        {
            field: 'Personnel',
            filterable: false,
            name: "پرسنل",
        },
        {
            field: 'BillCode',
            filterable: false,
            name: "شماره فیش",
            className:'word-break'
        },
        {
            field: 'TotalPayingPrices',
            cell:CurrencyCell,
            footerCell:CustomFooterSome,
            filterable: false,
            name: "جمع خالص پرداختی",
            className:'word-break'
        }
    ]

  return (

    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t('تایید حقوق و دستمزد')}
     

    />
  )
}
export default PrintIncomeConfirmationPage









