import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg";
import Data from './Data.json'

const PrintPage = () => {
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([]);
    const dataRef = useRef();
    dataRef.current = data;

    useEffect(() => {
        let tempData = Data.map((data) => {
            let temp = (data.OrderPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                OrderInsertDate: data.OrderInsertDate !== '' ? getLangDate(i18n.language, new Date(data.OrderInsertDate)) : '',
                FinalOrderDate: data.FinalOrderDate !== '' ? getLangDate(i18n.language, new Date(data.FinalOrderDate)) : '',
                ValidateDate1: data.ValidateDate1 !== '' ? getLangDate(i18n.language, new Date(data.ValidateDate1)) : '',
                ValidateDate2: data.ValidateDate2 !== '' ? getLangDate(i18n.language, new Date(data.ValidateDate2)) : '',
                ValidateDate3: data.ValidateDate3 !== '' ? getLangDate(i18n.language, new Date(data.ValidateDate3)) : '',
                ValidateDate4: data.ValidateDate4 !== '' ? getLangDate(i18n.language, new Date(data.ValidateDate4)) : '',
                ValidateDate5: data.ValidateDate5 !== '' ? getLangDate(i18n.language, new Date(data.ValidateDate5)) : '',
                OrderPrice: cost,
                OrderCode: data.OrderCode !== '' ? parseInt(data.OrderCode) : '',
                OrderPreCode: data.OrderPreCode !== '' ? parseInt(data.OrderPreCode) : '',
                PartnerCode: data.PartnerCode !== '' ? parseInt(data.PartnerCode) : '',
                PartnerPhones: data.PartnerPhones !== '' ? parseInt(data.PartnerPhones) : '',
                PartnerNationalCode: data.PartnerNationalCode !== '' ? parseInt(data.PartnerNationalCode) : '',
                TotalCode: data.TotalCode !== '' ? parseInt(data.TotalCode) : '',
                SettlementDay: data.SettlementDay !== '' ? parseInt(data.SettlementDay) : '',
            }
        })
        setData(tempData)
    }, []);

    const CustomFooterSome = (props) => (
        <FooterSome {...props} data={dataRef.current} />
    );


    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: true,
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: "number",
            name: "شماره",
            children: [
                {
                    field: 'OrderCode',
                    name: "فاکتور",
                    filter: 'numeric',
                    className: 'word-break',
                },
                {
                    field: 'OrderPreCode',
                    name: "پیش فاکتور",
                    filter: 'numeric',
                    className: 'word-break',
                },
            ]
        },
        {
            field: "AccountParty",
            name: "طرف حساب",
            children: [
                {
                    field: 'PartnerCode',
                    name: "کد",
                    filter: 'numeric',
                    className: 'word-break',
                },
                {
                    field: 'PartnerName',
                    name: "نام",
                },
                {
                    field: 'PartnerLegalName',
                    name: "نام حقوقی",
                },
                {
                    field: 'PartnerAddress',
                    name: "آدرس",
                },
                {
                    field: 'PartnerPhones',
                    name: "تلفن",
                    filter: 'numeric',
                    className: 'word-break',
                },
                {
                    field: 'PartnerEconomicCode',
                    name: "کد اقتصادی",
                    className: 'word-break',
                    filter: 'numeric',
                },
                {
                    field: 'PartnerNationalCode',
                    name: "کد/شناسه ملی",
                    filter: 'numeric',
                    className: 'word-break',
                },
                {
                    field: 'PartnerZuneAndPath',
                    name: "منطقه/مسیر",
                    className: 'text-center',
                },
            ]
        },
        {
            field: "salesPerson",
            name: "فروشنده",
            children: [
                {
                    field: 'PersonnelCode',
                    name: "کد",
                    filter: 'numeric',
                    className: 'word-break',
                },
                {
                    field: 'PersonnelName',
                    name: "نام",
                    className: 'text-center',
                },

            ]



        },
        {
            field: 'OrderInsertDate',
            name: "تاریخ سفارش",
            // format: "{0:d}",
            filter: 'date',
            className: 'word-break',
        },
        {
            field: 'OrderInsertDateTime',
            name: "ساعت",
            className: 'word-break',
        },
        {
            field: 'FinalOrderDate',
            name: "تاریخ فاکتور",
            // format: "{0:d}",
            filter: 'date',
            className: 'word-break',
        },
        {
            field: "State",
            name: "وضعیت",
            className: 'text-center',
        },
        {
            field: "LastValidDate",
            name: "زمان تایید",
            className: 'word-break',
        },
        {
            field: 'TotalCode',
            name: "سرجمع",
            filter: 'numeric',
            className: 'word-break',
        },
        {
            field: 'InsertUserName',
            name: "درج کننده",
            className: 'text-center',
        },
        {
            field: 'ConfirmUser',
            className: 'text-center',
            name: "تایید کننده",
        },
        {
            field: 'OrderPrice',
            name: "مبلغ",
            filter: 'numeric',
            className: 'word-break',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
            reorderable: true
        },
        {
            field: 'SettlementType',
            name: "نحوه تسویه",
            // width: '70px',
            className: 'text-center',
        },
        {
            field: 'SettlementDay',
            name: "مهلت تسویه (روز)",
            filter: 'numeric',
            className: 'word-break',
        },
        {
            field: 'Description',
            name: "توضیحات",
            className: 'text-center',
        },
        {
            field: 'CalculationMethod',
            name: "نحوه محاسبه",
            children: [
                {
                    field: 'WarehouseName',
                    name: "انبار",
                    className: 'text-center',
                },
                {
                    field: 'PriceCalculation',
                    name: "قیمت ها",
                    className: 'text-center',
                },
                {
                    field: 'DiscountCalculation',
                    name: "تخفیفات",
                    className: 'text-center',
                },
            ]
        },
        {
            field: 'VATCalculation',
            name: "مالیات",
            className: 'text-center',
        },
    ]
    return (
        <Print
            printData={data}
            columnList={tempColumn}
            logo={CoddingIcon}
            title={t("نمایش جزییات")}
            subTitle={t("پیش فاکتور فروش")}
        />
    );
};
export default PrintPage;
