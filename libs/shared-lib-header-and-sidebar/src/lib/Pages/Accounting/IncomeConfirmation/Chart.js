import React, {useEffect, useRef, useState} from "react";
import data2 from "./Data.json";
import {useTranslation} from "react-i18next";
import ChartPage from '../../../components/chart/ChartPage'


function Chart() {

    const [data,setData]=useState([])

    const { t, i18n } = useTranslation();

    const [savedCharts,setSavedCharts]=useState([
        {title:'تست 1',dashboard:false},
        {title:'تست 2',dashboard:true},
    ])


    useEffect(()=>{
        let tempData = data2.map((data) => {
            let temp = (data.TotalPayingPrices).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)

            return {
                ...data,
                TotalPayingPrices: cost,
                Year: parseInt(data.Year),

            }
        })
        setData(tempData)

    },[i18n.language])


    console.log('data',data)

    const columnsObj=[
        {value:"Year",title:t('سال')} ,
        {value:"Month",title:t('ماه')} ,
        {value:"Personnel",title:t('پرسنل')} ,
        {value:"TotalPayingPrices",title:t('جمع خالص پرداختی')} ,
        {value:"BillCode",title:t('شماره فیش')} ,
       
    ]

    const chartObj=[
        {value:"Year",title:t('سال')} ,
        {value:"TotalPayingPrices",title:t('جمع خالص پرداختی')} ,
       
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

export default Chart