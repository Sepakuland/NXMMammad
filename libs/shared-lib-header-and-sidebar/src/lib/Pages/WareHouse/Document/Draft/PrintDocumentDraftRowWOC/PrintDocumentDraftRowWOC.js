import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next"
import { TotalTitle,IndexCell} from "rkgrid";
import DocumentDraftRowData from "../DocumentDraftRowData.json"
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import Print from "sepakuland-component-print";
import PrintTotalSumWOC from "./PrintTotalSumWOC";
import PrintArrayWOC from "./PrintArrayWOC";

const PrintDocumentDraftRowWOC = () => {
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data[0]




    useEffect(() => {
        let tempData = DocumentDraftRowData.map((data) => {
            return data.Value.map((moreData) => {
                return {
                    ...moreData
                }
            })
        })
        setData(tempData)

    }, [i18n.language])
    const CustomFooterSumCount = (props) => {

        const [totalCount, setTotalCount] = useState(0)

        useEffect(() => {
            if (dataRef.current?.length) {
                let tempTotalCount = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotalCount(tempTotalCount)
            }

        }, [dataRef.current])

        return (
            <td>
                {totalCount?.toLocaleString()}
            </td>
        );
    };
    const CustomFooterSumEqual = (props) => {

        const [totalEqual, setTotalEqual] = useState(0)

        useEffect(() => {
            if (dataRef.current?.length) {
                let tempTotalEqual = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotalEqual(tempTotalEqual)
            }

        }, [dataRef.current])

        return (
            <td>
                {totalEqual?.toLocaleString()}
            </td>
        );
    };

    const [sumPrintData, setSumPrintData] = useState([{
        "Code": "",
        "Name": "",
        "Count": "",
        "Equal": "",
        "Description": ""
    }])


    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: "Code",
            name: "کد کالا"
        },
        {
            field: "Name",
            name: "نام کالا"
        },
        {
            field: "Count",
            name: "تعداد",
            footerCell: CustomFooterSumCount
        },
        {
            field: "Equal",
            name: "معادل",
            footerCell: CustomFooterSumEqual
        },
        {
            field: "Description",
            name: "توضیحات"
        }
    ]

    return (
        <>

            {data?.length && <Print
                printData={data[0]}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("نمایش جزئیات")}
                subTitle={t("چاپ رسید")}
            >
                <div className="row betweens">
                    <div className="col-lg-4 col-md-6 col-6">
                        {t("شماره حواله")}:  1111
                    </div>
                    <div className="col-lg-4 col-md-6 col-6">
                        {t("تحویل‌گیرنده")} :    جهانگرد رضایی
                    </div>
                    <div className="col-lg-4 col-md-6 col-6">
                        {t("انباردار")} : حمید رضا پرویزی
                    </div>
                    <div className="col-lg-4 col-md-6 col-6">
                        {t("تاریخ حواله")} : 1401/08/07
                    </div>
                    <div className="col-lg-4 col-md-6 col-6">
                        {t("انبار تحویل‌دهنده")} : انبار اصلی
                    </div>
                    <div className="col-lg-4 col-md-6 col-6">
                        {t("تاریخ بارگیری")} : 1401/08/07
                    </div>
                    <div className="col-lg-12 col-md-12 col-12">
                        {t("راننده")} :     جهانگرد رضایی 	:489ص29 ایران 19 رضایی
                    </div>
                    <div className="col-lg-4 col-md-6 col-6">
                        {t("توضیحات")} :  ---
                    </div>
                </div>
            </Print>}
            <div style={{ padding: '0 16px' }}>
                {data?.length && data?.slice(1, data?.length).map((item, index) => {
                    let temp = 0
                    for (let i = 0; i <= index; i++) {
                        temp = temp + data[index].length
                    }
                    return <PrintArrayWOC key={index} start={temp} data={item} />
                })}
                <PrintTotalSumWOC data={sumPrintData} />
            </div>
            <div className='container Signature'>
                <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                        <div className='up'>{t("امضا تحویل‌دهنده:")}</div>
                        <div className='down'></div>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                        <div className='up'>{t("امضا تحویل‌گیرنده:")}</div>
                        <div className='down'></div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default PrintDocumentDraftRowWOC