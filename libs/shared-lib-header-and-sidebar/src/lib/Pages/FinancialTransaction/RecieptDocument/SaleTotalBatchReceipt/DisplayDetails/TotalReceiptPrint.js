import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { CurrencyCell, IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import TotalReceiptPrintData from '../../SaleTotalBatchReceipt/DisplayDetails/TotalReceiptPrintData.json';
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const TotalReceiptPrint = (props) => {

    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    console.log(" props.dataItem.DocumentCode", props.dataItem)
    useEffect(() => {
        let tempData = TotalReceiptPrintData.map((data) => {
            let temp1 = (data.FactorAmount).toString().replaceAll(',', '')
            let cost1 = parseFloat(temp1, 2)
            let temp2 = (data.CashSettlementDiscount).toString().replaceAll(',', '')
            let cost2 = parseFloat(temp2, 2)
            let temp3 = (data.TaxDeduction).toString().replaceAll(',', '')
            let cost3 = parseFloat(temp3, 2)
            let temp4 = (data.FinalAmount).toString().replaceAll(',', '')
            let cost4 = parseFloat(temp4, 2)
            let temp5 = (data.Adapted).toString().replaceAll(',', '')
            let cost5 = parseFloat(temp5, 2)
            let temp6 = (data.Remained).toString().replaceAll(',', '')
            let cost6 = parseFloat(temp6, 2)
            let temp7 = (data.ReceiveCash).toString().replaceAll(',', '')
            let cost7 = parseFloat(temp7, 2)
            let temp8 = (data.PaymentInCash).toString().replaceAll(',', '')
            let cost8 = parseFloat(temp8, 2)
            let temp9 = (data.BankTransferReceive).toString().replaceAll(',', '')
            let cost9 = parseFloat(temp9, 2)
            let temp10 = (data.ChequeReceiveAmount).toString().replaceAll(',', '')
            let cost10 = parseFloat(temp10, 2)
            return {
                ...data,
                FactorAmount: cost1,
                CashSettlementDiscount: cost2,
                TaxDeduction: cost3,
                FinalAmount: cost4,
                Adapted: cost5,
                Remained: cost6,
                ReceiveCash: cost7,
                PaymentInCash: cost8,
                BankTransferReceive: cost9,
                ChequeReceiveAmount: cost10,

            }
        })
        setData(tempData)
    }, [lang])


    const CustomFooterSome1 = (props) => {

        const [total,setTotal]=useState(0)

        useEffect(()=>{
            if(dataRef.current?.length){
                let tempTotal = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field])||0,
                    0
                );
                setTotal(tempTotal)
            }

        },[dataRef.current])

        return (
            <td  className={'td-p0 border-left-0'} style={{height:'72px'}}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className?props?.className:''}`} style={props.style}>
                        {total?.toLocaleString()}
                    </div>
                    <div className={'empty-footer-border border-left-0'}></div>
                    <div className={'empty-footer border-left-0'}></div>
                </div>
            </td>


        );
    };
    const CustomFooterSome2 = (props) => {

        const [total,setTotal]=useState(0)

        useEffect(()=>{
            if(dataRef.current?.length){
                let tempTotal = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field])||0,
                    0
                );
                setTotal(tempTotal)
            }

        },[dataRef.current])

        return (
            <td  className={'td-p0 border-left-0'} style={{height:'72px',overflow:'visible'}}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className?props?.className:''}`} style={props.style}>
                        {total?.toLocaleString()}
                    </div>
                    <div className={`empty-footer-border  ${i18n.dir()} justify-content-end nowrap`}>{t('دریافت نقد از موزع:')}</div>
                    <div className={`empty-footer  ${i18n.dir()} justify-content-end nowrap`}>{t('کسری موزع:')}</div>
                </div>
            </td>


        );
    };
    const CustomFooterSome3 = (props) => {

        const [total,setTotal]=useState(0)

        useEffect(()=>{
            if(dataRef.current?.length){
                let tempTotal = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field])||0,
                    0
                );
                setTotal(tempTotal)
            }

        },[dataRef.current])

        return (
            <td  className={'td-p0 border-left-0'} style={{height:'72px',overflow:'visible'}}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className?props?.className:''}`} style={props.style}>
                        {total?.toLocaleString()}
                    </div>
                    <div className={`empty-footer-border ${i18n.dir()} justify-content-end word-break`}>{'6000000'.toLocaleString()}</div>
                    <div className={`empty-footer ${i18n.dir()} justify-content-end word-break`}>{'1000000'.toLocaleString()}</div>
                </div>
            </td>


        );
    };

    const CustomTotalTitle = (props) => {
        return (
            <td className={`td-p0 ${lang=='en'?'border-right-0':'border-left-0'}`} colSpan={9} style={{height:'72px'}}>
                <div className={`empty-footer-border justify-content-start ${lang=='en'?'border-right-1':'border-left-1'}`}>
                    {t('جمع')}
                </div>
                <div className={`empty-footer-border ${lang=='en'?'border-right-0':'border-left-0'}`}> </div>
                <div className={`empty-footer ${lang=='en'?'border-right-0':'border-left-0'}`}> </div>
            </td>

        );
    };
    const CustomFooter3 = (props) => {
        return (
            <td className={`td-p0 ${lang=='en'?'border-right-0':'border-left-0'}`} colSpan={3} style={{height:'72px'}}>
                <div className={`empty-footer-border`}> </div>
                <div className={`empty-footer-border ${lang=='en'?'border-right-0':'border-left-0'}`}> </div>
                <div className={`empty-footer ${lang=='en'?'border-right-0':'border-left-0'}`}> </div>
            </td>

        );
    };


    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: "#",
            cell: IndexCell,
            footerCell: CustomTotalTitle,
        },
        {
            name: 'طرف حساب',
            field: 'AccountParty',
            headerClassName: 'responsive-w',
            // orderIndex:2,
            children: [
                {
                    field: 'Code',
                    filterable: false,
                    name: "کد",
                    className:'word-break',
                    footerCell:()=><></>
                },
                {
                    field: 'Name',
                    name: "نام",
                    footerCell:()=><></>
                },
                {
                    field: 'LegalName',
                    name: "نام حقوقی",
                    footerCell:()=><></>
                },
            ]
        },
        {
            name: 'فاکتور',
            field: 'Factor',
            headerClassName: 'responsive-w',
            children: [
                {
                    field: 'Invoice',
                    name: "پیش فاکتور",
                    className:'word-break',
                    footerCell:()=><></>
                },
                {
                    field: 'Factor',
                    filterable: false,
                    className:'word-break',
                    name: "فاکتور",
                    footerCell:()=><></>
                },
                {
                    field: 'Document',
                    filterable: false,
                    className:'word-break',
                    name: "سند",
                    footerCell:()=><></>
                },
                {
                    field: 'IssueTracking',
                    filterable: false,
                    name: "ش پیگیری",
                    className:'word-break',
                    footerCell:()=><></>
                },
                {
                    field: 'Visitor',
                    name: "ویزیتور",
                    footerCell:()=><></>
                },
                {
                    field: 'FactorAmount',
                    // width: '60px',
                    name: "مبلغ",
                    className:'word-break',
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome1,
                },
                {
                    field: 'CashSettlementDiscount',
                    // width: '60px',
                    name: "تخفیف تسویه نقد",
                    className:'word-break',
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome1,
                },
                {
                    field: 'TaxDeduction',
                    name: "کسر از مالیات",
                    className:'word-break',
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome1,
                },
                {
                    field: 'FinalAmount',
                    name: "مبلغ نهایی",
                    className:'word-break',
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome1,
                },
                {
                    field: 'Adapted',
                    name: "تطبیق داده شده",
                    className:'word-break',
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome1,
                },
                {
                    field: 'Remained',
                    className:'word-break',
                    name: "مانده",
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome2,
                },
            ]
        },

        {
            field: 'ReceiveCash',
            className:'word-break',
            name: "دریافت نقد",
            cell: CurrencyCell,
            footerCell: CustomFooterSome3,
        },
        {
            field: 'PaymentInCash',
            className:'word-break',
            name: "پرداخت نقد",
            cell: CurrencyCell,
            footerCell: CustomFooterSome1,
        },
        {
            field: 'BankTransferReceive',
            className:'word-break',
            name: "دریافت حواله بانکی",
            cell: CurrencyCell,
            footerCell: CustomFooterSome1,
        },
        {
            name: 'دریافت چک',
            field: 'ChequeReceive',
            children: [
                {
                    field: 'Serial',
                    name: "سریال",
                    className:'word-break',
                    footerCell:CustomFooter3
                },
                {
                    field: 'Bank',
                    name: "بانک",
                    footerCell:()=><></>
                },
                {
                    field: 'DueDate',
                    name: "سررسید",
                    className:'word-break',
                    footerCell:()=><></>
                },
                {
                    field: 'ChequeReceiveAmount',
                    className:'word-break',
                    name: "مبلغ",
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome1,
                },
            ]
        },
    ]

    return (
        <>
            <Print
                printData={data}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("تست و دمو")}
                subTitle={t("چاپ دریافت کلی سرجمع")}
            >

                <div className='row betweens'>
                    <div className='col-lg-4 col-md-4 col-4'>{t("شماره سرجمع")}: 903</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("کد موزع")}: 20000003</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("نام موزع")}: جهانگرد رضایی</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("تاریخ")}: 1401/08/07</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("صندوق")}: {t("صندوق اصلی")}</div>
                    <div className='col-lg-6 col-md-6 col-6'>{t("توضیحات")}: ---</div>
                </div>
            </Print>

        </>)
}
export default TotalReceiptPrint