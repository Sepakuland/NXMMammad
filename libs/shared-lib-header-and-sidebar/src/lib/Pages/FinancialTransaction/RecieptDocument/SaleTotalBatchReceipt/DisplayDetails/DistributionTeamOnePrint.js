import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import DistributionTeamOnePrintData from '../../SaleTotalBatchReceipt/DisplayDetails/DistributionTeamOnePrintData.json';
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const DistributionTeamOnePrint = (props) => {

    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    console.log(" props.dataItem.DocumentCode", props.dataItem)
    useEffect(() => {
        let tempData = DistributionTeamOnePrintData.map((data) => {
            let temp = (data.Amount).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                Amount: cost,
                Invoice: parseInt(data.Invoice),
                Code: parseInt(data.Code),
                Phone: parseInt(data.Phone),

            }
        })
        setData(tempData)
    }, [i18n.language])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    const CustomFooterSome2 = (props) => {

        const [total,setTotal]=useState(0)


        
    
        useEffect(()=>{
            
            if(data?.length){
                let data=dataRef.current.map((item)=>{
                    let temp = (item.DiscountDeduction).toString().replaceAll(',', '')
                    let cost = parseFloat(temp, 2)
        
                    return cost
        
        
                })
        
                let tempTotal =data?.reduce(
                    (acc, current) => acc + parseFloat(current),
                    0
                );
                setTotal(tempTotal)
            }
    
        },[dataRef.current])
    
        return (
            <td colSpan={props.colSpan} className={` word-break ${props?.className?props?.className:''}`} style={props.style}>
                {total?.toLocaleString()}
            </td>
        );
    };

    const customHeader= (props) => (
    
        <div className='d-flex justify-content-center'>
            <span className='box-char'>{t('ن')}</span>
            <span className='box-char'>{t('چ')}</span>
            <span className='box-char'>{t('م')}</span>
            <span className='box-char'>{t('ک')}</span>
        </div>
    
    )
    const customBoxCell= (props) => (
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
            field: 'Invoice',
            name: "پیش فاکتور",
            className:'word-break',

        },
        {
            name: 'طرف حساب',
            field: 'AccountParty',
            // orderIndex:2,
            children: [
                {
                    field: 'Code',
                    filterable: false,
                    name: "کد",
                    className:'word-break',
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
                    className:'word-break',
                },
            ]
        },
        {
            field: 'Amount',
            name: "مبلغ",
            className:'word-break',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'DiscountDeduction',
            className:'word-break',
            name: "با کسر تخفیف تسویه نقد",
            footerCell: CustomFooterSome2,
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
            headerCell:customHeader,
            cell:customBoxCell,
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
export default DistributionTeamOnePrint