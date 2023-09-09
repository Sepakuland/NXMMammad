import React, {useEffect, useRef, useState} from "react";
import products from "../../BankCharge/DisplayDetails/product.json";
import {useTranslation} from "react-i18next";
import ChartPage from '../../../../../components/chart/ChartPage'


function BankChargeChart() {

    const [data,setData]=useState([])

    const { t, i18n } = useTranslation();

    const [savedCharts,setSavedCharts]=useState([
        {title:'تست 1',dashboard:false},
        {title:'تست 2',dashboard:true},
    ])


    useEffect(()=>{
        let tempData=products.map((data)=>{
            let temp=(data.Amount).toString().replaceAll(',','')
            let cost=parseFloat(temp,2)
            return {
                ...data,
                Date:new Date(data.Date),
                Amount:cost,
                Code:parseInt(data.Code),
                RefCode:parseInt(data.RefCode)
            }
        })
        setData(tempData)

    },[i18n.language])

    const columnsObj=[
        {value:"IndexCell",title:t('ردیف')} ,
        {value:"Code",title:t('کد')} ,
        {value:"SourceFund",title:t('صندوق مبدأ')} ,
        {value:"OriginBank",title:t('بانک مبدأ')} ,
        {value:"AccountName",title:t('نام حساب')} ,
        {value:"Amount",title:t('مبلغ')} ,
        {value:"Date",title:t('تاریخ')} ,
        {value:"Description",title:t('توضیحات')} ,
    ]

    const chartObj=[
        {value:"Amount",title:t('مبلغ')} ,
        {value:"Code",title:t('کد')} ,
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

export default BankChargeChart