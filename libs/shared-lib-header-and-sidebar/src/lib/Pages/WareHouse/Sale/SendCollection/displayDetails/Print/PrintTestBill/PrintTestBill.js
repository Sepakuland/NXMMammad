import { useEffect, useRef, useState } from "react";
import SaleReturnListRowData from './SaleReturnListRowData.json';

import { useTranslation } from "react-i18next";

import TestBillWithEverything from "./TestBillWithEverything";
import TestBillWithDiscount from "./TestBillWithDiscount";
import TestBillWithVAT from "./TestBillWithVAT";
import TestBillWithNothing from "./TestBillWithNothing";


const PrintTestBill = (props) => {
    const { t, i18n } = useTranslation();
    const [hasDiscount, setHasDiscount] = useState([])
    const [hasVAT, setHasVAT] = useState([])
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data
    useEffect(() => {
        let tempData = SaleReturnListRowData.map((data) => {
            return data.Value.map((moreData) => {
                let temp = (moreData.Amount).toString().replaceAll(',', '')
                let amount = parseFloat(temp, 2)
                temp = (moreData.RowDiscountValue).toString().replaceAll(',', '')
                let rowDiscountValue = parseFloat(temp, 2)
                temp = (moreData.AfterDiscount).toString().replaceAll(',', '')
                let afterDiscount = parseFloat(temp, 2)
                temp = (moreData.VAT).toString().replaceAll(',', '')
                let vat = parseFloat(temp, 2)
                temp = (moreData.FinalAmount).toString().replaceAll(',', '')
                let finalAmount = parseFloat(temp, 2)
                return {
                    ...moreData,
                    Amount: amount,
                    RowDiscountValue: rowDiscountValue,
                    AfterDiscount: afterDiscount,
                    VAT: vat,
                    FinalAmount: finalAmount
                }
            })
        })
        setData(tempData)
    }, [i18n.language])

    useEffect(() => {
        data?.length && data?.map((item, index) => {
            let temp
            setHasDiscount([...hasDiscount, false])
            setHasVAT([...hasVAT, false])
            item.forEach(element => {
                if (element.Amount !== element.AfterDiscount) {
                    temp = hasDiscount
                    temp[index] = true
                    setHasDiscount(temp)
                }
                if (element.AfterDiscount !== element.FinalAmount) {
                    temp = hasVAT
                    temp[index] = true
                    setHasVAT(temp)
                }
            });
        })

    }, [data])

    return (
        <>
            {data?.length && data?.map((item, index) => {
                if (hasDiscount[index] && hasVAT[index]) {
                    return <>
                        <TestBillWithEverything key={index} data={item} />
                        <div className="printPageNumber" style={{direction: `${i18n.dir()}`}}>{index + 1} از {data.length}</div>
                    </>
                }
                else if (hasDiscount[index] && !hasVAT[index]) {
                    return <>
                        <TestBillWithDiscount key={index} data={item} />
                        <div className="printPageNumber" style={{direction: `${i18n.dir()}`}}>{index + 1} از {data.length}</div>
                    </>

                }
                else if (!hasDiscount[index] && hasVAT[index]) {
                    return <>
                        <TestBillWithVAT key={index} data={item} />
                        <div className="printPageNumber" style={{direction: `${i18n.dir()}`}}>{index + 1} از {data.length}</div>
                    </>
                }
                else if (!hasDiscount[index] && !hasVAT[index]) {
                    return <>
                        <TestBillWithNothing key={index} data={item} />
                        <div className="printPageNumber" style={{direction: `${i18n.dir()}`}}>{index + 1} از {data.length}</div>
                    </>
                }
            })}
        </>
    )
}
export default PrintTestBill