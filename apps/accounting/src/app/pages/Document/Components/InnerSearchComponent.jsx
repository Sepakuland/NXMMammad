import { Box } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import InnerSearchDocument from "./InnerSearchComponentDocument";
import DocumentControl from "../Inner Grids/ControlGrid/DocumentControl";

export default function InnerSearch({ getData, closeModal }) {
  const { t, i18n } = useTranslation();

  const [definedAccountOpen, setDefinedAccountOpen] = useState(false);
  const [detailedOpen, setDetailedOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      definedAccount: "",
      detailed: "",
      debtorStart: "",
      debtorEnd: "",
      creditorStart: "",
      creditorEnd: "",
      articleDescription: "",
    },
    onSubmit: (values) => {
      getData(values);
      closeModal();
    },
  });
  function getValues(value) {
    console.log("vvvvvvvv", value);
    getData(value);
  }

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%", typography: "body1", padding: "10px" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              centered
              onChange={handleChange}
              aria-label="lab API tabs example"
            >
              <Tab
                label="جست‌و‌جو بر اساس سند"
                value="1"
                sx={{ width: "50%" }}
              />
              <Tab
                label="جست‌و‌جو بر اساس آرتیکل‌ها"
                value="2"
                sx={{ width: "50%" }}
              />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ padding: "24px 10px 0" }}>
            <DocumentControl
              onClose={() => closeModal()}
              getValues={getValues}
            />
          </TabPanel>
          <TabPanel value="2" sx={{ padding: "24px 10px 0" }}>
            <InnerSearchDocument  onClose={() => closeModal()} getValues={getValues} />
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
