
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLangDate } from '../../../../utils/getLangDate'


const OfficeGrid = (fontSize) => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([])
  const print_OfficeReport = JSON?.parse(localStorage?.getItem(`print_OfficeReport`))


  useEffect(() => {
    const OfficeReportsData = JSON?.parse(localStorage?.getItem(`OfficeReportsData`))
    let groupedData = {}

    OfficeReportsData?.forEach((item, index) => {
      if (groupedData[`${item.documentNumber}${item.documentDate}${item.recognize}${item.totalName}`]) {
        groupedData[`${item.documentNumber}${item.documentDate}${item.recognize}${item.totalName}`].push({
          ...item,
        }
        );
      } else {
        groupedData[`${item.documentNumber}${item.documentDate}${item.recognize}${item.totalName}`] = [{
          ...item,
        }];
      }
    });

    let tempList = []
    Object.keys(groupedData).forEach((key, index) => {

      if (groupedData[key].length > 1) {
        const sumCredits = groupedData[key].reduce((a, c) => {
          if (c.credits !== undefined) {
            return a + c.credits;
          } else {
            return a;
          }
        }, 0);
        const sumDebits = groupedData[key].reduce((a, c) => {
          if (c.debits !== undefined) {
            return a + c.debits;
          } else {
            return a;
          }
        }, 0);
        tempList.push({
          ...groupedData[key][0],
          credits: sumCredits,
          debits: sumDebits,
        })
      } else {
        tempList.push(groupedData[key][0])
      }
    });
    let list = tempList?.map((item, index) => {
      if (item?.documentNumber !== tempList[index + 1]?.documentNumber) {
        return [item, { documentNumber: null }]
      }
      else {
        return item
      }
    }).flat();
    const sortedDocuments = sortDocumentsByNumberAndType(list);
    setData(sortedDocuments)
  }, [])
  /* ------------------------- sort data with credits ------------------------- */
  function sortDocumentsByNumberAndType(documents) {
    documents.sort((a, b) => {
      if (a.documentNumber === b.documentNumber) {
        if (a.credits !== 0 && b.credits === 0) {
          return -1; // Sort a before b when a has credits and b does not
        } else if (a.credits === 0 && b.credits !== 0) {
          return 1; // Sort b before a when b has credits and a does not
        } else {
          return a.debits - b.debits; // Sort based on debits when both have the same credits status
        }
      }
    });

    return documents;
  }

  function calculateCrediteTotal(index) {
    let temp = data.slice(0, index)
    const sumCredits = temp.reduce((accumulator, currentValue) => {
      if (currentValue.credits !== undefined) {
        return accumulator + currentValue.credits;
      } else {
        return accumulator;
      }
    }, 0);
    return sumCredits
  }
  function calculateDebitsTotal(index) {
    let temp = data.slice(0, index)
    const sumDebits = temp.reduce((accumulator, currentValue) => {
      if (currentValue.debits !== undefined) {
        return accumulator + currentValue.debits;
      } else {
        return accumulator;
      }
    }, 0);
    return sumDebits
  }
  const widthRef = useRef()

  console.log('widthRef.current.clientWidth', widthRef?.current?.clientWidth)
  return (
    <div className='officeGrid d-flex flex-wrap' style={{ direction: i18n.dir() }} >
      <div style={{ direction: i18n.dir(), width: "100%", padding: "0 !important" }}>
        <style jsx global>{`
                                                            .officeGrid-header,.transfer_nextPage>div,.transfer_fromBack>div
                                                            {
                                                                 font-size:${fontSize.fontSize}px
                                                             }
                                                            .officeGrid-header_desc{
                                                              font-size:${fontSize.fontSize}px
                                                             }
                                                          
                                                           `
        }</style>
      </div>
      <div style={{ width: "100%" }}>
        <div style={{ width: "100%", marginLeft: "1px", background: "#a4a4a4ba", display: "flex", alignItems: "center", height: "35px" }}>
          <>
            {print_OfficeReport?.IndexCell ? <div ref={widthRef} className='officeGrid-header flex-grow-1 title' style={{ width: "5%", height: "100%" }}>{t("ردیف")}</div> : <></>}
            {print_OfficeReport?.documentNumber ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "10%", height: "100%" }}>{t("سند")}</div> : <></>}
            {print_OfficeReport?.documentDate ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "10%", height: "100%" }}>{t("تاریخ")}</div> : <></>}
            {print_OfficeReport?.totalName ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "30%", height: "100%" }}>{t("شرح")}</div> : <></>}
            {print_OfficeReport?.debits ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "15%", height: "100%" }}>{t("بدهکار")}</div> : <></>}
            {print_OfficeReport?.credits ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "15%", height: "100%" }}>{t("بستانکار")}</div> : <></>}
            {print_OfficeReport?.Remainder ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "10%", height: "100%" }}>{t("باقیمانده")}</div> : <></>}
            {print_OfficeReport?.recognize ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "5%", height: "100%" }}>{t("تشخیص")}</div> : <></>}
          </>
        </div>

        {data?.map((item, index) => {
          return (
            <><div className={`${index % 2 == 0 ? "officeGrid-body-gray" : "officeGrid-body-white"}`}>
              {item?.documentNumber == null ? <>
                {print_OfficeReport?.IndexCell ? <div className='officeGrid-header index-ofice-header flex-grow-1 title' style={{ maxWidth: `${widthRef?.current?.clientWidth}px`, height: "100%" }}>{index + 1}</div> : <></>}
                <div className='officeGrid-header_desc flex-grow-1 title' style={{ height: "100%" }}>{t("شرح سند")} :</div>
              </> :
                <>
                  {print_OfficeReport?.IndexCell ? <div className='officeGrid-header flex-grow-1  title' style={{ width: "5%", height: "100%" }}>{index + 1}</div> : <></>}
                  {print_OfficeReport?.documentNumber ? <div className='officeGrid-header flex-grow-1  title' style={{ width: "10%", height: "100%" }}>{item?.documentNumber}</div> : <></>}
                  {print_OfficeReport?.documentDate ? <div className='officeGrid-header flex-grow-1  title' style={{ width: "10%", height: "100%" }}>{getLangDate(i18n.language, item?.documentDate)}</div> : <></>}
                  {print_OfficeReport?.totalName ? <div className='officeGrid-header flex-grow-1  title' style={{ width: "30%", height: "100%" }}>{item?.totalName}</div> : <></>}
                  {print_OfficeReport?.debits ? <div className='officeGrid-header flex-grow-1  title' style={{ width: "15%", height: "100%" }}>{item?.credits}</div> : <></>}
                  {print_OfficeReport?.credits ? <div className='officeGrid-header flex-grow-1  title' style={{ width: "15%", height: "100%" }}>{item?.debits}</div> : <></>}
                  {print_OfficeReport?.Remainder ? <div className='officeGrid-header flex-grow-1  title' style={{ width: "10%", height: "100%" }}>{item?.Remainder}</div> : <></>}
                  {print_OfficeReport?.recognize ? <div className='officeGrid-header flex-grow-1 title' style={{ width: "5%", height: "100%" }}>{item?.recognize}</div> : <></>}
                </>}

            </div >
              {(index + 1) % 26 == 0 ?
                <div className="transfer title" style={{ breakAfter: "page" }}>
                  <div className="transfer_nextPage col-lg-12 col-md-12 col-12">
                    <div className='title'></div>
                    <div className='title'></div>
                    <div className='title'></div>
                    <div className='transfer-nTitle' >{t("نقل به صفحه بعد")}:</div>
                    <div className='transfer-credits' style={{ paddingRight: "74px", paddingLeft: "46px" }}>{calculateCrediteTotal(index + 1)}</div>
                    <div className='transfer-debits'  >{calculateDebitsTotal(index + 1)}</div>
                    <div className='title' ></div>
                  </div>

                  <div className="transfer_fromBack col-lg-12 col-md-12 col-12">
                    <div className='title'></div>
                    <div className='title'></div>
                    <div className='title'></div>
                    <div className='title' ></div>
                    <div className='transfer-Bcredits'>{calculateCrediteTotal(index + 1)}</div>
                    <div className='transfer-Bdebits'>{calculateDebitsTotal(index + 1)}</div>
                    <div className='transfer-BTitle' style={{ paddingLeft: "25px" }} >:{t("نقل به از صفحه قبل")}</div>
                  </div>
                </div> : <></>
              }
            </>
          )
        })}

      </div>



    </div >
  )
}

export default React.memo(OfficeGrid);
