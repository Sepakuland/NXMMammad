import { useEffect, useRef, useState } from "react";
import OfficialInvoiceData from './OfficialInvoiceData.json';
import { useTranslation } from "react-i18next";
import OfficialInvoicePrint from "./OfficialInvoicePrint";


const PrintTestBill = (props) => {
    const { t, i18n } = useTranslation();
    const [hasDiscount, setHasDiscount] = useState([])
    const [hasVAT, setHasVAT] = useState([])
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data
    useEffect(() => {
        let tempData = OfficialInvoiceData.map((data) => {
            let temp = (data.UnitPrice).toString().replaceAll(',', '')
            let temp2 = (data.TotalPrice).toString().replaceAll(',', '')
            let temp3 = (data.DiscountPrice).toString().replaceAll(',', '')
            let temp4 = (data.TotalAmountAfterDeductingDiscount).toString().replaceAll(',', '')
            let temp5 = (data.TaxesAnddutiesSum).toString().replaceAll(',', '')
            let temp6 = (data.TotalCountAfterCalculation).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            let cost2 = parseFloat(temp2, 2)
            let cost3 = parseFloat(temp3, 2)
            let cost4 = parseFloat(temp4, 2)
            let cost5 = parseFloat(temp5, 2)
            let cost6 = parseFloat(temp6, 2)
            return {
                ...data,
                UnitPrice: cost,
                TotalPrice: cost2,
                DiscountPrice: cost3,
                TotalAmountAfterDeductingDiscount: cost4,
                TaxesAnddutiesSum: cost5,
                TotalCountAfterCalculation: cost6,
                ProductCode: data.ProductCode !== '' ? parseInt(data.ProductCode) : '',
            }
        })
        setData(tempData)
    }, [i18n.language])

    // useEffect(() => {
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
    console.log('data', data)

    return (
        <>
            {data?.length && data?.map((item, index) => {
                return <>

                    <OfficialInvoicePrint key={index} data={item} />
                    <div className="printPageNumber" style={{ direction: `${i18n.dir()}` }}>{index + 1} از {data.length}</div>
                    {/* 
                    <OfficialInvoicePrint key={index} data={item} />
                    <div className="printPageNumber" style={{ direction: `${i18n.dir()}` }}>{index + 1} از {data.length}</div> */}
                    {/* 
                    <OfficialInvoicePrint key={index} data={item} />
                    <div className="printPageNumber" style={{ direction: `${i18n.dir()}` }}>{index + 1} از {data.length}</div>

                    <OfficialInvoicePrint key={index} data={item} />
                    <div className="printPageNumber" style={{ direction: `${i18n.dir()}` }}>{index + 1} از {data.length}</div>*/}
                </>

            })}
        </>
    )
}
export default PrintTestBill



{/* {data?.length && data?.map((item, index) => {
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
                }*/}