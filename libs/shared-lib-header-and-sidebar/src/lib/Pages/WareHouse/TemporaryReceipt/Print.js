import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import  { IndexCell,DateCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";
import gData from "./gData.json";

const TestPrint = (props) => {

    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    useEffect(() => {
        let tempData = gData.map((data) => {
            return {
                ...data,
                DocumentDate: new Date(data.DocumentDate),
                StorekeeperCode: parseInt(data.StorekeeperCode),
                WarehouseCode: parseInt(data.WarehouseCode),
            }
        })
        setData(tempData)
    }, [lang])



    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            reorderable: false
        },
        {
            field: 'DocumentDate',
            name: "تاریخ رسید",
            cell: DateCell,
            className:'word-break',
            reorderable: true,
        },
        {
            field: 'PersonName',
            filterable: false,
            name: "تحویل دهنده",
        },
        {
            field: 'StorekeeperCode',
            filterable: false,
            className:'word-break',
            name: "کد انباردار",
        },
        {
            field: 'StorekeeperName',
            filterable: false,
            name: "نام انباردار",
        },
        {
            field: 'WarehouseCode',
            filterable: false,
            className:'word-break',
            name: "کد انبار",
        },
        {
            field: 'WarehouseName',
            filterable: false,
            name: "نام انبار",
        },
        {
            field: 'Description',
            filterable: false,
            width: '250px',
            name: "توضیحات",
        },
    ]

    return (
        <>
            <Print
                printData={data}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("تست و دمو")}
                subTitle={t("رسیدهای موقت انبار")}
            />

        </>)
}
export default TestPrint