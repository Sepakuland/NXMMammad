import React, { useEffect, useState, useRef } from 'react'
import Print from '../../../components/print'
import IndexCell from "../../../components/RKGrid/IndexCell";
import TotalTitle from "../../../components/RKGrid/TotalTitle";
import FooterSome from "../../../components/RKGrid/FooterSome";
import { useTranslation } from "react-i18next";
import DataForMainGrid from './DataForMainGrid.json'
import { getLangDate } from "../../../utils/getLangDate";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";



const PrintAggregatedDocument = () => {

    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data


    useEffect(() => {
        let tempData = DataForMainGrid.map((data) => {
            let temp = (data.DocumentBalance).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                DocumentInsertDate: getLangDate(lang,new Date(data.DocumentDate)),
                DocumentBalance: cost,
                DocumentCode: data.DocumentCode !== '' ? parseInt(data.DocumentCode) : '',
            }
        })
        setData(tempData)
    }, [lang])
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    let tempColumn = [
        {
            field: 'IndexCell',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: 'DocumentCode',
            name: "ش سند",
            filter: 'numeric',
        },
        {
            field: 'DocumentInsertDate',
            name: "تاریخ",
            // format: "{0:d}",
        },
        {
            field: 'DocumentBalance',
            name: "تراز",
            filter: 'numeric',
            footerCell: CustomFooterSome
        },
        {
            field: 'InsertUser',
            name: "درج",
        },
        {
            field: 'LastUpdateUser',
            name: "آخرین تغییر",
        },
        {
            field: 'DocumentState',
            name: "وضعیت",
        },
        {
            field: 'DocumentDescription',
            name: "شرح",
        },
    ]
    return (
        <>
            <Print
                printData={data}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("نمایش جزییات")}
                subTitle={t("ریز اسناد تجمیعی (سند شماره 31611)")}
            />

        </>
    )
}
export default PrintAggregatedDocument









