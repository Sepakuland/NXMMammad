import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import dataForGrid from "./PrintTicketSalaryBillsIssuance.json";
import { useSearchParams } from "react-router-dom";
import PrintMap from "./PrintMap";

const PrintPage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;

  useEffect(() => {
 
    setData(dataForGrid);
  }, [i18n==lang]);

  return (
    <>
      <div className="p-3 print-page">
        {data.map((item, index) => (
          <PrintMap printData={item} key={index} />
        ))}
      </div>
    </>
  );
};
export default PrintPage;
