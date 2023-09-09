import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { CurrencyCell, IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import TestPrintData from '../../SaleTotalBatchReceipt/DisplayDetails/TestPrintData.json';
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const TestPrint = (props) => {

    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    useEffect(() => {
        let tempData = TestPrintData.map((data) => {
            let temp = (data.Price).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            let temp2 = (data.Amount).toString().replaceAll(',', '')
            let cost2 = parseFloat(temp2, 2)
            let temp3 = (data.Tax).toString().replaceAll(',', '')
            let cost3 = parseFloat(temp3, 2)
            let temp4 = (data.FinalAmount).toString().replaceAll(',', '')
            let cost4 = parseFloat(temp4, 2)
            return {
                ...data,
                Price: cost,
                Amount: cost2,
                Tax: cost3,
                FinalAmount: cost4,
                Code: parseInt(data.Code),

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
            <td  className={'td-p0 border-left-0'} style={{height:'72px'}}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className?props?.className:''}`} style={props.style}>
                        {total?.toLocaleString()}
                    </div>
                    <div className={'empty-footer border-left-0'}></div>
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
            <td  className={'td-p0 border-left-0'} style={{height:'72px'}}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className?props?.className:''}`} style={props.style}>
                        {total?.toLocaleString()}
                    </div>
                    <div className={'empty-footer justify-content-end'}>{t('مبلغ نهایی :')}</div>
                </div>
            </td>


        );
    };
    const CustomFooterSome4 = (props) => {

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
                    <div className={'empty-footer border-left-0 word-break'}>{total?.toLocaleString()}</div>
                </div>
            </td>


        );
    };
    const NoFooter = (props) =><td className={'td-p0 border-left-0'} style={{height:'72px'}}>
        <div>
            <div className='empty-footer-border'></div>
            <div className='empty-footer border-left-0'></div>
        </div>
    </td>

    const CustomTotalTitle = (props) => {
        return (
            <td className={`td-p0 ${lang=='en'?'border-right-0':'border-left-0'}`} style={{height:'72px'}}>
                <div className={`empty-footer-border ${lang=='en'?'border-right-1':'border-left-1'}`}>
                    {t('جمع')}
                </div>
                <div className={'empty-footer border-left-0'}> </div>
            </td>

        );
    };



    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name:" ",
            cell: IndexCell,
            footerCell: CustomTotalTitle,
            
        },
        {
            field: 'Code',
            name: "کد",
            className:'word-break',
            footerCell:NoFooter

        },
        {
            field: 'ProductName',
            name: "نام کالا",
            footerCell:NoFooter,
            // width: '60px',
        },
        {
            field: 'Number',
            name: "تعداد",
            className:'word-break',
            footerCell: CustomFooterSome1,
            cell: CurrencyCell,

        },
        {
            field: 'Price',
            className:'word-break',
            name: "فی",
            footerCell:(props) =><td className={'td-p0 border-left-0'} style={{height:'72px'}}>
                <div>
                    <div className='empty-footer-border'></div>
                    <div className='empty-footer'></div>
                </div>
            </td>,
            cell: CurrencyCell,
        },
        {
            field: 'Amount',
            className:'word-break',
            name: "مبلغ",
            cell: CurrencyCell,
            footerCell: CustomFooterSome2,
        },
        {
            field: 'Tax',
            className:'word-break',
            name: "مالیات ا.ا. (9%)",
            cell: CurrencyCell,
            footerCell: CustomFooterSome3,
        },
        {
            field: 'FinalAmount',
            className:'word-break',
            name: "مبلغ نهایی",
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
                title={t("صورتحساب فروش")}
            >
            </Print>
            <div className='p-3 print-page' style={{direction:i18n.dir()}}>
                <div className='row justify-content-center'>
                    <div className='col-lg-11 col-md-12 col-sm-12 col-12'>
                        <div className='reason-box'>
                            {t('دلیل برگشت از توزیع:')}
                             معیوب بودن اجناس
                        </div>
                    </div>
                </div>
            </div>

        </>)
}
export default TestPrint