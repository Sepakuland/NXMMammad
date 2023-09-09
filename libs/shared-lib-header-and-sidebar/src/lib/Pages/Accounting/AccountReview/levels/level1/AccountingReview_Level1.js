import React, { useEffect, useRef, useState } from "react";
import { useGetAllCustomerChosenCodingsWithMoeinAccounts_GroupQuery } from "../../../../../features/slices/customerChosenCodingSlice";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@mui/material";
import Guid from "devextreme/core/guid";
import ActionCellMain from "../../ActionCellMain";
import RKGrid, { FooterSome, CurrencyCell, TotalTitle } from "rkgrid";

const AccountingReview_Level1 = ({
  location,
  GetSelectedId,
  GetAccountingReview,
  querySearchParams,
  GetStatus,
}) => {
  const { t, i18n } = useTranslation();
  const [rowData, setRowData] = useState([]);
  const [datasource, setDatasource] = useState([]);
  const [loading, setLoading] = useState(true);
  let Remainder;
  const params = new URLSearchParams(location);
  const obj = Object.fromEntries(params);
  const [content, setContent] = useState("");
  const [total, setTotal] = useState(0);
  const dataRef = useRef();
  
  dataRef.current = datasource;

  const {
    data: customerGroupResult,
    isFetching: customersGroupIsFetching,
    error: customersGroupError,
    currentData: customersGroupCurrentData,
  } = useGetAllCustomerChosenCodingsWithMoeinAccounts_GroupQuery(
    querySearchParams
  );
  useEffect(() => {
    setLoading(true);
    if (customersGroupIsFetching) {
      setContent(<CircularProgress />);
    } else if (customersGroupError) {
      setContent(t("خطایی رخ داده است"));
    } else {
      setContent("");
      let tempData = customerGroupResult?.data.map((data, index) => {
        Remainder =
          data?.accountingDocumentArticleDebits -
          data?.accountingDocumentArticleCredits;
        return {
          id: new Guid(),
          formersNames: data?.formersNames,
          CompleteCode: data?.completeCode,
          AccountCodeGroup: data?.codingParentParent?.code,
          AccountNameGroup: data?.codingParentParent?.name,
          AccountCodeTotal: data?.codingParent?.code,
          AccountNameTotal: data?.codingParent?.name,
          AccountNameSpecific: data?.name,
          AccountCodeSpecific: data?.code,
          AccountCodeEntity4: "",
          AccountCodeEntity5: "",
          AccountCodeEntity6: "",
          CycleDebtor: data?.accountingDocumentArticleDebits,
          CycleCreditor: data?.accountingDocumentArticleCredits,
          RemainderDebtor: Remainder > 0 ? Math.abs(Remainder) : 0,
          RemainderCreditor: Remainder <= 0 ? Math.abs(Remainder) : 0,
          CodingId: data?.codingId,
          DetailedTypeIds4: data?.detailedType4Ids,
          DetailedTypeIds5: data?.detailedType5Ids,
          DetailedTypeIds6: data?.detailedType6Ids,
          AccountReviewLevel: 1,
        };
      });
      setRowData(tempData);
      dataRef.current = tempData;
    }
  }, [customersGroupIsFetching, location, customersGroupCurrentData]);

  useEffect(() => {
    let PageSize = parseInt(obj?.PageSize);
    let PageNumber = parseInt(obj?.PageNumber);
    setTotal(rowData?.length);
    var rec = rowData?.slice(
      PageSize * (PageNumber - 1),
      PageSize * (PageNumber - 1) + PageSize
    );
    setDatasource(rec);
    if (!customersGroupIsFetching) {
      setLoading(false);
    }
  }, [location, rowData]);

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );
  const CustomActionCellMain = (props) => (
    <ActionCellMain {...props} GetStatus={GetStatus} />
  );
  let ReviewColumn = [
    {
      field: "CompleteCode",
      filterable: false,
      width: "50px",
      name: "کد",
      // cell: IndexCell,
      sortable: false,
      footerCell: TotalTitle,
      reorderable: false,
    },
    {
      field: "AccountNameGroup",
      name: "مرور گروه",
      filterable: true,
      width: "80px",
    },
    {
      field: "CycleDebtor",
      filterable: true,
      name: "جمع بدهکار",
      filter: "numeric",
      width: "100px",
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
    },
    {
      field: "CycleCreditor",
      filterable: true,
      name: "جمع بستانکار",
      filter: "numeric",
      width: "100px",
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
    },
    {
      field: "RemainderDebtor",
      filterable: true,
      name: "مانده بدهکار",
      filter: "numeric",
      width: "100px",
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
    },
    {
      field: "RemainderCreditor",
      filterable: true,
      name: "مانده بستانکار",
      filter: "numeric",
      width: "90px",
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
    },
    {
      field: "actionCell",
      filterable: false,
      width: "80px",
      name: "گردش حساب",
      cell: CustomActionCellMain,
      className: "text-center",
      reorderable: false,
    },
  ];
  function getSelectedRows(list) {
    if (list?.length) {
      if (!!list[0]?.CodingId) {
        GetSelectedId(list[0]?.CodingId);
        GetAccountingReview(list);
      } else {
        GetAccountingReview([]);
      }
    } else {
      GetAccountingReview([]);
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               export to excel                              */
  /* -------------------------------------------------------------------------- */
  const [excelData, setExcelData] = useState();
  useEffect(() => {
    if (!!datasource?.length) {
      setExcelData(rowData);
    }
  }, [datasource]);

  return (
    <RKGrid
      gridId={"AccountReview_Level1"}
      gridData={datasource}
      excelData={excelData}
      columnList={ReviewColumn}
      showSetting={true}
      showChart={false}
      showExcelExport={true}
      showPrint={true}
      showFilter={false}
      rowCount={5}
      sortable={true}
      pageable={true}
      reorderable={true}
      selectable={true}
      selectKeyField={"id"}
      selectionMode={"single"}
      getSelectedRows={getSelectedRows}
      excelFileName={t("مرور گروه")}
      loading={loading}
      total={total}
    />
  );
};

export default AccountingReview_Level1;
