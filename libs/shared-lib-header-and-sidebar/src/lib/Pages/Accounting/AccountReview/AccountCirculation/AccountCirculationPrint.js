import React, { useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome,IndexCell, CurrencyCell, TotalTitle,DateCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg"


const AccountCirculationPrint = () => {
    const { t, i18n } = useTranslation();
    const excelData = JSON.parse(localStorage.getItem(`excelData`))
    const dataRef = useRef();
    dataRef.current = excelData;
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    let tempColumn = [
        {
            field: 'IndexCell',
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            // footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: 'DocumentCode',
            name: "شماره سند",
            filter: 'numeric',
            width: '60px',
        },
        {
            field: 'DocumentDate',
            name: "تاریخ",
            width: '60px',
            filter: 'numeric',
            cell: DateCell,
        },
        {
            field: 'DocumentType',
            name: "نوع سند",
            width: "70px",
            filter: 'numeric',
        },
        {
            field: 'DocumentState',
            name: "وضعیت",
            filter: 'numeric',
            width: "70px",
        },
        {
            field: 'ArticleIndexCell',
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: 'ArticleDescription',

            width: '170px',
            name: "شرح",
        },
        {
            field: 'Debtor',
            name: "بدهکار",
            filter: 'numeric',
            width: '100px',
            footerCell: CustomFooterSome,
            cell: CurrencyCell,

        },
        {
            field: 'Creditor',
            name: "بستانکار",
            filter: 'numeric',
            width: '100px',
            footerCell: CustomFooterSome,
            cell: CurrencyCell,


        },
        {
            field: 'Remainder',
            name: "مانده",
            filter: 'numeric',
            width: '100px',
            footerCell: CustomFooterSome,
            cell: CurrencyCell,

        },
        {
            field: 'RemainderType',
            name: "تشخیص",
            filter: 'numeric',
            width: '100px',
        },
    ]
    return (
        <>
            <Print
                printData={excelData}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("نمایش جزییات")}
                subTitle={t('گردش حساب')}
            >
                <div className="row betweens">
                    <div className="col-lg-6 col-md-6 col-6">{t("تاریخ")} :  </div>
                    <div className="col-lg-6 col-md-6 col-6">{t("تفضیلی")} : </div>
                    <div className="col-lg-6 col-md-6 col-6"> {t("همه اسناد")} : </div>
                    <div className="col-lg-6 col-md-6 col-6">{t("مرور گروه")} : </div>
                </div>
            </Print>
        </>
    )
}
export default AccountCirculationPrint









