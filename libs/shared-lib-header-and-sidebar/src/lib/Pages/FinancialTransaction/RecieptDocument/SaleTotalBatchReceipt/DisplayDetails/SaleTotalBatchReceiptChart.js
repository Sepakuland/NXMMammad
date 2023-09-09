import React, {useEffect, useRef, useState} from "react";
import products from "../../SaleTotalBatchReceipt/DisplayDetails/product.json";
import {useTranslation} from "react-i18next";
import ChartPage from '../../../../../components/chart/ChartPage'


function SaleTotalBatchReceiptChart() {

    const [data,setData]=useState([])

    const { t, i18n } = useTranslation();

    const [savedCharts,setSavedCharts]=useState([
        {title:'تست 1',dashboard:false},
        {title:'تست 2',dashboard:true},
    ])


    useEffect(()=>{
        let tempData=products.map((data,index)=>{
            let temp=(data.TotalPrice).toString().replaceAll(',','')
            let cost=parseFloat(temp,2)
            return {
                ...data,
                IndexCell: index + 1,
                TotalDate:new Date(data.TotalDate),
                ShipmentDate:new Date(data.ShipmentDate),
                TotalPrice:cost,
                TotalCode:parseInt(data.TotalCode),
                PayeeCode:parseInt(data.PayeeCode),
                DriverCode:parseInt(data.DriverCode)
            }
        })
        setData(tempData)

    },[i18n.language])

    const columnsObj=[
        {value:"IndexCell",title:t('ردیف')} ,
        {value:"TotalCode",title:t('سرجمع')} ,
        {value:"TotalDate",title:t('تاریخ سرجمع')} ,
        {value:"ShipmentDate",title:t('تاریخ ارسال')} ,
        {value:"PayeeCode",title:t('کد موزع')} ,
        {value:"PayeeName",title:t('موزع')} ,
        {value:"DriverCode",title:t('کد راننده')} ,
        {value:"DriverName",title:t('نام راننده')} ,
        {value:"TotalPrice",title:t('مبلغ کل')} ,
        {value:"Status",title:t('وضعیت')} ,
        {value:"TotalDescription",title:t('توضیحات سرجمع')} ,
    ]

    const chartObj=[
        {value:"TotalPrice",title:t('مبلغ کل')} ,
        {value:"TotalCode",title:t('سرجمع')} ,
    ]

    return(
        <>
            <ChartPage
              data={data}
              columnsObj={columnsObj}
              chartObj={chartObj}
              savedCharts={savedCharts}
            />
        </>
    )
}

export default SaleTotalBatchReceiptChart