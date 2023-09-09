import { React, useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import RKGrid,{ IndexCell } from "rkgrid";
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ArticlesGrid = (props) => {
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
  const [SearchParams] = useSearchParams();
  const id = SearchParams.get("id");
  const [selectedRows, SetSelectedRows] = useState();
  const appConfig = window.globalConfig;
  const [total, setTotal] = useState(0);
  const params = new URLSearchParams(location?.search);
  const obj = Object.fromEntries(params);
  const [content, setContent] = useState("");
  const [total2, setTotal2] = useState(0);
  const [datasource, setDatasource] = useState([]);
  const fiscalYear = useSelector(
    (state) => state.reducer.fiscalYear.fiscalYearId
  );

  const [articlesData, setArticlesData] = useState([]);

  useEffect(() => {
    let temp = [];

    props?.accountingDocumentArticlesResult?.map((data) => {
      data?.documentArticles?.map((x) => {
        temp?.push(x);
      });
    });

    setArticlesData(temp);
  }, [props?.accountingDocumentArticlesResult]);

  console.log("dataMammadArticles", articlesData);

  let tempColumn2 = [
    {
      field: "IndexCell",
      width: "60px",
      name: "ردیف",
      cell: IndexCell,
    },
    {
      field: "moeinAccountId",
      name: "معین",
    },
    {
      field: "detailed4Id",
      name: "تفضیلی سطح4",
    },
    {
      field: "detailed5Id",
      name: "تفضیلی سطح5",
    },
    {
      field: "detailed6Id",
      name: "تفضیلی سطح6",
    },
    {
      field: "notes",
      width: "600px",
      name: "توضیحات",
    },
    {
      field: "debits",
      name: "بدهکار",
    },
    {
      field: "credits",
      name: "بستانکار",
    },
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
          gridId={"AccountingDocumentsArticlesReports"}
          gridData={articlesData}
          columnList={tempColumn2}
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
          total={total2}
          showTooltip={true}
          // loading={accountingDocumentArticlesIsFetching}
          // getSelectedRows={getSelectedRows}
        />
      </div>
    </>
  );
};
export default ArticlesGrid;
