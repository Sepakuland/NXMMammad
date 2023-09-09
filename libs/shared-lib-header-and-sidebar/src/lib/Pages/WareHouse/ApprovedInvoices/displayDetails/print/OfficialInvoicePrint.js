import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { CurrencyCell, IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import OfficialInvoiceData from './OfficialInvoiceData.json'
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import n2words from 'n2words';

const OfficialInvoicePrint = () => {

    const { t, i18n } = useTranslation();
    const lang = i18n.language
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data
    const [total, setTotal] = useState(0)

    useEffect(() => {
        let tempData = OfficialInvoiceData.map((data) => {
            let temp = (data.UnitPrice).toString().replaceAll(',', '')
            let temp2 = (data.TotalPrice).toString().replaceAll(',', '')
            let temp3 = (data.DiscountPrice).toString().replaceAll(',', '')
            let temp4 = (data.TotalAmountAfterDeductingDiscount).toString().replaceAll(',', '')
            let temp5 = (data.TaxesAnddutiesSum).toString().replaceAll(',', '')
            let temp6 = (data.TotalCountAfterCalculation).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            let cost2 = parseFloat(temp2, 2)
            let cost3 = parseFloat(temp3, 2)
            let cost4 = parseFloat(temp4, 2)
            let cost5 = parseFloat(temp5, 2)
            let cost6 = parseFloat(temp6, 2)
            return {
                ...data,
                UnitPrice: cost,
                TotalPrice: cost2,
                DiscountPrice: cost3,
                TotalAmountAfterDeductingDiscount: cost4,
                TaxesAnddutiesSum: cost5,
                TotalCountAfterCalculation: cost6,
                ProductCode: data.ProductCode !== '' ? parseInt(data.ProductCode) : '',
            }
        })
        setData(tempData)
    }, [i18n.language])



    const CustomFooterSome1 = (props) => {

        // const [total, setTotal] = useState(0)

        useEffect(() => {
            if (dataRef.current?.length) {
                let tempTotal = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotal(tempTotal)
            }

        }, [dataRef.current])

        return (
            <td className={'td-p0 border-left-0'} style={{ height: '72px' }}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className ? props?.className : ''}`} style={props.style}>
                        {total?.toLocaleString()}
                    </div>
                    <div className={'empty-footer border-left-0'}></div>
                </div>
            </td>


        );
    };
    const CustomFooterSome2 = (props) => {



        useEffect(() => {
            if (dataRef.current?.length) {
                let tempTotal = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotal(tempTotal)
            }

        }, [dataRef.current])

        return (
            <td className={'td-p0 border-left-0'} style={{ height: '72px' }}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className ? props?.className : ''}`} style={props.style}>
                        {total?.toLocaleString()}
                    </div>
                    <div className='empty-footer'></div>
                </div>
            </td>


        );
    };
    const CustomFooterSome3 = (props) => {

        useEffect(() => {
            if (dataRef.current?.length) {
                let tempTotal = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotal(tempTotal)
            }

        }, [dataRef.current])

        return (
            <td className={'td-p0 border-left-0'} style={{ height: '72px' }}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className ? props?.className : ''}`} style={props.style}>
                        {total?.toLocaleString()}
                    </div>
                    <div className={'empty-footer justify-content-end'}>{t('مبلغ نهایی :')}</div>
                </div>
            </td>


        );
    };
    const CustomFooterSome4 = (props) => {
        useEffect(() => {
            if (dataRef.current?.length) {
                let tempTotal = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotal(tempTotal)
            }

        }, [dataRef.current])

        return (
            <td className={'td-p0 border-left-0'} style={{ height: '72px' }}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className ? props?.className : ''}`} style={props.style}>
                        {total?.toLocaleString()}
                    </div>
                    <div className={'empty-footer border-left-0'}>{total?.toLocaleString()}</div>
                </div>
            </td>


        );
    };
    const CustomFooterSome5 = (props) => {

        useEffect(() => {
            if (dataRef.current?.length) {
                let tempTotal = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotal(tempTotal)
            }

        }, [dataRef.current])

        return (
            <td className={'td-p0 border-left-0'} style={{ height: '72px' }}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className ? props?.className : ''}`} style={props.style}>
                        {total?.toLocaleString()}
                    </div>
                    <div>
                        <div className='empty-footer'></div>
                    </div>
                </div>
            </td>
        );
    };


    const NoFooter = (props) => <td className={'td-p0 border-left-0'} style={{ height: '72px' }}>
        <div>
            <div className='empty-footer-border'></div>
            <div className='empty-footer border-left-0'></div>
        </div>
    </td>
    const CustomTotalTitle = (props) => {


        useEffect(() => {
            if (dataRef.current?.length) {
                let tempTotal = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotal(tempTotal)
            }

        }, [dataRef.current])
        return (

            <td colSpan={3} className={`td-p0 ${lang == 'en' ? 'border-right-0' : 'border-left-0'}`} style={{ height: '72px' }}>
                <div className={`empty-footer-border justify-content-start ${lang == 'en' ? 'border-right-1' : 'border-left-1'}`}>
                    {t('جمع')}
                </div>
                <div className={`empty-footer justify-content-start ${lang == 'en' ? 'border-right-1' : 'border-left-1'}`}> {t("مبلغ نهایی به حروف")}: {n2words(total, { lang: lang })}</div>
            </td>

        );
    };
    let tempColumn = [
        {
            field: 'IndexCell',
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: CustomTotalTitle,
        },
        {
            field: 'ProductCode',
            //columnMenu ColumnMenu,
            name: "کد کالا",
            footerCell: () => <></>

        },
        {
            field: 'ProductDes',
            //columnMenu ColumnMenu,
            name: "شرح کالا یا خدمت",
            footerCell: () => <></>
        },
        {
            field: 'Count',
            //columnMenu ColumnMenu,
            name: "تعداد",
            footerCell: CustomFooterSome1
        },
        {
            field: "Equivalent",
            //columnMenu ColumnMenu,
            name: 'معادل',
            footerCell: CustomFooterSome1,
            cell: CurrencyCell,
        },
        {
            field: 'UnitPrice',
            //columnMenu ColumnMenu,
            name: "مبلغ واحد",
            cell: CurrencyCell,
            footerCell: NoFooter
        },
        {
            field: 'TotalPrice',
            //columnMenu ColumnMenu,
            name: "مبلغ کل",
            cell: CurrencyCell,
            footerCell: CustomFooterSome2
        },
        {
            field: 'DiscountPrice',
            //columnMenu ColumnMenu,
            name: "مبلغ تخفیف",
            cell: CurrencyCell,
            footerCell: CustomFooterSome5
        },
        {
            field: 'TotalAmountAfterDeductingDiscount',
            //columnMenu ColumnMenu,
            name: "مبلغ کل پس از کسر تخفیف",
            cell: CurrencyCell,
            footerCell: CustomFooterSome5,
        },
        {
            field: 'TaxesAnddutiesSum',
            //columnMenu ColumnMenu,
            name: "جمع مالیات و عوارض",
            className: 'text-center',
            filter: 'numeric',
            cell: CurrencyCell,
            footerCell: CustomFooterSome3,
        },
        {
            field: 'TotalCountAfterCalculation',
            //columnMenu ColumnMenu,
            name: "مبلغ کل پس از کسر تخفیف بعلاوه جمع مالیات و عوارض",
            className: 'text-center',
            filter: 'numeric',
            cell: CurrencyCell,
            footerCell: CustomFooterSome4,
        },


    ]
    return (
        <>

            <Print
                printData={data}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("نمایش جزییات")}
                subTitle={t("صورتحساب فروش")}
            >
                <div className='col-lg-12 col-md-12 col-12 border-table-print-header' style={{ direction: i18n.dir() }}>
                    <div className='header-print-1 col-lg-12 col-md-12 col-12'>‌ {t("مشخصات فروشنده")}</div>
                    <div className='header-print-2 col-lg-12 col-md-12 col-12 '>
                        <div className='row ' style={{ marginTop: "10px", }}>
                            <div className=' col-lg-4 col-md-4 col-4' style={{ fontSize: "12px" }}>‌ {t("نام شخص حقیقی / حقوقی")}:{t("تست و دمو (شماره ثبت 19491)")}</div>
                            <div className='col-lg-4 col-md-4 col-4' style={{ fontSize: "12px" }}>
                                <div className='row'>
                                    <div className=' col-lg-3 col-md-3 col-3'>{t("شماره اقتصادی")}:</div>

                                    <div className=' col-lg-9 col-md-9 col-9'>
                                        <table className='d-flex align-items-center' style={{ width: "100%" }}>
                                            <tr>
                                                <td className='table-number-header'>3</td>
                                                <td className='table-number-header'>1</td>
                                                <td className='table-number-header'>2</td>
                                                <td className='table-number-header'>5</td>
                                                <td className='table-number-header'>6</td>
                                                <td className='table-number-header'>4</td>
                                                <td className='table-number-header'>2</td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                            </tr>
                                        </table>
                                    </div>

                                </div>
                            </div>
                            <div className='col-lg-4 col-md-4 col-4' style={{ fontSize: "12px" }}>
                                <div className='row'>
                                    <div className=' col-lg-3 col-md-3 col-3'>{t("شماره ثبت/شماره ملی")}:</div>

                                    <div className=' col-lg-9 col-md-9 col-9'>
                                        <table className='d-flex align-items-center' style={{ width: "100%" }}>
                                            <tr>
                                                <td className='table-number-header'>8</td>
                                                <td className='table-number-header'>1</td>
                                                <td className='table-number-header'>5</td>
                                                <td className='table-number-header'>2</td>
                                                <td className='table-number-header'>5</td>
                                                <td className='table-number-header'>5</td>
                                                <td className='table-number-header'>5</td>
                                                <td className='table-number-header'>5</td>
                                                <td className='table-number-header'>0</td>
                                                <td className='table-number-header'>0</td>
                                                <td className='table-number-header'>4</td>
                                                <td className='table-number-header'>1</td>
                                            </tr>
                                        </table>
                                    </div>

                                </div>
                            </div>
                            <div className='col-lg-4 col-md-4 col-4' style={{ fontSize: "12px" }}>{t("شماره تلفن/نمابر")} : 08338232247</div>
                            <div className='col-lg-4 col-md-4 col-4' style={{ fontSize: "12px" }}>
                                <div className='row'>
                                    <div className=' col-lg-3 col-md-3 col-3'>{t("کد پستی 10رقمی")}:</div>

                                    <div className=' col-lg-9 col-md-9 col-9'>
                                        <table className='d-flex align-items-center' style={{ width: "100%" }}>
                                            <tr>
                                                <td className='table-number-header'>6</td>
                                                <td className='table-number-header'>7</td>
                                                <td className='table-number-header'>1</td>
                                                <td className='table-number-header'>3</td>
                                                <td className='table-number-header'>7</td>
                                                <td className='table-number-header'>7</td>
                                                <td className='table-number-header'>7</td>
                                                <td className='table-number-header'>7</td>
                                                <td className='table-number-header'>1</td>
                                                <td className='table-number-header'>4</td>

                                            </tr>
                                        </table>
                                    </div>

                                </div>
                            </div>
                            <div className='col-lg-4 col-md-4 col-4' style={{ fontSize: "12px" }}>{t("آدرس")} : {t(" کرمانشاه - میدان آزادی - خ امیریه - خ گمرک - پلاک 165")}</div>
                        </div>
                    </div>
                    <div className='header-print-3 col-lg-12 col-md-12 col-12'>‌ {t("مشخصات خریدار")}</div>
                    <div className='header-print-4 col-lg-12 col-md-12 col-12 '>
                        <div className='row ' style={{ marginTop: "10px", }}>
                            <div className=' col-lg-4 col-md-4 col-4' style={{ fontSize: "12px" }}>‌ {t("نام شخص حقیقی / حقوقی")}:{t("زینب یزدانی(سوپر مارکت یزدانی)")}</div>
                            <div className='col-lg-4 col-md-4 col-4' style={{ fontSize: "12px" }}>
                                <div className='row'>
                                    <div className=' col-lg-3 col-md-3 col-3'>{t("شماره اقتصادی")}:</div>

                                    <div className=' col-lg-9 col-md-9 col-9'>
                                        <table className='d-flex align-items-center' style={{ width: "100%" }}>
                                            <tr>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                            </tr>
                                        </table>
                                    </div>

                                </div>
                            </div>
                            <div className='col-lg-4 col-md-4 col-4' style={{ fontSize: "12px" }}>
                                <div className='row'>
                                    <div className=' col-lg-3 col-md-3 col-3'>{t("شماره ثبت/شماره ملی")}:</div>

                                    <div className=' col-lg-9 col-md-9 col-9'>
                                        <table className='d-flex align-items-center' style={{ width: "100%" }}>
                                            <tr>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                                <td className='table-number-header'></td>
                                            </tr>
                                        </table>
                                    </div>

                                </div>
                            </div>
                            <div className='col-lg-4 col-md-4 col-4' style={{ fontSize: "12px" }}>{t("شماره تلفن/نمابر")} : 09038608011</div>
                            <div className='col-lg-4 col-md-4 col-4' style={{ fontSize: "12px" }}>
                                <div className='row'>
                                    <div className=' col-lg-3 col-md-3 col-3'>{t("کد پستی 10رقمی")}:</div>

                                    <div className=' col-lg-9 col-md-9 col-9'>
                                        <table className='d-flex align-items-center' style={{ width: "100%" }}>
                                            <tr>
                                                <td className='table-number-header'>6</td>
                                                <td className='table-number-header'>7</td>
                                                <td className='table-number-header'>1</td>
                                                <td className='table-number-header'>3</td>
                                                <td className='table-number-header'>7</td>
                                                <td className='table-number-header'>7</td>
                                                <td className='table-number-header'>7</td>
                                                <td className='table-number-header'>7</td>
                                                <td className='table-number-header'>1</td>
                                                <td className='table-number-header'>4</td>

                                            </tr>
                                        </table>
                                    </div>

                                </div>
                            </div>
                            <div className='col-lg-4 col-md-4 col-4' style={{ fontSize: "12px" }}>{t("آدرس")} : {t("تهران صادقیه")}</div>
                        </div>
                    </div>
                    <div className='header-print-5 col-lg-12 col-md-12 col-12'>‌ {t("مشخصات کالا یا خدمات مورد معامله ( کلیه مبالغ به ریال می باشد )")}</div>
                </div>
            </Print>

            <div className='col-lg-11 col-md-12 col-sm-12 col-12 d-flex align-content-center align-items-center flex-wrap border-table-print' style={{ direction: i18n.dir() }}>
                <div className='footer-grid-print1 ' >
                    <div className='row'>
                        <div className='col-lg-3 col-md-3 col-sm-3 col-3'> ‌ {t("شرایط و نحوه فروش")}:</div>
                        <div className='col-lg-3 col-md-3 col-sm-3 col-3 d-flex align-content-center align-items-center'>
                            <input type='checkbox' checked={false} /> ‌ {t("نقدی")}
                        </div>
                        <div className='col-lg-3 col-md-3 col-sm-3 col-3 d-flex align-content-center align-items-center'>
                            <input type='checkbox' checked={true} /> ‌ {t("غیر نقدی")}
                        </div>
                        <div className='col-lg-3 col-md-3 col-sm-3 col-3'>{t("مهلت تسویه")} : 15 روز</div>
                    </div>
                </div>
                <div className='footer-grid-print2  '>
                    <div className='row'>
                        <div className='col-lg-6 col-md-6 col-sm-6 col-6'>‌ {t("مهر و امضاء فروشنده")}</div>
                        <div className='col-lg-6 col-md-6 col-sm-6 col-6'>‌ {t("مهر و امضاء خریدار")}</div>
                    </div>
                </div>
            </div>
            <div className='col-lg-11 col-md-12 col-sm-12 col-12 ' style={{ direction: i18n.dir(), margin: "auto", width: " 90.2%", marginTop: "15px" }}>{t("شرح تاییدیه تحویل کالا")}:{t(" فقط برای تست")}</div>
            <div className=' col-lg-12 col-md-12 col-sm-12 col-12 ' style={{ direction: i18n.dir(), margin: "auto", width: " 90.2%", marginTop: "15px" }}>{t("شرح تسویه فاکتور")}:{t("شماره شبا ir670150000003100002310776 خورشید تجارت زاگرس بانک سپه")}</div>
        </>

    )
}
export default OfficialInvoicePrint









