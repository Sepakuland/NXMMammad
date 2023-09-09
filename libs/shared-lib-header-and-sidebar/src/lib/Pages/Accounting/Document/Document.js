import { CircularProgress, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import RKGrid, {  IndexCell,DateCell } from "rkgrid";
import DocumentActionCell from "./DocumentActionCell";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  useGetAllAccountingDocumentQuery,
  useGetFilteredDocumentMutation,
} from "../../../features/slices/accountingDocumentSlice";
import PermenateDocument from "./permenateDocument";
import SearchBtn from "./SearchBtn";
import PrintBtn from "./PrintBtn";
import RecycleTrash from "./recycleTrash";
import { CreateQueryString } from "../../../utils/createQueryString";
import { useSelector } from "react-redux";
import { AccountingTitles } from "../../../utils/pageTitles";
import { Helmet } from "react-helmet-async";
import { ParseDocumentStatesEnum, documentStates } from "../../../utils/Enums/DocumentStateEnum";
import swal from "sweetalert";

const DocumentGrid = () => {
  const location = useLocation();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [total, setTotal] = useState(0);
  const params = new URLSearchParams(location?.search);
  const obj = Object.fromEntries(params);
  const [content, setContent] = useState("");
  const [data, setData] = useState([]);
  const [querySearchParams, setQuerySearchParams] = useState("");
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [filterList, setFilterList] = useState([]);
  const gridId = "AccountingDocuments"
  const gridSetting = JSON.parse(localStorage.getItem(`settings_${gridId}`))


  const fiscalYear = useSelector(
    (state) => state.reducer.fiscalYear.fiscalYearId
  );
  const {
    data: accountingDocumentResult = { data: [] },
    isFetching: accountingDocumentIsFetching,
    error: accountingDocumentError,
    currentData: accountingDocumentCurrentData
  } = useGetAllAccountingDocumentQuery(
    { obj: obj, query: querySearchParams },
    {
      skip: fiscalYear === 0 || Object.keys(obj).length === 0 || filterList.length !== 0
    });

  function getQuery(value) {
    setQuerySearchParams(CreateQueryString(value));
  }

  const [filterDocument, filterResults] = useGetFilteredDocumentMutation()
  useEffect(() => {
    parseQueryData(accountingDocumentResult, accountingDocumentIsFetching, accountingDocumentError)
  }, [accountingDocumentIsFetching, accountingDocumentResult, accountingDocumentCurrentData]);

  const dataRef = useRef();
  dataRef.current = data;
  // const [excelData, setExcelData] = useState([]);
  // dataRef2.current = excelData;

  const [actionList, setActionList] = useState([]);

  function parseQueryData(data, isFetching, error) {
    if (isFetching) {
      setContent(<CircularProgress />);
    } else if (error) {
      setContent(t("خطایی رخ داده است"));
    } else {
      setContent("");
      if (!!data?.header) {
        let pagination = JSON.parse(data?.header);
        setTotal(pagination.totalCount);
      }

      let tempData = data?.data.map((data) => {
        return {
          ...data,
          DocumentDate: new Date(data.documentDate),
          documentState: t(ParseDocumentStatesEnum(data.documentState)),
          originalDocumentState: data.documentState
        };
      });
      setData(tempData);
      dataRef.current = tempData;
    }
  }
  // /* -------------------------------------------------------------------------- */
  //  const [excelData, setExcelData] = useState();
  // //  const {
  // //    data: accountingDocumentRIWResult,
  // //    isFetching: accountingDocumentRIWIsFetching,
  // //    error: accountingDocumentRIWError,
  // //    isLoading: accountingDocumentRIWIsLoading,
  // //  } = useGetAllAccountingDocumentRIWQuery();

  //  const {
  //   data: accountingDocumentRIWResult = {data: []},
  //   isFetching: accountingDocumentRIWIsFetching,
  //   error: accountingDocumentRIWError,
  //   isLoading: accountingDocumentRIWIsLoading,
  // } = useGetAllAccountingDocumentRIWQuery()
  //  useEffect(() => {
  //    if (accountingDocumentRIWIsFetching) {
  //      setContent(<CircularProgress />);
  //    } else if (accountingDocumentRIWError) {
  //      setContent(t("خطایی رخ داده است"));
  //    } else {
  //      setContent("");
  //      console.log("accountingDocumentRIWResult", accountingDocumentRIWResult);
  //     let tempData = accountingDocumentResult?.data.map((data) => {
  //       let documentState;
  //       if (data.documentState === 1) {
  //         documentState = "قطعی";
  //       } else if (data.documentState === 0) {
  //         documentState = "غیر قطعی";
  //       } else {
  //         documentState = "دائمی";
  //       }
  //       return {
  //         ...data,
  //         DocumentId: data.documentNumber,
  //         // "TrackingNumber": data.accountingDocumentArticleDTO.trackingNumber,
  //         DocumentDate: new Date(data.documentDate),
  //         // "DocumentBalance": (data.accountingDocumentArticleDTO.credits)-(data.accountingDocumentArticleDTO.debits),
  //         DocumentType: data.documentDefinitionName,
  //         RefNumber: data.refNumber,
  //         CreatedByUser: data.createdByUser,
  //         FolioNumber: data.folioNumber,
  //         SubsidiaryNumber: data.subsidiaryNumber,
  //         DailyNumber: data.dailyNumber,
  //         ModifiedByUser: data.modifiedByUser,
  //         DocumentState: documentState,
  //         DocumentDescription: data.documentDescription,
  //       };
  //     });
  //     setExcelData(tempData);
  //     // dataRef.current = tempData;
  //   }
  // }, [accountingDocumentRIWIsFetching]);

  // }, [accountingDocumentIsFetching, accountingDocumentResult]);

  let tempColumn = [
    {
      field: "IndexCell",
      filterable: false,
      width: "60px",
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      reorderable: true,
    },
    {
      field: "documentNumber",
      filterable: true,
      name: "ش سند",
      filter: "numeric",
    },
    {
      field: "documentDate",
      filterable: true,
      filter: "date",
      name: "تاریخ",
      cell: DateCell,
    },
    // {
    //   field: 'DocumentBalance',
    //   filterable: true,
    //   name: "تراز",
    //   cell: CurrencyCell,
    //   filter: 'numeric',
    // },
    {
      field: "documentDefinitionName",
      filterable: true,
      name: "نوع",
    },
    {
      field: "refNumber",
      filterable: true,
      name: "ش ارجاع",
      filter: "numeric",
    },
    // {
    //   field: 'DocumentTrackCode',
    //   filterable: true,
    //   name: "ش پیگیری",
    //   filter: 'numeric',
    // },
    {
      field: "createdByUser",
      filterable: true,
      name: "درج",
    },
    {
      field: "folioNumber",
      filterable: true,
      filter: "numeric",
      name: "ش عطف",
    },
    {
      field: "subsidiaryNumber",
      filterable: true,
      filter: "numeric",
      name: "ش فرعی",
    },
    {
      field: "dailyNumber",
      filterable: true,
      filter: "numeric",
      name: "ش روزانه",
    },
    {
      field: "modifiedByUser",
      filterable: true,
      name: "آخرین تغییر",
    },
    {
      field: "documentState",
      filterable: true,
      filter: "enum",
      filterObject: documentStates,
      name: "وضعیت سند",
    },
    {
      field: "documentDescription",
      filterable: true,
      width: "150px",
      name: "شرح",
    },
    // {
    //   field: 'Attachments',
    //   filterable: true,
    //   width: '150px',
    //   name: "پیوست‌ها",
    // },
    {
      field: "actionCell",
      filterable: false,
      width: "200px",
      name: "عملیات",
      cell: DocumentActionCell,
      className: "text-center",
      reorderable: false,
    },
  ];



  function getSelectedRows(list) {
    setActionList(list);
    localStorage.setItem(`printList`, JSON.stringify(list));
  }

  console.log('obj-----',obj)

  async function filterData(value) {
    setFilterList(value)
    await filterDocument({ obj: obj, filter: value })
      .unwrap()
      .then((res) => {
        parseQueryData(res, filterResults.isLoading, filterResults.isError)
      })
      .catch((error) => {
        let arr = error.data.errorList.map((item) => t(item));
        let msg = arr.join(" \n ");
        swal({
          text: msg,
          icon: "error",
          button: t("باشه"),
          className: "small-error",
        });
      });
  }

  useEffect(() => {
    if (filterList.length > 0){
      filterData(filterList)
    }
  }, [gridSetting?.take, obj.PageNumber])
  


  return (
    <>
      <Helmet>
        <title>{t(AccountingTitles.Document)}</title>
      </Helmet>
      <div
        style={{
          backgroundColor: `${theme.palette.background.paper}`,
          padding: "20px",
        }}
      >
        <RKGrid
          gridId={gridId}
          gridData={data}
          excelData={data}
          columnList={tempColumn}
          showSetting={true}
          showChart={false}
          showExcelExport={true}
          showPrint={false}
          excelFileName={t("اسناد حسابداری")}
          rowCount={10}
          sortable={true}
          pageable={true}
          reorderable={true}
          selectable={true}
          selectionMode={"multiple"} //single , multiple
          selectKeyField={"documentId"}
          getSelectedRows={getSelectedRows}
          showFilter={true}
          total={total}
          showTooltip={true}
          loading={accountingDocumentIsFetching || filterResults.isLoading}
          addUrl={"/Accounting/NewDocument"}
          addTitle={t("افزودن سند")}
          showAdd={true}
          extraBtnSecond={
            <>
              {/* <DeleteBtn /> */}
              {/* <AddOperationBtn /> */}
              <RecycleTrash />
              <SearchBtn getQuery={getQuery} />
              <PermenateDocument />
              <PrintBtn disabled={actionList.length === 0} />
            </>
          }
          onfilter={filterData}
        />
      </div>
    </>
  );
};

export default DocumentGrid;
