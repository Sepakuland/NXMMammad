import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateCell, IndexCell } from "rkgrid";
import { SaleReturnDistData } from "./SaleReturnDistData";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg";
import Print from "sepakuland-component-print";



const PrintSaleReturnDist = () => {
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    useEffect(() => {
        let tempData = SaleReturnDistData.map((data) => {
            return {
                ...data,
                TotalId: data.Value.TotalId,
                TotalCode: data.Value.TotalCode !== '' ? parseInt(data.Value.TotalCode) : '',
                TotalDate: new Date(data.Value.TotalDate),
                TotalDescription: data.Value.TotalDescription,
                PayeeCode: data.Value.PayeeCode !== '' ? parseInt(data.Value.PayeeCode) : '',
                PayeeName: data.Value.PayeeName,
                DriverCode: data.Value.DriverCode !== '' ? parseInt(data.Value.DriverCode) : '',
                DriverName: data.Value.DriverName,
                Status: data.Value.Status
            }
        })
        setData(tempData)
    }, [i18n.language])

    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
        },
        {
            field: 'TotalCode',
            name: "سرجمع"
        },
        {
            field: 'TotalDate',
            // format: "{0:d}",
            name: "تاریخ",
            cell: DateCell,
        },
        {
            field: 'TotalDescription',
            name: "توضیحات"
        },
        {
            field: 'PayeeCode',
            name: "کد موزع"
        },
        {
            field: 'PayeeName',
            name: "نام موزع"
        },
        {
            field: 'DriverCode',
            name: "کد راننده"
        },
        {
            field: 'DriverName',
            name: "نام راننده"
        },
        {
            field: 'Status',
            name: "وضعیت"
        }
    ]

    return (
        <>
            <Print
                printData={data}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("نمایش جزئیات")}
                subTitle={t("بازگشت از توزیع")}
            >
            </Print>
        </>
    )
}
export default PrintSaleReturnDist