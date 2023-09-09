import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import DistributionTeamTwoPrintData from '../../SaleTotalBatchReceipt/DisplayDetails/DistributionTeamTwoPrintData.json';
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const DistributionTeamTwoPrint = (props) => {

    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    console.log(" props.dataItem.DocumentCode", props.dataItem)
    useEffect(() => {
        let tempData = DistributionTeamTwoPrintData.map((data) => {
            let temp = (data.Final).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                Final: cost,
                Invoice: parseInt(data.Invoice),
                Code: parseInt(data.Code),
                Phone: parseInt(data.Phone),

            }
        })
        setData(tempData)
    }, [i18n.language])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    const customSingleBoxCell= (props) => (
        <td>
            <div className='d-flex align-items-center justify-content-center'>
                <span className='box-char'></span>
            </div>
        </td>
    )
    const customEmptyCell= (props) => <td></td>

    

    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: 'Factor',
            name: "فاکتور",
            className:'word-break',

        },
        {
            field: 'AccountParty',
            name: "طرف حساب",
        },
        {
            field: 'Phone',
            name: "تلفن",
            className:'word-break',

        },
        {
            field: 'Address',
            name: "آدرس",
        },
        {
            field: 'Final',
            name: "نهایی",
            className:'word-break',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'Settlement',
            name: "تسویه",
        },
        {
            field: 'Cash',
            name: "نقد",
            cell:customSingleBoxCell
        },
        {
            field: 'Cheque',
            name: "چک",
            cell:customSingleBoxCell
        },
        {
            field: 'Bank',
            name: "بانک",
            cell:customEmptyCell
        },
        {
            field: 'Serial',
            name: "سریال",
            cell:customEmptyCell
        },
        {
            field: 'DueDate',
            name: "سررسید",
            cell:customEmptyCell
        },
        {
            field: 'Demands',
            name: "مطالبات",
            cell:customEmptyCell
        },
        {
            field: 'Returned',
            name: "برگشتی",
            cell:customSingleBoxCell
        },
        {
            field: 'Discount',
            name: "تخفیف",
            cell:customEmptyCell
        },
    ]

    return (
        <>
            <Print
                printData={data}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("تست و دمو")}
                subTitle={t("شماره سرجمع ")+'903'}
            >

                <div className='row betweens'>
                    <div className='col-lg-4 col-md-4 col-4'>{t("تاریخ سرجمع")}: 1401/08/07</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("تاریخ ارسال")}: 1401/08/07</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("انبار")}: {t("انبار اصلی")}</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("انباردار")}: حمید رضا پرویزی</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("موزع")}: جهانگرد رضایی</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("راننده")}: جهانگرد رضایی</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("خودرو")}: نیسان زامیاد (شماره: 489ص29 ایران 19 رضایی)</div>
                    <div className='col-lg-6 col-md-6 col-6'>{t("توضیحات")}: ---</div>
                </div>
            </Print>

        </>)
}
export default DistributionTeamTwoPrint