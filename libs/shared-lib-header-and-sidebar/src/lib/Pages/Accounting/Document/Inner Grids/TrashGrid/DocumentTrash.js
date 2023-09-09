import { Button, CircularProgress, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import RKGrid, {  IndexCell,DateCell } from "rkgrid";
import TrashActionCell from "./TrashActionCell";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetAllAccountingDocumentRecycleBinQuery } from "../../../../../features/slices/accountingDocumentRecycleBinSlice";
import { useSelector } from "react-redux";
import { AccountingTitles } from "../../../../../utils/pageTitles";
import { Helmet } from "react-helmet-async";


const DocumentTrash = () => {
  const location = useLocation();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [total, setTotal] = useState(0);
  const params = new URLSearchParams(location?.search);
  const obj = Object.fromEntries(params);
  const [content, setContent] = useState("");
  const [data, setData] = useState([]);

  const fiscalYear = useSelector((state) => state.reducer.fiscalYear.fiscalYearId);

  const {
    data: accountingDocumentRecycleBinResult = { data: [] },
    isFetching: accountingDocumentRecycleBinIsFetching,
    error: accountingDocumentRecycleBinError,
    isLoading: accountingDocumentRecycleBinIsLoading,
  } = useGetAllAccountingDocumentRecycleBinQuery(obj
    , {
      skip: fiscalYear === 0 || Object.keys(obj).length === 0
    });
  useEffect(() => {
    if (accountingDocumentRecycleBinIsFetching) {
      setContent(<CircularProgress />);
    } else if (accountingDocumentRecycleBinError) {
      setContent(t("خطایی رخ داده است"));
    } else {
      setContent("");
      if (!!accountingDocumentRecycleBinResult?.header) {
        let pagination = JSON.parse(accountingDocumentRecycleBinResult?.header);
        setTotal(pagination.totalCount);
      }

      let tempData = accountingDocumentRecycleBinResult.data.map((data) => {
        return {
          ...data,
          DocumentNumber: data.documentNumber,
          DocumentType: data.documentDefinitionName,
          FolioNumber: data.folioNumber,
          RefNumber: data.refNumber,
          DocumentDate: new Date(data.documentDate),
          CreatedDate: new Date(data.createdDate)
        };
      });
      setData(tempData);
      dataRef.current = tempData;
    }
  }, [accountingDocumentRecycleBinIsFetching, accountingDocumentRecycleBinResult]);

  const dataRef = useRef();
  dataRef.current = data;
  const [excelData, setExcelData] = useState([]);
  const dataRef2 = useRef();
  dataRef2.current = excelData;

  const [actionList, setActionList] = useState([]);

  const navigate = useNavigate();

  let tempRequestData = [];

  const callBackComponent = () => {
    navigate(`/Accounting/Document`, { replace: false });
  };


  const [innerSearchOpen, setInnerSearchOpen] = useState(false);


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
      field: 'DocumentNumber',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "شماره سند",
      filter: 'numeric',
    },
    {
      field: 'FolioNumber',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "شماره عطف",
      filter: 'numeric',
    },
    {
      field: 'DocumentType',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "نوع سند",
    },
    {
      field: 'RefNumber',
      // columnMenu: ColumnMenu,
      filterable: true,
      name: "شماره ارجاع",
      filter: 'numeric',
    },
    {
      field: 'DocumentDate',
      // columnMenu: DateMenu,
      filterable: true,
      filter: "date",
      // format: "{0:d}",
      name: "تاریخ درج",
      cell: DateCell,
    },
    {
      field: 'CreatedDate',
      // columnMenu: DateMenu,
      filterable: true,
      filter: "date",
      // format: "{0:d}",
      name: "تاریخ حذف",
      cell: DateCell,
    },
    // {
    //     field: 'DocumentBalance',
    //     // columnMenu: ColumnMenu,
    //     filterable: true,
    //     name: "تراز",
    //     cell: CurrencyCell,
    //     // footerCell:CustomFooterSome,
    //     filter: 'numeric',
    // },
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



  const [anchorEl, setAnchorEl] = useState(null);


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
          loading={accountingDocumentRecycleBinIsLoading}
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
