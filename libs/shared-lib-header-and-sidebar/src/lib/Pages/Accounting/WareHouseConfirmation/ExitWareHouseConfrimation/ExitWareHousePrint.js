import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { useTranslation } from "react-i18next";
import ExirWareHouseData from './ExirWareHouseData.json'
import { IndexCell,getLangDate } from "rkgrid";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg";

const ExitWareHousePrint = () => {

    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data


    useEffect(() => {
        let tempData = ExirWareHouseData.map((data) => {
            return {
                ...data,
                DocumentDate: getLangDate(lang,new Date(data.DocumentDate)),
                DocumentCode: parseInt(data.DocumentCode),
                DocumentRefCode: data.DocumentRefCode !== '' ? parseInt(data.DocumentRefCode) : ''
            }
        })
        setData(tempData)
    }, [lang])




    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
        },
        {
            field: 'DocumentCode',
            name: "شماره حواله",

        },
        {
            field: 'DocumentDate',
            name: "تاریخ حواله",
        },
        {
            field: 'Warehouse',
            name: "انبار",
        },
        {
            field: 'WarehouseKeeperName',
            name: "انباردار",
        },
        {
            field: 'DocumentRefType',
            name: "نوع",
        },
        {
            field: 'DocumentRefCode',
            name: "کد سند ارجاع",
        },

    ]

    return (

        <Print
            printData={data}
            columnList={tempColumn}
            logo={CoddingIcon}
            title={t("نمایش جزییات")}
            subTitle={t("تایید خروج از انبار")}


        />
    )
}
export default ExitWareHousePrint









