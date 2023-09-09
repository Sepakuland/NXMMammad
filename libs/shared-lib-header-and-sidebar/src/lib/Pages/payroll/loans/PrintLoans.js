import React, { useEffect, useState, useRef } from 'react';
import Print from 'sepakuland-component-print';
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import CashData from './salaryData.json'
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";

const PrintLoansBillsIssuance = () => {

    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data


    useEffect(() => {
        let tempData = CashData.map((data) => {
            let temp = (data.LoanAmount).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            let temp2 = (data.Installment_Amount).toString().replaceAll(',', '')
            let cost2 = parseFloat(temp2, 2)

            return {
                ...data,
                LoanAmount: cost,
                Installment_Amount: cost2,
                Installment_Count: parseInt(data.Installment_Count),
                PersonnelCode: parseInt(data.PersonnelCode),
                Installment_CountInstalled: parseInt(data.Installment_CountInstalled),
                Installment_CountRemained: parseInt(data.Installment_CountRemained),
                ReceiptDate: getLangDate(i18n.language, new Date(data.ReceiptDate)),
            }
        })
        setData(tempData)
    }, [i18n == lang])


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
            field: 'LoanTitle',
            name: "عنوان",
        },
        {
            field: 'PersonnelCode',
            name: "کد پرسنل",
        },
        {
            field: 'PersonnelName',
            name: "نام پرسنل",
        },
        {
            field: 'ReceiptDate',
            name: "تاریخ دریافت",
            className: 'break-line',
            // format: "{0:d}",
        },
        {
            field: 'LoanAmount',
            name: "مبلغ وام",
            filter: 'numeric',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            name: 'بازپرداخت',
            field: 'Refund',
            children: [
                {
                    field: 'Installment_Amount',
                    name: "مبلغ قسط",
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome,
                },
                {
                    field: 'Installment_Count',
                    name: "تعداد قسط",
                },
                {
                    field: 'Installment_CountInstalled',
                    name: "تسویه شده",
                },
                {
                    field: 'Installment_CountRemained',
                    name: "باقی مانده",
                },
                {
                    field: "Installment_Start",
                    name: "شروع",
                    className: "text-center word-break",
                },
                {
                    field: "Installment_End",
                    name: "پایان",
                    className: "text-center word-break",
                },
            ]
        },

    ]

    return (

        <Print
            printData={data}
            columnList={tempColumn}
            logo={CoddingIcon}
            title={t("نمایش جزییات")}
            subTitle={t("وام‌ها")}

        />
    )
}
export default PrintLoansBillsIssuance









