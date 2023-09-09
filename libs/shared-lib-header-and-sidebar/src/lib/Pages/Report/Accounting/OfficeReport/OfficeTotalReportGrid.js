import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { getLangDate } from '../../../../utils/getLangDate'

const OfficeTotalReportGrid = (fontSize) => {
  const [data, setData] = useState([])
  const { t, i18n } = useTranslation();
  const print_OfficeReport = JSON?.parse(localStorage?.getItem(`print_OfficeReport`))
  useEffect(() => {
    const OfficeTotalReportsData = JSON?.parse(localStorage?.getItem(`OfficeTotalReportsData`))

    const sortedArray = OfficeTotalReportsData?.sort((a, b) => {
      if (a.completeCode < b.completeCode) {
        return -1;
      }
      if (a.completeCode > b.completeCode) {
        return 1;
      }
      return 0;
    });
    let tempList = [{ completeCode: null }]
    let list = sortedArray?.map((item, index) => {
      if (item?.completeCode !== sortedArray[index + 1]?.completeCode && index !== (sortedArray?.length - 1)) {
        return [item, { completeCode: null }]
      }
      else {
        return item
      }
    }).flat();

    tempList.push(list)
    const fList = sortDocumentsByNumberAndType(tempList.flat())
    setData(fList)
  }, [])

  /* ------------------------- sort data with debits ------------------------- */
  function sortDocumentsByNumberAndType(documents) {
    console.log("document", documents)
    documents.sort((a, b) => {
      if (a.completeCode === b.completeCode) {
        if (a.debits !== 0 && b.debits === 0) {
          return -1; // Sort a before b when a has debits and b does not
        } else if (a.debits === 0 && b.debits !== 0) {
          return 1; // Sort b before a when b has debits and a does not
        } else {
          return a.credits - b.credits; // Sort based on credits when both have the same debits status
        }
      }
    });

    documents.sort((a, b) => {
      if (a.completeCode === b.completeCode && a.debits !== 0 && b.debits !== 0) {
        if (a.documentNumber !== 0 && b.documentNumber === 0) {
          return -1; // Sort a before b when a has debits and b does not
        } else if (a.documentNumber === 0 && b.documentNumber !== 0) {
          return 1; // Sort b before a when b has debits and a does not
        } else {
          return a.documentNumber - b.documentNumber; // Sort based on credits when both have the same debits status
        }
      }
    });
    documents.sort((a, b) => {
      if (a.completeCode === b.completeCode && a.credits !== 0 && b.credits !== 0) {
        if (a.documentNumber !== 0 && b.documentNumber === 0) {
          return -1; // Sort a before b when a has debits and b does not
        } else if (a.documentNumber === 0 && b.documentNumber !== 0) {
          return 1; // Sort b before a when b has debits and a does not
        } else {
          return a.documentNumber - b.documentNumber; // Sort based on credits when both have the same debits status
        }
      }
    });

    return documents;
  }

  function caculateCreditTotal(code) {
    var filter = data.filter(x => x.completeCode == code)
    const sumCredits = filter.reduce((accumulator, currentValue) => {
      return accumulator + currentValue?.credits;
    }, 0);
    return sumCredits
  }

  function calculateDebitsTotal(code) {

    var filter = data?.filter(x => x.completeCode == code)
    const sumDebits = filter?.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.debits;

    }, 0);
    return sumDebits
  }

  function recognize(remainder) {
    if (remainder < 0) {
      return "بس"
    } else if (remainder > 0) {
      return "بد"
    }
    else {
      return "0"
    }

  }

  const debitWidthRef = useRef()
  const creditWidthRef = useRef()
  const remainderWidthRef = useRef()
  const recognizeWidthRef = useRef()


  let count = 0


  return (
    <div className='officeGrid d-flex flex-wrap' style={{ direction: i18n.dir() }} >
      <div style={{ direction: i18n.dir(), width: "100%", padding: "0 !important" }}>
        <style jsx global>{`
                                                        .officeGrid-header,.transfer_nextPage>div,.transfer_fromBack>div
                                                        {
                                                             font-size:${fontSize.fontSize}px
                                                         }
                                                        .officeGrid-header_desc,.officeGrid-header-main{
                                                          font-size:${fontSize.fontSize}px
                                                         }
                                                      
                                                       `
        }</style>
      </div>
      <div style={{ width: "100%" }}>
        <div style={{ width: "100%", marginLeft: "1px", background: "#a4a4a4ba", display: "flex", alignItems: "center", height: "35px" }}>
          <>
            {print_OfficeReport?.documentNumber ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "10%", height: "100%" }}>{t("سند")}</div> : <></>}
            {print_OfficeReport?.documentDate ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "10%", height: "100%" }}>{t("تاریخ")}</div> : <></>}
            {print_OfficeReport?.totalName ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "30%", height: "100%" }}>{t("شرح")}</div> : <></>}
            {print_OfficeReport?.debits ? <div ref={debitWidthRef} className='officeGrid-header  flex-grow-1 title' style={{ width: "15%", height: "100%" }}>{t("بدهکار")}</div> : <></>}
            {print_OfficeReport?.credits ? <div ref={creditWidthRef} className='officeGrid-header  flex-grow-1 title' style={{ width: "15%", height: "100%" }}>{t("بستانکار")}</div> : <></>}
            {print_OfficeReport?.Remainder ? <div ref={remainderWidthRef} className='officeGrid-header flex-grow-1 title' style={{ width: "10%", height: "100%" }}>{t("باقیمانده")}</div> : <></>}
            {print_OfficeReport?.recognize ? <div ref={recognizeWidthRef} className='officeGrid-header  flex-grow-1 title' style={{ width: "10%", height: "100%" }}>{t("تشخیص")}</div> : <></>}
          </>
        </div>

        {data?.map((item, index) => {
          if (item?.completeCode == null) {
            count = 0
          }
          else {
            count++
          }

          return (
            <>
              {(index !== 0 && item?.completeCode == null) ?
                <div className='d-flex .footer-officeGrid-main' >
                  {print_OfficeReport?.IndexCell || print_OfficeReport?.documentNumber || print_OfficeReport?.documentDate ? <div className='d-flex justify-content-lg-start footer-officeGrid align-items-center flex-grow-1 title sum-total-office' >{t("جمع حساب کل")}: {data[index - 1]?.completeCode}</div> : <></>}
                  {print_OfficeReport?.debits ? <div className='officeGrid-header footer-officeGrid-debit flex-grow-1 title' style={{ maxWidth: `${debitWidthRef?.current?.clientWidth}px`, height: "100%", border: "1px solid #b6b6b6!important" }}>{calculateDebitsTotal(data[index - 1]?.completeCode)}</div> : <></>}
                  {print_OfficeReport?.credits ? <div className='officeGrid-header footer-officeGrid-credit flex-grow-1 title' style={{ maxWidth: `${creditWidthRef?.current?.clientWidth}px`, height: "100%", border: "1px solid #b6b6b6!important" }}>{caculateCreditTotal(data[index - 1]?.completeCode)}</div> : <></>}
                  {print_OfficeReport?.Remainder ? <div className='officeGrid-header footer-officeGrid-remainder flex-grow-1 title' style={{ maxWidth: `${remainderWidthRef?.current?.clientWidth}px`, height: "100%", border: "1px solid #b6b6b6!important" }}>{Math.abs(caculateCreditTotal(data[index - 1]?.completeCode) - calculateDebitsTotal(data[index - 1]?.completeCode))}</div> : <></>}
                  {print_OfficeReport?.recognize ? <div className='officeGrid-header footer-officeGrid-recognize flex-grow-1 title' style={{ maxWidth: `${recognizeWidthRef?.current?.clientWidth}px`, height: "100%", border: "1px solid #b6b6b6!important" }}>{recognize(caculateCreditTotal(data[index - 1]?.completeCode) - calculateDebitsTotal(data[index - 1]?.completeCode))}</div> : <></>}
                </div > :
                <></>}
              {index !== 0 && index % 26 === 0 ? <div className='pageBreack-print' ></div> : <></>}
              <div className={`${count % 2 == 0 ? "officeGrid-body-gray" : "officeGrid-body-white"}`}>
                {item?.completeCode == null ?
                  <div className='officeGrid-header-main title' style={{ background: "#9c9c9c", color: "white" }}>
                    <div className='officeGrid-header_formers title'>{t("حساب کل")}‌:‌{data[index + 1]?.completeCode}</div>
                    <div className='officeGrid-header_coding title' style={{ width: "100%", height: "100%" }}>{data[index + 1]?.formersName}</div>
                  </div> :
                  <>
                    <>
                      {print_OfficeReport?.documentNumber ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "10%", height: "100%" }}>{item?.documentNumber}</div> : <></>}
                      {print_OfficeReport?.documentDate ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "10%", height: "100%" }}>{getLangDate(i18n.language, item?.documentDate)}</div> : <></>}
                      {print_OfficeReport?.totalName ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "30%", height: "100%" }}>{item?.totalName}</div> : <></>}
                      {print_OfficeReport?.debits ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "15%", height: "100%" }}>{item?.debits}</div> : <></>}
                      {print_OfficeReport?.credits ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "15%", height: "100%" }}>{item?.credits}</div> : <></>}
                      {print_OfficeReport?.Remainder ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "10%", height: "100%" }}>{item?.Remainder}</div> : <></>}
                      {print_OfficeReport?.recognize ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "10%", height: "100%" }}>{item?.recognize}</div> : <></>}
                    </>

                  </>
                }
              </div >

            </>
          )
        })}

      </div >



    </div >
  )
}





export default OfficeTotalReportGrid
