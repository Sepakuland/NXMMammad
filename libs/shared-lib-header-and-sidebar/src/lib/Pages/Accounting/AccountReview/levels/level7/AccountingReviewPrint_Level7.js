import React, { useRef } from 'react'
import Print from 'sepakuland-component-print'
import { useTranslation } from 'react-i18next'
import {CurrencyCell, FooterSome,TotalTitle } from "rkgrid";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const AccountingReviewPrint_Level7 = () => {
    const selectedAccountingReview7 = JSON.parse(localStorage.getItem(`selectedAccountingReview7`))
    const { t, i18n } = useTranslation();
    const dataRef = useRef()
    dataRef.current = selectedAccountingReview7;
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    let tempColumn = [
        {
            field: 'CompleteCode',
            filterable: false,
            width: '60px',
            name: "کد",
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: "AccountNameGroup",
            name: "مرور ریز گروه",
            filterable: true,
            width: '80px',
        },
        {
            field: 'CycleDebtor',
            filterable: true,
            name: "جمع بدهکار",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'CycleCreditor',
            filterable: true,
            name: "جمع بستانکار",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'RemainderDebtor',
            filterable: true,
            name: "مانده بدهکار",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'RemainderCreditor',
            filterable: true,
            name: "مانده بستانکار",
            filter: 'numeric',
            width: '90px',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
    ]
    return (
        <>
            <Print
                printData={selectedAccountingReview7}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("نمایش جزییات")}
                subTitle={t('مرور حساب')}
            >
                <div className="row betweens">
                    <div className="col-lg-6 col-md-6 col-6">{t("تاریخ")} :  </div>
                    <div className="col-lg-6 col-md-6 col-6">{t("تفضیلی")}: </div>
                    <div className="col-lg-6 col-md-6 col-6"> {t("همه اسناد")} : </div>
                    <div className="col-lg-6 col-md-6 col-6">{t("مرور ریز گروه")} : </div>
                </div>
            </Print>
        </>
    )
}

export default AccountingReviewPrint_Level7
