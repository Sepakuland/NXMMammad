import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import TotalPrintWCData from '../../SaleTotalBatchReceipt/DisplayDetails/TotalPrintWCData.json'
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const TotalPrintWC = (props) => {


    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data
    useEffect(() => {
        let tempData = TotalPrintWCData.map((data) => {
            let temp = (data.perUnit).toString().replaceAll(',', '')
            let temp2 = (data.totalAmount).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            let cost2 = parseFloat(temp2, 2)
            return {
                ...data,
                perUnit: cost,
                totalAmount: cost2,
                productCode: parseInt(data.productCode),

            }
        })
        setData(tempData)
    }, [lang])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: 'productCode',
            name: "کد کالا",
            className: 'word-break',

        },
        {
            field: 'productName',
            name: "نام کالا",
            // width: '60px',
        },
        {
            field: 'count',
            name: "تعداد",
            footerCell: CustomFooterSome,
            cell: CurrencyCell,
        },
        {
            field: 'total',
            className: 'word-break',
            name: "مقدار کل",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'perUnit',
            className: 'word-break',
            name: "فی واحد",
            cell: CurrencyCell,

        },
        {
            field: 'totalAmount',
            className: 'word-break',
            name: "مبلغ کل",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
    ]

    return (
        <div style={{ direction: i18n.dir() }}>
            <Print
                printData={data}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("تست و دمو")}
                subTitle={t("شماره سرجمع ") + '903'}
            >

                <div className='row betweens'>
                    <div className='col-lg-4 col-md-4 col-4'>{t("تاریخ سرجمع")}: 1401/08/07</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("تاریخ ارسال")}: 1401/08/07</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("مجموع حجم")}: 0 لیتر(dm3)</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("مجموع وزن")}: 0 Kg</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("انبار")}: {t("انبار اصلی")}</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("انباردار")}: حمید رضا پرویزی</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("موزع")}: جهانگرد رضایی</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("راننده")}: جهانگرد رضایی</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("خودرو")}: نیسان زامیاد (شماره: 489ص29 ایران 19 رضایی)</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("پیش فاکتورها")}: 13018، 13019، 13020، 13021</div>
                    <div className='col-lg-6 col-md-6 col-6'>{t("توضیحات")}: ---</div>
                </div>
            </Print>
            <div className='p-3' style={{ direction: i18n.dir() }}>
                <div className='row justify-content-center'>
                    <div className='col-lg-11 col-md-12 col-sm-12 col-12'>
                        <p>{t('کلیه اقلام فوق، صحیح و سالم تحویل اینجانب ....................................................... گردید و پس از خروج از انبار حق هرگونه اعتراضی را از خود سلب می نمایم')}</p>
                    </div>
                    <div className='col-lg-11 col-md-12 col-sm-12 col-12 Signature'>
                        <div className='row'>
                            <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                                <div className='up'>{t("امضا مدیر مالی:")}</div>
                                <div className='down'></div>
                            </div>
                            <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                                <div className='up'>{t("امضا مدیر/سرپرست فروش:")}</div>
                                <div className='down'></div>
                            </div>
                            <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                                <div className='up'>{t("امضا انباردار:")}</div>
                                <div className='down'></div>
                            </div>
                            <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                                <div className='up'>{t("امضا تحویل گیرنده:")}</div>
                                <div className='down'></div>
                            </div>
                        </div>

                    </div>
                    <div className='col-lg-11 col-md-12 col-sm-12 col-12'>
                        <p >{t('به دلیل تأخیر حضور / غیبت / جابجایی راننده مربوطه ، کلیه اقلام مربوط به این حواله به آقای ....................................................... بعنوان تحویل گیرنده جایگزین ، تحویل و مسئولیت کلیه امور به عهده نامبرده می باشد')}</p>
                    </div>
                    <div className='col-lg-11 col-md-12 col-sm-12 col-12 Signature'>
                        <div className='row'>
                            <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                <div className='up'>{t("امضا انباردار:")}</div>
                                <div className='down'></div>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                <div className='up'>{t("امضا تحویل گیرنده جایگزین:")}</div>
                                <div className='down'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>)
}
export default TotalPrintWC