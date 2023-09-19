// import * as React from "react";
// import Checkbox from "@mui/material/Checkbox";
// import { useState } from "react";
// import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
// import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import { useGetDetailedAccount_DetailedTypeIdQuery } from "../../../../features/slices/accountingDocumentSlice";
// import { SelectBox } from "devextreme-react";
// import { useTranslation } from "react-i18next";
// import {
//   FormControl,
//   Input,
//   ListItemText,
//   MenuItem,
//   Select,
// } from "@mui/material";
// import { useFormik } from "formik";

// const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
// const checkedIcon = <CheckBoxIcon fontSize="small" />;

// export default function MultipleSelectChips() {
//   const { t, i18n } = useTranslation();

//   const formik = useFormik({
//     initialValues: {
//       detailedAccount: "",
//       detailedType: [],
//     },
//     onSubmit: (values) => {
//       console.log("here", values);
//     },
//   });

//   const [selectedOptions, setSelectedOptions] = useState(0);
//   const [selected, setSelected] = useState([]);

//   const { data: accountingDocumentResult } =
//     useGetDetailedAccount_DetailedTypeIdQuery(selectedOptions);

//   const handleChange = (event) => {
//     formik.setFieldValue("detailedType", event.target.value);

//     let temp;
//     if (event.target.value?.length == 1) {
//       if (event.target.value[0] == 1) {
//         temp = 1;
//       } else if (event.target.value[0] == 2) {
//         temp = 2;
//       } else if (event.target.value[0] == 3) {
//         temp = 3;
//       }
//     } else if (event.target.value?.length == 2) {
//       if (
//         (event.target.value[0] == 1 && event.target.value[1] == 2) ||
//         (event.target.value[0] == 2 && event.target.value[1] == 1)
//       ) {
//         temp = 4;
//       } else if (
//         (event.target.value[0] == 1 && event.target.value[1] == 3) ||
//         (event.target.value[0] == 3 && event.target.value[1] == 1)
//       ) {
//         temp = 5;
//       } else if (
//         (event.target.value[0] == 2 && event.target.value[1] == 3) ||
//         (event.target.value[0] == 3 && event.target.value[1] == 2)
//       ) {
//         temp = 6;
//       }
//     } else if (event.target.value?.length == 3) {
//       temp = 7;
//     } else {
//       temp = 0;
//       console.log(
//         "داااااااااااااری چییییییییییییییییی کار میکنننننننننننننننی!!!!!!!!!!"
//       );
//       console.log("temp", temp);
//     }
//     setSelectedOptions(temp);
//   };
//   console.log("selectedOption", selectedOptions);

//   const detailedAccount = [
//     { title: "تفضیلی4", id: 1, checked: false },
//     { title: "تفضیلی5", id: 2, checked: false },
//     { title: "تفضیلی6", id: 3, checked: false },
//   ];
//   return (
//     <>
//       <form onSubmit={formik.handleSubmit}>
//       <div className="row">
//       <div className="content col-lg-12 col-md-6 col-sx-6">
//         <div className="title">
//           <span> {t("نوع تفضیلی")} :</span>
//         </div>
//         <div className="wrapper">
//         <FormControl
//           className={"form-input p-0"}
//           sx={{ direction: i18n.dir(), width: "100%" }}
//         >
//           <Select
//             labelId="demo-mutiple-checkbox-label"
//             id="demo-mutiple-checkbox"
//             className={i18n.dir() === "rtl" ? "rtl-select" : ""}
//             multiple
//             value={formik.values?.detailedType}
//             onChange={handleChange}
//             input={<Input />}
//             renderValue={(selected) => {
//               let temp = [];
//               selected?.forEach((item) => {
//                 let obj = detailedAccount?.find((f) => f.id === item);
//                 temp.push(obj?.title);
//               });
//               return temp.join(" , ");
//             }}
//             sx={{
//               direction: i18n.dir(),
//               width: "100%",
//               "&:before": { display: "none" },
//               "&:after": { display: "none" },
//             }}
//           >
//             {detailedAccount?.map((item) => (
//               <MenuItem
//                 key={item?.id}
//                 value={item?.id}
//                 sx={{
//                   direction: i18n.dir(),
//                   textAlign: i18n.dir() === "rtl" ? "right" : "left",
//                 }}
//               >
//                 <Checkbox
//                   checked={formik.values?.detailedType?.indexOf(item?.id) > -1}
//                   size={"small"}
//                   sx={{ direction: i18n.dir(), padding: "5px" }}
//                 />
//                 <ListItemText
//                   className={"multiselect-text"}
//                   primary={item.title}
//                   sx={{ direction: i18n.dir() }}
//                 />
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         </div>
//         </div>
//         <div className="content col-lg-12 col-md-6 col-sx-6">
//         <div className="title">
//           <span> {t("تفضیلی")} :</span>
//         </div>
//         <div className="wrapper">
//         <SelectBox
//           dataSource={accountingDocumentResult?.data}
//           searchEnabled
//           valueExpr="detailedAccountName"
//           className="selectBox"
//           displayExpr={function (item) {
//             return (
//               item && item.detailedAccountCode + "- " + item.detailedAccountName
//             );
//           }}
//           displayValue="detailedAccountCode"
//           rtlEnabled={i18n.dir() == "ltr" ? false : true}
//           itemRender={null}
//           placeholder=""
//         ></SelectBox>
//         </div>
//         </div>
//       </div>
//       </form>
//     </>
//   );
// }
