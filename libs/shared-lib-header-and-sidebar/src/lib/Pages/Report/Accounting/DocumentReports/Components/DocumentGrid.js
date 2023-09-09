import { React, useRef, useState } from "react";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import RKGrid, { IndexCell,DateCell } from "rkgrid";

const DocumentGrid = (props) => {
  console.log("props",props)
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const dataRef = useRef();
  const location = useLocation();
  const [data, setData] = useState([]);
  dataRef.current = data;
  const [data2, setData2] = useState([]);
  const data2Ref = useRef();
  data2Ref.current = data2;
  const [loading, setLoading] = useState(false);
 
  const [selectedRows, SetSelectedRows] = useState();
  const appConfig = window.globalConfig;

  const params = new URLSearchParams(location?.search);
  const obj = Object.fromEntries(params);
  const [content, setContent] = useState("");
  const [total, setTotal] = useState(0);
  const [datasource, setDatasource] = useState([]);
  const fiscalYear = useSelector(
    (state) => state.reducer.fiscalYear.fiscalYearId
  );
  

console.log("props",props)







 // article grid
//  useEffect(() => {
//   if (accountingDocumentArticlesIsFetching) {
//     setContent(<CircularProgress />);
//   } else if (accountingDocumentArticlesError) {
//     setContent(t("خطایی رخ داده است"));
//   } else {
//     setContent("");
//     if (!!accountingDocumentArticlesResult?.header) {
//       let pagination = JSON.parse(accountingDocumentArticlesResult?.header);
//       setTotal(pagination.totalCount);
//     }

//     let tempData = accountingDocumentArticlesResult.data.map((data) => {
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
//         DocumentNumber: data.documentNumber,
//         DocumentDate: new Date(data.documentDate),
//         DocumentTypeId: data.documentDefinitionName,
//         RefNumber: data.refNumber,
//         CreatedByUser: data.createdByUser,
//         FolioNumber: data.folioNumber,
//         SubsidiaryNumber: data.subsidiaryNumber,
//         DailyNumber: data.dailyNumber,
//         ModifiedByUser: data.modifiedByUser,
//         DocumentState: documentState,
//         DocumentDescription: data.documentDescription
//       };
//     });
//     setData(tempData);
//   }
// }, [accountingDocumentArticlesIsFetching,accountingDocumentArticlesResult,AccountDocumentsArticleCurrentData]);

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
    field: "documentTypeId",
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
    name: "ش عطف",
  },
  {
    field: "subsidiaryNumber",
    filterable: true,
    name: "ش فرعی",
  },
  {
    field: "dailyNumber",
    filterable: true,
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
];



  return (
    <>
      <div
        style={{
          backgroundColor: `${theme.palette.background.paper}`,
          padding: "20px",
        }}
      >
        <RKGrid
          gridId={"AccountingDocumentsReports"}
          gridData={props.accountingDocumentArticlesResult}
          columnList={tempColumn}
          showSetting={true}
          showChart={false}
          showExcelExport={false}
          showPrint={false}
          rowCount={10}
          sortable={false}
          pageable={true}
          reorderable={false}
          selectable={false}
          // showAdd={true}
          // addUrl={`/baseInformation/accounting/FiscalYear/AddFiscalYear`}
          // addTitle={t("جدید")}
          // selectKeyField={"YearId"}
          showFilter={true}
          total={total}
          showTooltip={true}
          // loading={accountingDocumentArticlesIsFetching}
          // getSelectedRows={getSelectedRows}
        />
      </div>
    </>
  );
};
export default DocumentGrid;
