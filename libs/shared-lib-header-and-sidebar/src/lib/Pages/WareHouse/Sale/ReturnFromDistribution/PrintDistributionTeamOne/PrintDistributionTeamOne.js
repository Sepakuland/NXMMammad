import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import PrintDistributionTeamOneData from './PrintDistributionTeamOneData.json';
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintDistributionTeamOne = (props) => {

    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data 

    useEffect(() => {
        let tempData = PrintDistributionTeamOneData.map((data) => {
            let temp = (data.Amount).toString().replaceAll(',', '')
            let amount = parseFloat(temp, 2)
            temp = (data.DiscountDeduction).toString().replaceAll(',', '')
            let discountDeduction = parseFloat(temp, 2)
            return {
                ...data,
                Amount: amount,
                DiscountDeduction: discountDeduction.toLocaleString() + "\n" + "(" + t("پس از کسر") + " " + data.DiscountDeductionPercent + "%" + ")",
            }
        })
        setData(tempData)
    }, [i18n.language])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    const CustomFooterSumDiscount = (props) => {

        let tempData=dataRef.current.map((item)=>{
            let temp = (item.DiscountDeduction).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return cost
        })

        const [totalDiscount ,setTotalDiscount]=useState(0)

        useEffect(()=>{

            if(data?.length){

                let tempTotalDiscount = tempData?.reduce(
                    (acc, current) => acc + parseFloat(current),
                    0
                );
                setTotalDiscount(tempTotalDiscount)
            }

        },[dataRef.current])

        return (
            <td colSpan={props.colSpan} className={` word-break ${props?.className?props?.className:''}`} style={props.style}>
                {totalDiscount?.toLocaleString()}
            </td>
        );
    };

    const customHeader = (props) => (

        <div className='d-flex justify-content-center'>
            <span className='box-char'>{t('ن')}</span>
            <span className='box-char'>{t('چ')}</span>
            <span className='box-char'>{t('م')}</span>
            <span className='box-char'>{t('ک')}</span>
        </div>

    )
    const customBoxCell = (props) => (
        <td>
            <div className='d-flex justify-content-center'>
                <span className='box-char'></span>
                <span className='box-char'></span>
                <span className='box-char'></span>
                <span className='box-char'></span>
            </div>
        </td>
    )




    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: 'PreInvoice',
            name: "پیش فاکتور",
            className: 'word-break',

        },
        {
            name: 'طرف حساب',
            field: 'AccountParty',
            children: [
                {
                    field: 'Code',
                    filterable: false,
                    name: "کد",
                    className: 'word-break',
                },
                {
                    field: 'Name',
                    name: "نام",
                },
                {
                    field: 'AreaRoute',
                    name: "منطقه/مسیر",
                },
                {
                    field: 'Address',
                    name: "آدرس",
                },
                {
                    field: 'Phone',
                    filterable: false,
                    name: "تلفن",
                    className: 'word-break',
                },
            ]
        },
        {
            field: 'Amount',
            name: "مبلغ",
            className: 'word-break',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'DiscountDeduction',
            className: 'word-break',
            name: "با کسر تخفیف تسویه نقد",
            cell: CurrencyCell,
            footerCell: CustomFooterSumDiscount,
        },
        {
            field: 'Visitor',
            name: "ویزیتور",
        },
        {
            field: 'Settle',
            name: "نحوه تسویه",
        },
        {
            field: 'NoIdea',
            headerCell: customHeader,
            cell: customBoxCell,
            width: '120px'
        },
        {
            field: 'Description',
            width: '140px',
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
                subTitle={t("تیم پخش سرجمع شماره") + '872'}
            >

                <div className='row betweens'>
                    <div className='col-lg-4 col-md-4 col-4'>{t("تاریخ سرجمع")}: 1401/04/21</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("تاریخ ارسال")}: 1401/04/21</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("انبار")}: {t("انبار اصلی")}</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("انباردار")}: سجاد موسوی</div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("موزع")}: مدیر سیستم </div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("راننده")}: مدیر سیستم </div>
                    <div className='col-lg-4 col-md-4 col-4'>{t("خودرو")}: ایسوزو(شماره: 424ع18 ایران 29 مسی رنگ پرویزی)</div>
                    <div className='col-lg-6 col-md-6 col-6'>{t("توضیحات")}: </div>
                </div>
            </Print>

        </>)
}
export default PrintDistributionTeamOne