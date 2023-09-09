import React from 'react'
import { useTranslation } from "react-i18next";
import StringFooterSome from "../Document/StringFooterSum";
import { FooterSome,IndexCell, CurrencyCell, TotalTitle } from "rkgrid";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";
import Print from "sepakuland-component-print";
import { useEffect } from 'react';
import { useState } from 'react';


const SinglePrint = ({ printData, showZoom }) => {
    const { t, i18n } = useTranslation();
    const CustomFooterSome = (props) => <FooterSome {...props} data={printData.generalDocumentArticles} />
    const CustomStringFooterSome = (props) => <StringFooterSome {...props} fieldSome={'debits'} lang={i18n.language} data={printData.generalDocumentArticles} />

    const [generalDocumentPrintData, setGeneralDocumentPrintData] = useState({})
    useEffect(() => {
        let arr = []
        let tempData = printData.generalDocumentArticles.map((data) => {
            arr = [];
            let splittedFormersNames = data.moeinAccountFormersNames.split(" / ")
            arr.push(`${splittedFormersNames[1]} / ${splittedFormersNames[2]}`)
            data.detailed6Name !== null ?
                arr.push(`${data.detailed4Name} / ${data.detailed5Name} / ${data.detailed6Name}`)
                : data.detailed5Name !== null ?
                    arr.push(`${data.detailed4Name} / ${data.detailed5Name} `)
                    : data.detailed4Name !== null ?
                        arr.push(`${data.detailed4Name}`)
                        : arr.push("---")
            data.notes === null || data.notes === "" ? arr.push("---") : arr.push(data.notes);
            return {
                ...data,
                documentDescription: arr.join("\n")
            }
        })
        setGeneralDocumentPrintData({ ...printData, generalDocumentArticles: tempData })
    }, [printData])


    const NoneFooter = (props) => <></>
    let tempColumn = [
        {
            field: "IndexCell",
            width: "60px",
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: "moeinAccountCompleteCode",
            name: "معین",
            footerCell: NoneFooter,
            //  className:"flex-1"
            width: "50px"
        },
        {
            field: "detailed4Code",
            name: "تفضیلی سطح4",
            footerCell: NoneFooter,
            width: "50px"
        },
        {
            field: "detailed5Code",
            name: "تفضیلی سطح5",
            footerCell: NoneFooter,
            width: "50px"
        },
        {
            field: "detailed6Code",
            name: "تفضیلی سطح6",
            footerCell: NoneFooter,
            width: "50px"
        },
        {
            field: "documentDescription",
            width: "250px",
            name: "توضیحات",
            footerCell: CustomStringFooterSome,
        },
        {
            field: "debits",
            name: "بدهکار",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
            width: "90px"
        },
        {
            field: "credits",
            name: "بستانکار",
            footerCell: CustomFooterSome,
            cell: CurrencyCell,
            width: "90px"
        },
    ];

    return (
        <React.Fragment>
            <div style={{ direction: i18n.dir() }}>
                <Print
                    printData={generalDocumentPrintData.generalDocumentArticles}
                    columnList={tempColumn}
                    logo={CoddingIcon}
                    title={t("تست و دمو")}
                    subTitle={t("اسناد کل")}
                    showZoom={showZoom}
                >
                    <div className='row betweens'>
                        <div className='col-lg-4 col-md-4 col-4'>{t("شماره سند")}: {generalDocumentPrintData.generalDocumentNumber}</div>
                        <div className='col-lg-8 col-md-8 col-8'>{t("شرح سند")}: {generalDocumentPrintData.documentDescription}</div>
                    </div>
                </Print>
                <div className='p-3' style={{ direction: i18n.dir() }}>
                    <div className='row justify-content-center'>
                        <div className='col-lg-11 col-md-12 col-sm-12 col-12 Signature'>
                            <div className='row'>
                                <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                    <div className='up'>{t("تنظیم‌کننده")}:</div>
                                    <div className='down'></div>
                                </div>
                                <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                    <div className='up'>{t("تایید‌کننده")}:</div>
                                    <div className='down'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
export default SinglePrint