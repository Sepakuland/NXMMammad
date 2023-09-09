import { useEffect, useLayoutEffect, useRef, useState } from "react";
import SaleReturnValidateRowData from './SaleReturnValidateRowData.json';
import { useTranslation } from "react-i18next";
import TestBillWithEverything from "./TestBillWithEverything";
import TestBillWithDiscount from "./TestBillWithDiscount";
import TestBillWithVAT from "./TestBillWithVAT";
import TestBillWithNothing from "./TestBillWithNothing";

const PrintUnofficialInvoice = (props) => {
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data
    useEffect(() => {
        let tempData = SaleReturnValidateRowData.map((data) => {
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

    // useLayoutEffect(() => {
    //     data?.length && data?.map((item, index) => {
    //         let temp
    //         setHasDiscount([...hasDiscount, false])
    //         setHasVAT([...hasVAT, false])
    //         item.forEach(element => {
    //             if (element.Amount !== element.AfterDiscount) {
    //                 temp = hasDiscount
    //                 temp[index] = true
    //                 setHasDiscount(temp)
    //             }
    //             if (element.AfterDiscount !== element.FinalAmount) {
    //                 temp = hasVAT
    //                 temp[index] = true
    //                 setHasVAT(temp)
    //             }
    //         });
    //     })

    // }, [data])

    console.log("data", data)
    // console.log("hasDiscount", hasDiscount)

    return (
        <>
            {data?.length && data?.map((item, index) => {
                let hasVAT = false
                let hasDiscount = false
                item.forEach(element => {
                    if (element.Amount !== element.AfterDiscount) {
                        hasDiscount = true
                    }
                    if (element.AfterDiscount !== element.FinalAmount) {
                        hasVAT = true
                    }
                });
                console.log('item..........', item)
                if (hasDiscount && hasVAT) {
                    return <>
                        <TestBillWithEverything key={index} data={item} />
                        <div className="printPageNumber" style={{ direction: `${i18n.dir()}` }}>{index + 1} از {data.length}</div>
                    </>
                }
                else if (hasDiscount && !hasVAT) {
                    return <>
                        <TestBillWithDiscount key={index} data={item} />
                        <div className="printPageNumber" style={{ direction: `${i18n.dir()}` }}>{index + 1} از {data.length}</div>
                    </>

                }
                else if (!hasDiscount && hasVAT) {
                    return <>
                        <TestBillWithVAT key={index} data={item} />
                        <div className="printPageNumber" style={{ direction: `${i18n.dir()}` }}>{index + 1} از {data.length}</div>
                    </>
                }
                else if (!hasDiscount && !hasVAT) {
                    return <>
                        <TestBillWithNothing key={index} data={item} />
                        <div className="printPageNumber" style={{ direction: `${i18n.dir()}` }}>{index + 1} از {data.length}</div>
                    </>
                }
            })}
        </>
    )
}
export default PrintUnofficialInvoice