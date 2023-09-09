import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { useTranslation } from "react-i18next";
import UnofficialInvoiceData from './UnofficialInvoiceData.json'
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import {CurrencyCell,IndexCell } from "rkgrid";


const UnofficialRejectedInvoicePrint = () => {

    const { t, i18n } = useTranslation();
    const lang = i18n.language
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    useEffect(() => {
        let tempData = UnofficialInvoiceData.map((data) => {
            let temp = (data.Price).toString().replaceAll(',', '')
            let temp2 = (data.FinalPrice).toString().replaceAll(',', '')
            let temp3 = (data.Fee).toString().replaceAll(',', '')

            let temp6 = (data.Tax).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            let cost2 = parseFloat(temp2, 2)
            let cost3 = parseFloat(temp3, 2)
            let cost6 = parseFloat(temp6, 2)
            return {
                ...data,
                Price: cost,
                FinalPrice: cost2,
                Fee: cost3,
                Tax: cost6,
                ProductCode: data.ProductCode !== '' ? parseInt(data.ProductCode) : '',
            }
        })
        setData(tempData)
    }, [i18n.language])



    const CustomFooterSome1 = (props) => {

        const [total, setTotal] = useState(0)

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

        const [total, setTotal] = useState(0)

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
    const CustomFooterSome3 = (props) => {

        const [total, setTotal] = useState(0)

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

        const [total, setTotal] = useState(0)

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

        const [total, setTotal] = useState(0)

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
        return (
            <td className={`td-p0 ${lang == 'en' ? 'border-right-0' : 'border-left-0'}`} style={{ height: '72px' }}>
                <div className={`empty-footer-border ${lang == 'en' ? 'border-right-1' : 'border-left-1'}`}>
                    {t('جمع')}
                </div>
                <div className={'empty-footer border-left-0'}> </div>
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
            name: "کد",
            footerCell: NoFooter

        },
        {
            field: 'ProductName',
            //columnMenu ColumnMenu,
            name: "نام کالا	",
            footerCell: NoFooter
        },
        {
            field: 'Count',
            //columnMenu ColumnMenu,
            name: "تعداد",
            footerCell: CustomFooterSome1
        },
        {
            field: "Fee",
            //columnMenu ColumnMenu,
            name: 'فی',
            cell: CurrencyCell,
            footerCell: NoFooter
        },
        {
            field: 'Price',
            //columnMenu ColumnMenu,
            name: "مبلغ",
            cell: CurrencyCell,
            footerCell: CustomFooterSome1
        },
        {
            field: 'Tax',
            //columnMenu ColumnMenu,
            name: "مالیات ا.ا. (9%)",
            cell: CurrencyCell,
            footerCell: CustomFooterSome3,
        },
        {
            field: 'FinalPrice',
            //columnMenu ColumnMenu,
            name: "مبلغ نهایی",
            className: 'text-center',
            filter: 'numeric',
            cell: CurrencyCell,
            footerCell: CustomFooterSome4,
        },


    ]
    return (

        <Print
            printData={data}
            columnList={tempColumn}
            logo={CoddingIcon}
            title={t("نمایش جزییات")}
            subTitle={t("صورتحساب فروش")}
        />
    )
}
export default UnofficialRejectedInvoicePrint









