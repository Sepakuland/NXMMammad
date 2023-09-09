import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import dataForGrid from './DataForGrid.json'
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg";


const PrintUnsentTotal = () => {

    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const lang = searchParams.get('lang')
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    useEffect(() => {
        let tempData = dataForGrid.map((data) => {
            let temp = (data.TotalPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                TotalPrice: cost,
                TotalCode: data.TotalCode !== '' ? parseInt(data.TotalCode) : '',
                OrdersCount: data.OrdersCount !== '' ? parseInt(data.OrdersCount) : '',
                MachineVolumeCapacity: data.MachineVolumeCapacity !== '' ? parseInt(data.MachineVolumeCapacity) : '',
                VolumeSum: data.VolumeSum !== '' ? parseInt(data.VolumeSum) : '',
                VolumeSumPercent: data.VolumeSumPercent !== '' ? parseInt(data.VolumeSumPercent) : '',
                MachineWeightCapacity: data.MachineWeightCapacity !== '' ? parseInt(data.MachineWeightCapacity) : '',
                WeightSum: data.WeightSum !== '' ? parseInt(data.WeightSum) : '',
                WeightSumPercent: data.WeightSumPercent !== '' ? parseInt(data.WeightSumPercent) : '',

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
            field: 'TotalCode',
            // columnMenu: ColumnMenu,
            name: "شماره سرجمع",
            className: 'text-center',
        },
        {
            field: 'PayeeName',
            className: 'text-center',
            name: "موزع",
        },
        {
            field: 'DriverName',
            className: 'text-center',
            name: "راننده",
        },
        {
            field: 'Machine',
            width: "180px",
            name: "خودرو",
            className: 'text-center',
        },
        {
            field: 'OrdersCount',
            name: "تعداد پیش فاکتور",
            footerCell: CustomFooterSome,
            className: 'text-center',
        },
        {
            field: 'TotalPrice',
            name: "جمع مبلغ",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
            className: 'text-center',
        },
        {
            field: 'MachineVolumeCapacity',
            name: "ظرفیت حجمی(dm3/لیتر)",
            footerCell: CustomFooterSome,
            className: 'text-center',
        },
        {
            field: 'VolumeSum',
            name: "مجموع حجم(dm3/لیتر)",
            footerCell: CustomFooterSome,
            className: 'text-center',
        },
        {
            field: 'VolumeSumPercent',
            name: "درصد حجم اشغال شده",
            footerCell: CustomFooterSome,
            className: 'text-center',
        },
        {
            field: 'MachineWeightCapacity',
            name: "ظرفیت وزنی(Kg)",
            footerCell: CustomFooterSome,
            className: 'text-center',
        },
        {
            field: 'WeightSum',
            name: "مجموع وزن(Kg)",
            footerCell: CustomFooterSome,
            className: 'text-center',
        },
        {
            field: 'WeightSumPercent',
            name: "درصد وزن اشغال شده",
            className: 'text-center',
        },
    ]

    return (

        <Print
            printData={data}
            columnList={tempColumn}
            logo={CoddingIcon}
            title={t("نمایش جزییات")}
            subTitle={t("ویرایش سرجمع های ارسال نشده")}

        />
    )
}
export default PrintUnsentTotal









