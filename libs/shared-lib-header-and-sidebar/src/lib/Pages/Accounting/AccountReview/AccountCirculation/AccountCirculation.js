import { React, useEffect, useRef, useState } from "react";
import { CircularProgress, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import "../AccountReviewStyle.css";
import { useLocation } from "react-router";
import { useGetAccountCirculationByIdQuery, useGetAccountCirculationById_ForPrintQuery } from "../../../../features/slices/accountingDocumentSlice";
import ActionCellMain2 from "./ActionCellMain2";
import { useSelector } from "react-redux";
import RKGrid, { FooterSome,IndexCell, CurrencyCell, TotalTitle,DateCell } from "rkgrid";

const AccountCirculation = ({ accountCirculationQuerySearchParams, state, GetStatus, tempIndex, indexRef }) => {
  const location = useLocation();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const params = new URLSearchParams(location?.search)
  const obj = Object.fromEntries(params)
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([])
  const [content, setContent] = useState("");
  const dataRef = useRef();
  dataRef.current = data
  const [loading, setLoading] = useState(true);


  /* -------------------------------------------------------------------------- */
  /*                           Get acconting Documents                          */
  /* -------------------------------------------------------------------------- */
  var fiscalYearId = useSelector((state) => state?.reducer?.fiscalYear?.fiscalYearId);
  useEffect(() => {

    setSkip(false)
  }, [tempIndex, fiscalYearId])
  const [skip, setSkip] = useState(true)
  const { data: AccountCirculationResult, isFetching: AccountCirculationIsFetching, error: AccountCirculationrror, currentData: AccountCirculationCurrentData
  } = useGetAccountCirculationByIdQuery({
    id: tempIndex[indexRef]?.id, level: tempIndex[indexRef]?.level, detailsId: tempIndex[indexRef]?.stateOfTable?.detailsId,
    query: accountCirculationQuerySearchParams, obj: obj
  }, { skip: skip });
  useEffect(() => {
    if (AccountCirculationIsFetching) {
      setContent(<CircularProgress />)
    } else if (AccountCirculationrror) {
      setContent(t("خطایی رخ داده است"))
    } else {
      setContent("")
      if (!!AccountCirculationResult?.header) {
        let pagination = JSON.parse(AccountCirculationResult?.header);
        setTotal(pagination.totalCount);
      }
      var temp = AccountCirculationResult?.data?.map((data) => {

        let creditTotal = data?.credits?.reduce(
          (acc, current) => acc + current,
          0
        );
        let debitTotal = data?.debits?.reduce(
          (acc, current) => acc + current,
          0
        );
        let Remainder = debitTotal - creditTotal
        return {
          "DocumentCode": data?.documentNumber,
          'DocumentDate': new Date(data?.documentDate),
          'DocumentType': data?.documentType,
          'DocumentState': data?.documentState == 0 ? t("غیرقطعی") : data?.documentState == 1 ? t("قطعی") : t("دائم"),
          'DocumentLevel': state?.level,
          'ArticleDescription': data?.documentDescription,
          'Debtor': debitTotal,
          'Creditor': creditTotal,
          'Remainder': Remainder > 0 ? Math.abs(Remainder) : 0,
          'RemainderType': Remainder > 0 ? "بدهکار" : Remainder < 0 ? "بستانکار" : "0",
        }
      })
      setData(temp)
    }



  }, [AccountCirculationIsFetching, location?.search, fiscalYearId, AccountCirculationResult])
  useEffect(() => {
    if (!!data?.length) {
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [data])
  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
  const CustomActionCellMain = (props) => <ActionCellMain2 {...props} GetStatus={GetStatus} />
  let tempColumn = [
    {
      field: 'IndexCell',
      filterable: false,
      width: '50px',
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      // footerCell: TotalTitle,
      reorderable: false
    },
    {
      field: 'DocumentCode',
      filterable: true,
      name: "شماره سند",
      filter: 'numeric',
      width: '60px',
    },
    {
      field: 'DocumentDate',
      cell: DateCell,
      filterable: true,
      name: "تاریخ",
      width: '60px',
      filter: 'numeric',
    },
    {
      field: 'DocumentType',
      filterable: true,
      name: "نوع سند",
      width: "70px",
      filter: 'numeric',
    },
    {
      field: 'DocumentState',
      filterable: true,
      name: "وضعیت",
      filter: 'numeric',
      width: "70px",
    },
    {
      field: 'ArticleIndexCell',
      filterable: false,
      width: '50px',
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      footerCell: TotalTitle,
      reorderable: false
    },
    {
      field: 'ArticleDescription',
      filterable: true,
      width: '170px',
      name: "شرح",
    },
    {
      field: 'Debtor',
      filterable: true,
      name: "بدهکار",
      filter: 'numeric',
      width: '100px',
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
    },
    {
      field: 'Creditor',
      filterable: true,
      name: "بستانکار",
      filter: 'numeric',
      width: '100px',
      cell: CurrencyCell,
      footerCell: CustomFooterSome,

    },
    {
      field: 'Remainder',
      filterable: true,
      name: "مانده",
      filter: 'numeric',
      width: '100px',
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
    },
    {
      field: 'RemainderType',
      filterable: true,
      name: "تشخیص",
      filter: 'numeric',
      width: '100px',
      footerCell: CustomFooterSome,

    },
    {
      field: 'actionCell',
      filterable: false,
      width: '50px',
      name: "سند",
      cell: CustomActionCellMain,
      className: 'text-center',
      reorderable: false
    }
  ]
  /* -------------------------------------------------------------------------- */
  /*                      Get Accountig document for Excel                      */
  /* -------------------------------------------------------------------------- */
  const [excelData, setExcelData] = useState();
  const [excelSkip, setExcelSkip] = useState(false);
  useEffect(() => {
    if (excelData?.length > 0) {
      setExcelSkip(true)
    }
  }, [excelData])


  const { data: AccountCirculation_ForPrintResult, isFetching: AccountCirculation_ForPrintIsFetching, error: AccountCirculation_ForPrintError,
  } = useGetAccountCirculationById_ForPrintQuery({ id: state.id, level: state?.level, detailsId: state?.detailsId, query: accountCirculationQuerySearchParams }, { skip: excelSkip });
  useEffect(() => {
    if (AccountCirculation_ForPrintIsFetching) {
      setContent(<CircularProgress />)
    } else if (AccountCirculation_ForPrintError) {
      setContent(t("خطایی رخ داده است"))
    } else {
      setContent("")
      var temp = AccountCirculation_ForPrintResult?.data?.map((data) => {
        let creditTotal = data?.credits?.reduce(
          (acc, current) => acc + current,
          0
        );
        let debitTotal = data?.debits?.reduce(
          (acc, current) => acc + current,
          0
        );
        let Remainder = debitTotal - creditTotal
        return {
          "DocumentCode": data?.documentNumber,
          'DocumentDate': new Date(data?.documentDate),
          'DocumentType': data?.documentType,
          'DocumentState': data?.documentState == 0 ? t("غیرقطعی") : data?.documentState == 1 ? t("قطعی") : t("دائم"),
          'ArticleIndex': data?.documentArticleId,
          'ArticleDescription': data?.documentDescription,
          'Debtor': debitTotal,
          'Creditor': creditTotal,
          'Remainder': Remainder > 0 ? Math.abs(Remainder) : 0,
          'RemainderType': Remainder > 0 ? "بدهکار" : "بستانکار",
        }
      })
      setExcelData(temp)
    }
  }, [AccountCirculation_ForPrintIsFetching, AccountCirculation_ForPrintResult])
  useEffect(() => {
    if (excelData?.length > 0) {
      localStorage.setItem('excelData', JSON.stringify(excelData));
    }
  }, [excelData])
  return (
    <>
      <RKGrid
        loading={loading}
        gridId={'AccountCirculationGrid'}
        gridData={data}
        excelData={excelData}
        columnList={tempColumn}
        showSetting={true}
        showExcelExport={true}
        showChart={false}
        showPrint={true}
        rowCount={10}
        sortable={true}
        pageable={true}
        reorderable={true}
        selectable={false}
        selectionMode={'single'}
        total={total}
        selectKeyField={'DocumentCode'}
        excelFileNam={t("صورت خلاصه تنخواه")}
      />
    </>
  )
}
export default AccountCirculation
