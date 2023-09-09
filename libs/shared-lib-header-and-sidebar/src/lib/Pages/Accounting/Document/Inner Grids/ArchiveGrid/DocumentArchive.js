import { Button, CircularProgress, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import RKGrid, {  IndexCell,DateCell } from "rkgrid";
import {
  useGetAllArchiveQuery,
  useGetFilteredNonbindingDocumentsMutation,
  useMultipleUpdateAccountingDocumentChangeStateMutation,
} from "../../../../../features/slices/accountingDocumentSlice";
import ArchiveActionCell from "./ArchiveActionCell";
import Discontinuing from "./Discontinuing";
import { useSelector } from "react-redux";
import { AccountingTitles } from "../../../../../utils/pageTitles";
import { Helmet } from "react-helmet-async";
import { ParseDocumentStatesEnum } from "../../../../../utils/Enums/DocumentStateEnum";
import swal from "sweetalert";

const DocumentArchive = () => {
  const location = useLocation();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [total, setTotal] = useState(0);
  const params = new URLSearchParams(location?.search);
  const obj = Object.fromEntries(params);
  const [content, setContent] = useState("");
  const [data, setData] = useState([]);
  const [filterList, setFilterList] = useState([])
  const fiscalYear = useSelector((state) => state.reducer.fiscalYear.fiscalYearId);
  const {
    data: accountingDocumentResult = { data: [] },
    isFetching: accountingDocumentIsFetching,
    error: accountingDocumentError,
    currentData: AccountDocumentsArticleCurrentData,
  } = useGetAllArchiveQuery({ obj: obj, query: "" },
    {
      skip: fiscalYear === 0 || Object.keys(obj).length === 0 || filterList.length > 0
    });
  useEffect(() => {
    parseQueryData(accountingDocumentResult, accountingDocumentIsFetching, accountingDocumentError)
  }, [accountingDocumentIsFetching, accountingDocumentResult, AccountDocumentsArticleCurrentData]);

  const [filterArchive, filterResults] = useGetFilteredNonbindingDocumentsMutation()

  const gridId = "DocumentArchive"
  const gridSetting = JSON.parse(localStorage.getItem(`settings_${gridId}`))

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
        };
      });
      setData(tempData);
      dataRef.current = tempData;
    }
  }

  const dataRef = useRef();
  dataRef.current = data;
  // const [excelData, setExcelData] = useState([]);
  // const dataRef2 = useRef();
  // dataRef2.current = excelData;

  const [actionList, setActionList] = useState([]);

  const navigate = useNavigate();

  let tempRequestData = [];

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
      filterable: false,
      filter: "none",
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
      width: "150px",
      name: "عملیات",
      cell: ArchiveActionCell,
      className: "text-center",
      reorderable: false,
    },
  ];

  function getSelectedRows(list) {
    tempRequestData = list?.map(
      (data, index) => (tempRequestData[index] = data.DocumentId)
    );
    setActionList(list);
    localStorage.setItem(`printList`, JSON.stringify(tempRequestData));
  }

  const callBackComponent = () => {
    navigate(`/Accounting/Document`, { replace: false });
  };
  /* -------------------------------- Mutation -------------------------------- */
  const [updateMultipleChangeState, updateResults] =
    useMultipleUpdateAccountingDocumentChangeStateMutation();
  /* -------------------------------------------------------------------------- */
  const [binding, setBinding] = useState([]);
  const selecedRows = () => {
    // actionList post
    tempRequestData = actionList?.map((data, index) => {
      return {
        "documentId": data.documentId,
        "changeState": 1
      };
    });

    updateMultipleChangeState({
      AccountingDocumentChangeStateDTO: tempRequestData
    });
  };

  async function filterData(value) {
    setFilterList(value)
    await filterArchive({ obj: obj, filter: value })
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
        <title>{t(AccountingTitles.ConfirmDocuments)}</title>
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
          // excelData={excelData}
          columnList={tempColumn}
          showSetting={true}
          showChart={false}
          showExcelExport={false}
          showPrint={false}
          // excelFileName={'اسناد حسابداری'}
          //   chartDependent={chartObj}
          rowCount={10}
          //   savedChartsList={savedCharts}
          //   getSavedCharts={getSavedCharts}
          sortable={true}
          pageable={true}
          reorderable={true}
          selectable={true}
          selectionMode={"multiple"} //single , multiple
          selectKeyField={"DocumentId"}
          loading={accountingDocumentIsFetching || filterResults.isLoading}
          getSelectedRows={getSelectedRows}
          total={total}
          extraBtn={
            <>
              <Discontinuing
                disabled={actionList.length === 0}
                selecedRows={selecedRows}
              />
            </>
          }
          onfilter={filterData}
        />
        <div className="Issuance col-12 d-flex justify-content-end">
          {/* <Button variant="contained"
                        color="primary"
                        style={{ height: "38px", margin: "8px" }}
                        onClick={() => console.warn("قطعی کردن ردیف‌ها:", actionList)}>
                        {t("قطعی")}
                    </Button> */}

          {/* <Button variant="contained"
                        color="primary"
                        style={{ height: "38px", margin: "8px" }}
                        onClick={() => console.warn("غیرقطعی کردن ردیف‌ها:", actionList)}>
                        {t("غیر قطعی")}
                    </Button> */}

          <Button
            variant="contained"
            color="primary"
            style={{ height: "38px", margin: "8px" }}
            onClick={callBackComponent}
          >
            {t("بازگشت")}
          </Button>
        </div>
      </div>
    </>
  );
};
export default DocumentArchive;
