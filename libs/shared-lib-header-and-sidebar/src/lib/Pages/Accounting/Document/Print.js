import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useGetGeneralDocumentsPrintQuery } from "../../../features/slices/GeneralDocumentSlice";
import { CreateQueryString } from "../../../utils/createQueryString";
import SinglePrint from "./SinglePrint";

const PrintPage = () => {
  /* ------------------------ Getting The IDs for Print ----------------------- */
  const location = useLocation();
  const params = new URLSearchParams(location?.search);
  const obj = Object.fromEntries(params);

  /* -------------------------------------------------------------------------- */
  /*                              RTKQuery / Redux                              */
  /* -------------------------------------------------------------------------- */

  /* --------------------------------- Queries -------------------------------- */
  const {
    data: generalDocumentPrintData,
    isFetching: generalDocumentPrintIsFetching,
    error: generalDocumentPrintError,
  } = useGetGeneralDocumentsPrintQuery(
    CreateQueryString({ GeneralDocumentId: obj.id.split(",") })
  );

  const { t, i18n } = useTranslation();
  const [datasource, setDatasource] = useState([
    {
      generalDocumentNumber: 0,
      documentDescription: "لطفا تا زمان بارگذاری اطلاعات صبور باشید",
      generalDocumentArticles: [],
    },
  ]);
  const dataRef = useRef();
  dataRef.current = datasource;

  useEffect(() => {
    if (!generalDocumentPrintIsFetching && !generalDocumentPrintError) {
      setDatasource(generalDocumentPrintData);
    }
  }, [generalDocumentPrintIsFetching]);

  return (
    <>
      {datasource?.map((data, index) => (
        <>
          <SinglePrint printData={data} key={index} showZoom={index == 0} />
          <div
            className="printPageNumber"
            style={{ direction: `${i18n.dir()}` }}
          >
            {index + 1} از {datasource.length}
          </div>
        </>
      ))}
    </>
  );
};
export default PrintPage;
