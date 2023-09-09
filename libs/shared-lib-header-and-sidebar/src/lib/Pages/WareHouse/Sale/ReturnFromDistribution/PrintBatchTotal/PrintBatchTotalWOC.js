import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PrintTotalData from '../PrintTotalData.json'
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import Print from "sepakuland-component-print";
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";

const PrintBatchTotalWOC = () => {

    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data
    const datasource = JSON.parse(localStorage.getItem(`printList`))
    console.log("Requested IDs", datasource)

    useEffect(() => {
        setData(PrintTotalData)
    }, [i18n.language])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    const CustomCountCell = (props) => {
        return (
            <td style={{ display: "flex" }}>
                {props.dataItem.Count.map((test, index) => {
                    return <div key={index} className='multipleUnits'>{test}</div>
                })}
            </td>
        )
    }
    const CustomFooterSumCount = (props) => {
        const [totalCount, setTotalCount] = useState(0)
        useEffect(() => {

            if (dataRef.current?.length) {

                let tempTotalCount = dataRef.current?.reduce(
                    (acc, current) => acc + current.Count?.reduce(
                        (acc2, current2) => acc2 + parseFloat(current2),
                        0
                    ),
                    0
                );
                setTotalCount(tempTotalCount)
            }

        }, [dataRef.current])

        return (
            <td colSpan={props.colSpan} className={` word-break ${props?.className ? props?.className : ''}`} style={props.style}>
                {totalCount?.toLocaleString()}
            </td>
        );
    };


    const NoneFooter = (props) => <></>

    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: 'ProductCode',
            name: "کد کالا",
            className: 'word-break',

        },
        {
            field: 'ProductName',
            name: "نام کالا",
        },
        {
            field: 'Count',
            name: "تعداد",
            cell: CustomCountCell,
            footerCell: CustomFooterSumCount
        },
        {
            field: 'Total',
            className: 'word-break',
            name: "مقدار کل",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        }
    ]

    return (
        <>
            <React.Fragment>
                <Print
                    printData={data}
                    columnList={tempColumn}
                    logo={CoddingIcon}
                    title={t("تست و دمو")}
                >

                    <div className='row betweens'>
                        <div className='col-lg-6 col-md-6 col-6'>{t("مجموع حجم")}: 0 لیتر(dm3)</div>
                        <div className='col-lg-6 col-md-6 col-6'>{t("مجموع وزن")}: 0 Kg</div>
                        <div className='col-12'>{t("پیش فاکتورها")}: 13023، 12887، 12888</div>
                        <div className='col-12'>{t("توضیحات")}: ---</div>
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
                                    <div className='up'>{t("امضا تحویل گیرنده:")}</div>
                                    <div className='down'></div>
                                </div>
                                <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                                    <div className='up'>{t("امضا انباردار:")}</div>
                                    <div className='down'></div>
                                </div>
                                <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                                    <div className='up'>{t("امضا مدیر/سرپرست فروش:")}</div>
                                    <div className='down'></div>
                                </div>
                                <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                                    <div className='up'>{t("امضا مدیر مالی:")}</div>
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
                                    <div className='up'>{t("امضا تحویل گیرنده جایگزین:")}</div>
                                    <div className='down'></div>
                                </div>
                                <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                    <div className='up'>{t("امضا انباردار:")}</div>
                                    <div className='down'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>


        </>
    )
}

export default PrintBatchTotalWOC