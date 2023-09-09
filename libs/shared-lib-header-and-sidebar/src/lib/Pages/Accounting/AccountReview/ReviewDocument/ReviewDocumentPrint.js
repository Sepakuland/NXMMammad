import React, { useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg"


const ReviewDocumentPrint = () => {
    const { t, i18n } = useTranslation();
    const excelDataReviewDocument = JSON.parse(localStorage.getItem(`excelDataReviewDocument`))
    const dataRef = useRef();
    dataRef.current = excelDataReviewDocument;
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,

            reorderable: false
        },
        {
            field: 'test1',
            name: "کد حساب",
            children: [
                {
                    field: 'AccountCodeEntity4',
                    filterable: false,
                    name: "تفضیلی 4",
                    filter: 'numeric',
                    width: '40px',
                },
                {
                    field: 'AccountCodeEntity5',
                    filterable: false,
                    name: "تفضیلی 5",
                    filter: 'numeric',
                    width: '40px',
                },
                {
                    field: 'AccountCodeEntity6',
                    filterable: false,
                    name: "تفضیلی 6",
                    filter: 'numeric',
                    width: '50px',
                },
                {
                    field: 'AccountCodeSpecific',
                    filterable: false,
                    name: "معین",
                    width: '50px',
                    filter: 'numeric',
                },
                {
                    field: 'AccountCodeTotal',
                    filterable: false,
                    name: "کل",
                    width: '50px',
                    filter: 'numeric',
                },
                {
                    field: 'AccountCodeGroup',
                    filterable: false,
                    name: "گروه",
                    width: '50px',
                    filter: 'numeric',
                }
            ]

        },
        {
            field: 'test2',
            name: "عنوان حساب",
            children: [
                {
                    field: 'AccountNameGroup',
                    filterable: false,
                    name: "گروه",
                    filter: 'numeric',
                    width: '50px',
                },
                {
                    field: 'AccountNameTotal',
                    filterable: false,
                    name: "کل",
                    filter: 'numeric',
                    width: '50px',
                },
                {
                    field: 'AccountNameSpecific',
                    filterable: false,
                    name: "معین",
                    filter: 'numeric',
                    width: '50px',
                },
                {
                    field: 'AccountNameEntity4',
                    filterable: false,
                    name: "تفضیلی 4",
                    filter: 'numeric',
                    width: '50px',
                },
                {
                    field: 'AccountNameEntity5',
                    filterable: false,
                    name: "تفضیلی 5",
                    filter: 'numeric',
                    width: '50px',
                },
                {
                    field: 'AccountNameEntity6',
                    filterable: false,
                    name: "تفضیلی 6",
                    filter: 'numeric',
                    width: '50px',
                },

            ]

        },


        {
            field: 'Debtor',
            filterable: false,
            name: "بدهکار",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,

        },
        {
            field: 'Creditor',
            filterable: false,
            name: "بستانکار",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,

        },

        {
            field: 'ArticleDescription',
            filterable: false,
            name: "شرح آرتیکل",
            width: '90px',
        },

    ]
    return (
        <>
            <Print
                printData={excelDataReviewDocument}
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
export default ReviewDocumentPrint









