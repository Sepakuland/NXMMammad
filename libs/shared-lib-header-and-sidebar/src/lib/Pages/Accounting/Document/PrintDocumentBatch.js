import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetAccountingDocumentsPrintQuery } from "../../../features/slices/accountingDocumentSlice";
import { CreateQueryString } from "../../../utils/createQueryString";
import { useLocation } from "react-router-dom";
import PrintSingleDoc from "./PrintSingleDoc";
import { useSearchParams } from "react-router-dom";

const PrintDocumentBatch = () => {
  const location = useLocation();
  const params = new URLSearchParams(location?.search);
  const obj = Object.fromEntries(params);
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState([]);

  const datasource = JSON.parse(localStorage.getItem(`printList`));

  const documentId = datasource.map((data) => data.documentId);

  const {
    data: accountingDocumentPrintData,
    isFetching: accountingDocumentPrintIsFetching,
    error: accountingDocumentPrintError,
  } = useGetAccountingDocumentsPrintQuery(
    CreateQueryString({ DocumentId: documentId })
  );

  return (
    <>
      {accountingDocumentPrintData?.map((datas, index) => (
        <PrintSingleDoc key={index} accountingDocumentPrintData={datas} />
      ))}
    </>
  );
};

export default PrintDocumentBatch;
