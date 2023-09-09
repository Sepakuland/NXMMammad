import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import DisplayDitailsData from '../DisplayDitailsData.json'
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";


const PrintPage = () => {

    const { t, i18n } = useTranslation();
    const lang = i18n.language
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    useEffect(() => {
        let tempData = DisplayDitailsData.map((data) => {
            let temp = (data.OrderPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                OrderInsertDate: new Date(data.OrderInsertDate),
                OrderPrice: cost,
                OrderPreCode: data.OrderPreCode !== '' ? parseInt(data.OrderPreCode) : '',
                PartnerCode: data.PartnerCode !== '' ? parseInt(data.PartnerCode) : '',
                VolumeSum: data.VolumeSum !== '' ? parseInt(data.VolumeSum) : '',
                WeightSum: data.WeightSum !== '' ? parseInt(data.WeightSum) : '',
            }
        })
        setData(tempData)
    }, [i18n.language])


    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    let tempColumn = [
        {
            field: 'IndexCell',
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: 'OrderPreCode',
            //columnMenu ColumnMenu,
            name: "شماره پیش فاکتور",

        },
        {
            field: 'PartnerCode',
            //columnMenu ColumnMenu,
            name: "کد طرف حساب",
        },
        {
            field: 'PartnerName',
            //columnMenu ColumnMenu,
            name: "نام طرف حساب",
        },
        {
            field: "PartnerZuneAndPath",
            //columnMenu ColumnMenu,
            name: 'منطقه و مسیر',
        },
        {
            field: 'PartnerDistributionPath',
            //columnMenu ColumnMenu,
            name: "مسیر توزیع",
        },
        {
            field: 'PartnerAddress',
            //columnMenu ColumnMenu,
            name: "آدرس",
        },
        {
            field: 'OrderPrice',
            //columnMenu ColumnMenu,
            name: "مبلغ",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'SettlementType',
            //columnMenu ColumnMenu,
            name: "نحوه تسویه",
            width: '70px',
        },
        {
            field: 'PersonnelName',
            //columnMenu ColumnMenu,
            name: "ویزیتور",
            className: 'text-center',
        },
        {
            field: 'OrderInsertDate',
            //columnMenu DateMenu,
            name: "تاریخ فاکتور",
            // format: "{0:d}",
            filter: 'date',
        },
        {
            field: 'Description',
            //columnMenu ColumnMenu,
            name: "توضیحات",
        },
        {
            field: 'VolumeSum',
            //columnMenu ColumnMenu,
            name: "حجم (لیتر)",
            width: '50px',
            className: 'text-center',
            footerCell: CustomFooterSome,
        },
        {
            field: 'WeightSum',
            //columnMenu ColumnMenu,
            name: "وزن (Kg)",
            width: '50px',
            className: 'text-center',
            footerCell: CustomFooterSome,
        },

    ]
    return (

        <Print
            printData={data}
            columnList={tempColumn}
            logo={CoddingIcon}
            title={t("نمایش جزییات")}
            subTitle={t("پیش فاکتورهای تایید شده")}

        />
    )
}
export default PrintPage









