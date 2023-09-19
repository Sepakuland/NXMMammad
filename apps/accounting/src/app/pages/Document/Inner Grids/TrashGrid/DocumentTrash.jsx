import { Button, CircularProgress, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import RKGrid, {  IndexCell,DateCell } from "rkgrid";
import TrashActionCell from "./TrashActionCell";
import { useNavigate, useLocation } from "react-router-dom";
import { useFetchFilteredRecycleBinDocumentMutation, useGetAllAccountingDocumentRecycleBinQuery } from "../../../../../features/slices/accountingDocumentRecycleBinSlice";
import { useSelector } from "react-redux";
import { AccountingTitles } from "../../../../../utils/pageTitles";
import { Helmet } from "react-helmet-async";
import swal from "sweetalert";


const DocumentTrash = () => {
  const location = useLocation();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [total, setTotal] = useState(0);
  const params = new URLSearchParams(location?.search);
  const obj = Object.fromEntries(params);
  const [content, setContent] = useState("");
  const [data, setData] = useState([]);

  const [filterList, setFilterList] = useState([])
  const gridId = "AccountingDocumentRecycleBin"
  const gridSetting = JSON.parse(localStorage.getItem(`settings_${gridId}`))

  const fiscalYear = useSelector((state) => state.reducer.fiscalYear.fiscalYearId);

  const {
    data: accountingDocumentRecycleBinResult = { data: [] },
    isFetching: accountingDocumentRecycleBinIsFetching,
    error: accountingDocumentRecycleBinError,
    currentData: accountingDocumentRecycleBinCurrentData
    } = useGetAllAccountingDocumentRecycleBinQuery(obj
    , {
      skip: fiscalYear === 0 || Object.keys(obj).length === 0 || filterList.length !== 0
    });
  useEffect(() => {
    parseQueryData(accountingDocumentRecycleBinResult, accountingDocumentRecycleBinIsFetching, accountingDocumentRecycleBinError)
  }, [accountingDocumentRecycleBinIsFetching, accountingDocumentRecycleBinCurrentData]);

  const [filerRecycleBinDocument, filterResults] = useFetchFilteredRecycleBinDocumentMutation()

  function parseQueryData(data, isFetching, error){
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

      let tempData = data.data.map((data) => {
        return {
          ...data,
          DocumentDate: new Date(data.documentDate),
          CreatedDate: new Date(data.createdDate)
        };
      });
      setData(tempData);
      dataRef.current = tempData;
    }
  }

  const dataRef = useRef();
  dataRef.current = data;
  const [excelData, setExcelData] = useState([]);
  const dataRef2 = useRef();
  dataRef2.current = excelData;

  const navigate = useNavigate();

  const callBackComponent = () => {
    navigate(`/Accounting/Document`, { replace: false });
  };

  let tempColumn = [
    {
      field: 'IndexCell',
      filterable: false,
      width: '60px',
      name: "ردیف",
      cell: IndexCell,
      sortable: false,
      reorderable: true
    },
    {
      field: 'documentNumber',
      filterable: true,
      name: "شماره سند",
      filter: 'numeric',
    },
    {
      field: 'folioNumber',
      filterable: true,
      name: "شماره عطف",
      filter: 'numeric',
    },
    {
      field: 'documentDefinitionName',
      filterable: true,
      name: "نوع سند",
    },
    {
      field: 'refNumber',
      filterable: true,
      name: "شماره ارجاع",
      filter: 'numeric',
    },
    {
      field: "DocumentDate",
      filterable: true,
      filter: "date",
      name: "تاریخ سند",
      cell: DateCell,
    },
    {
      field: 'CreatedDate',
      filterable: true,
      filter: "date",
      name: "تاریخ حذف",
      cell: DateCell,
    },
    {
      field: 'actionCell',
      filterable: false,
      width: '140px',
      name: "عملیات",
      cell: TrashActionCell,
      className: 'text-center',
      reorderable: false
    }
  ]

  async function filterData(value) {
    setFilterList(value)
    await filerRecycleBinDocument({ obj: obj, filter: value })
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
        <title>{t(AccountingTitles.DocumentRecycleBin)}</title>
      </Helmet>
      <div
        style={{
          backgroundColor: `${theme.palette.background.paper}`,
          padding: "20px",
        }}
      >
        <RKGrid
          gridId={"AccountingDocumentRecycleBin"}
          gridData={data}
          excelData={excelData}
          columnList={tempColumn}
          showSetting={true}
          showChart={false}
          showExcelExport={false}
          showPrint={false}
          excelFileName={t("بازیافت اسناد")}
          rowCount={10}
          sortable={true}
          pageable={true}
          reorderable={true}
          selectable={false}
          selectKeyField={"DocumentId"}
          showFilter={true}
          total={total}
          showTooltip={true}
          loading={accountingDocumentRecycleBinIsFetching || filterResults.isLoading}
          onfilter={filterData}
        />
        <div className="Issuance col-12 d-flex justify-content-end">
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

export default DocumentTrash;
