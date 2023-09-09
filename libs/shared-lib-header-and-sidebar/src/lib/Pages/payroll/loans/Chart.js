import React, { useEffect, useState } from "react";
import data2 from "./salaryData.json";
import { useTranslation } from "react-i18next";
import ChartPage from "../../../components/chart/ChartPage";

function Chart() {
    const [data, setData] = useState([]);

    const { t, i18n } = useTranslation();

    const [savedCharts, setSavedCharts] = useState([
        { title: "تست 1", dashboard: false },
        { title: "تست 2", dashboard: true },
    ]);

    useEffect(() => {
        let tempData = data2.map((data) => {
            let temp = data.LoanAmount.toString().replaceAll(",", "");
            let cost = parseFloat(temp, 2);
            let temp2 = data.Installment_Amount.toString().replaceAll(",", "");
            let cost2 = parseFloat(temp2, 2);

            return {
                ...data,
                LoanAmount: cost,
                Installment_Amount: cost2,
                Installment_Count: parseInt(data.Installment_Count),
                PersonnelCode: parseInt(data.PersonnelCode),
                Installment_CountInstalled: parseInt(data.Installment_CountInstalled),
                Installment_CountRemained: parseInt(data.Installment_CountRemained),
                ReceiptDate: (new Date(data.ReceiptDate)),
            };
        });
        setData(tempData);
    }, [i18n.language]);

    console.log("data", data);

    const columnsObj = [
        { value: "LoanTitle", title: t("عنوان") },
        { value: "PersonnelCode", title: t("کد پرسنل") },
        { value: "PersonnelName", title: t("نام پرسنل") },
        { value: "ReceiptDate", title: t("تاریخ دریافت") },
        { value: "LoanAmount", title: t("مبلغ وام") },
        { value: "Installment_Amount", title: t("مبلغ قسط") },
        { value: "Installment_Count", title: t("تعداد قسط") },
        { value: "Installment_CountInstalled", title: t("تسویه شده") },
        { value: "Installment_CountRemained", title: t("باقی مانده") },
        { value: "Installment_Start", title: t("شروع") },
        { value: "Installment_End", title: t("پایان") }
    ];

    const chartObj = [
        { value: "LoanTitle", title: t("عنوان") },
        { value: "PersonnelCode", title: t("کد پرسنل") },
        { value: "PersonnelName", title: t("نام پرسنل") },
        { value: "ReceiptDate", title: t("تاریخ دریافت") },
        { value: "LoanAmount", title: t("مبلغ وام") },
        { value: "Installment_Amount", title: t("مبلغ قسط") },
        { value: "Installment_Count", title: t("تعداد قسط") },
        { value: "Installment_CountInstalled", title: t("تسویه شده") },
        { value: "Installment_CountRemained", title: t("باقی مانده") },
        { value: "Installment_Start", title: t("شروع") },
        { value: "Installment_End", title: t("پایان") }
    ];

    return (
        <>
            <ChartPage
                data={data}
                columnsObj={columnsObj}
                chartObj={chartObj}
                savedCharts={savedCharts}
            />
        </>
    );
}

export default Chart;
