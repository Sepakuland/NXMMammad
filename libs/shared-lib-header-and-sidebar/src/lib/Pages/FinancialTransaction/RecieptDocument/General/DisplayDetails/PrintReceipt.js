import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import Print from "sepakuland-component-print";
import { FooterSome,IndexCell, CurrencyCell, TotalTitle,DateCell } from "rkgrid";
import printReceiptData from "./printReceiptData.json";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintReceipt = () => {

    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    useEffect(() => {
        let tempData = printReceiptData.map((data) => {

            let temp = data.ChequePrice.toString().replaceAll(",", "");
            let chequePrice = temp !== '' ? parseFloat(temp, 2) : 0

            temp = data.CashPrice.toString().replaceAll(",", "");
            let cashPrice = temp !== '' ? parseFloat(temp, 2) : 0

            temp = data.BankPrice.toString().replaceAll(",", "");
            let bankPrice = temp !== '' ? parseFloat(temp, 2) : 0

            temp = data.TotalPrice.toString().replaceAll(",", "");
            let totalPrice = temp !== '' ? parseFloat(temp, 2) : 0

            return {
                ...data,
                DocumentCode: data.DocumentCode !== '' ? parseInt(data.DocumentCode) : '',
                DocumentDate: new Date(data.DocumentDate),
                PartnerCode: data.PartnerCode !== '' ? parseInt(data.PartnerCode) : '',
                TotalPrice: totalPrice,
                CashPrice: cashPrice,
                BankBillCode: data.BankBillCode !== '' ? parseInt(data.BankBillCode) : '',
                BankPrice: bankPrice,
                BankBillCode: data.BankBillCode !== '' ? parseInt(data.BankBillCode) : '',
                ChequeSerial: data.ChequeSerial !== '' ? parseInt(data.ChequeSerial) : '',
                ChequeMaturityDate: new Date(data.ChequeMaturityDate),
                ChequePrice: chequePrice,
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
            field: 'DocumentCode',
            name: "شماره",
        },
        {
            field: 'DocumentDate',
            // format: "{0:d}",
            name: "تاریخ",
            cell: DateCell,
        },
        {
            field: 'PartnerCode',
            name: "کد طرف حساب",
        },
        {
            field: 'PartnerName',
            name: "نام طرف حساب",
        },
        {
            field: 'TotalPrice',
            name: "مبلغ",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            name: "نقد",
            field: "cash",
            children: [
                {
                    field: 'CashCashAccount',
                    name: "صندوق",
                },
                {
                    field: 'CashPrice',
                    name: "مبلغ",
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome,
                }
            ]
        },
        {
            name: "بانک",
            field: "bank",
            children: [
                {
                    field: 'BankAccount',
                    name: "حساب",
                },
                {
                    field: 'BankBillCode',
                    name: "شماره فیش",
                },
                {
                    field: 'BankPrice',
                    name: "مبلغ",
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome,
                }
            ]
        },
        {
            name: "چک",
            field: "cheque",
            children: [
                {
                    field: 'ChequeCashAccount',
                    name: "صندوق",
                },
                {
                    field: 'ChequeCashier',
                    name: "صندوقدار",
                },
                {
                    field: 'ChequeSerial',
                    name: "سریال",
                },
                {
                    field: 'ChequeMaturityDate',
                    // format: "{0:d}",
                    name: "سررسید",
                    cell: DateCell,
                },
                {
                    field: 'ChequePrice',
                    name: "مبلغ",
                    cell: CurrencyCell,
                    footerCell: CustomFooterSome,
                }
            ]
        },
        {
            field: 'DocumentDescription',
            filterable: true,
            name: "توضیحات"
        }
    ]

    return (
        <>
            <Print
                printData={data}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("نمایش جزئیات")}
                subTitle={t("پرداخت کلی")}
            >
            </Print>

        </>
    )
}

export default PrintReceipt