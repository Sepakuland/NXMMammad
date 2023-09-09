// import React, { useEffect, useState, useRef } from 'react'
//
//
// const MultiOrderPrint = (props) => {
//
//
//
//     return (
//         <div class="PrintPageLandScape" style={{'font-size': '10pt', 'line-height': '120%', 'font-weight': 'bold'}}>
//             <table style={{"width":"100%"}}>
//                 <tr>
//                     <td style={{"width":"99%"}}>
//                         <table style={{"width":"100%"}} cellPadding="1" cellSpacing="0">
//                             <tr style="">
//                                 <td colSpan="4" style={{"border-bottom":"2px solid #000"}}>
//                                     <table style={{"width":"100%"}} cellPadding="0" cellSpacing="0">
//                                         <tr>
//                                             <td style={{"width":"34%"}}>
//
//                                             </td>
//                                             <td style={{"width":"33%", 'text-align':'center', 'font-size':'120%', 'text-decoration':'underline'}}>
//                                                 صورتحساب فروش کالا و خدمات
//                                             </td>
//                                             <td style={{"width":"33%", 'text-align':'left'}}>
//                                                 <div style={{"float": "left"}}>
//                                                     <table style={{"font-size":"90%"}}>
//                                                         <tr>
//                                                             <td style={{"text-align": "left"}}>
//                                                                 شماره فاکتور :
//                                                             </td>
//                                                             <td style={{"text-align":"left"}}>
//                                                                 12949
//                                                             </td>
//                                                         </tr>
//                                                         <tr>
//                                                             <td style={{'text-align':'left'}}>
//                                                                 تاریخ :
//                                                             </td>
//                                                             <td style={{'text-align':'left'}}>
//                                                                 <span dir="ltr">1401/06/27</span>
//                                                             </td>
//                                                         </tr>
//                                                     </table>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     </table>
//                                 </td>
//                             </tr>
//                             <tr style="">
//                                 <td colSpan="4"
//                                     style={{"border-bottom":"2px solid #000", "border-right":"2px solid #000", "border-left":"2px solid #000", "font-size":"110%"}}>
//                                     مشخصات فروشنده
//
//
//                                         </td>
//                                         </tr>
//
//                                         <tr style={{"text-align": "right "}}>
//                                         <td style={{
//                                             "width": "1px",
//                                             "font-family": "inherit",
//                                             "border-right": "2px solid #000"
//                                         }}>&nbsp,<br />&nbsp,</td>
//                                         <td >
//                                         نام شخص حقیقی / حقوقی :
//                                         <span id="sellerName">
//                                         تست و دمو (شماره ثبت 19491)
//
//                                         </span>
//                                         </td>
//                                         <td>
//                                         <table cellpadding="0" cellspacing="0">
//                                         <tr style="height:15px">
//                                         <td style="width:100px, display:block,">
//                                         شماره اقتصادی :
//                                         </td>
//
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         3
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         2
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         1
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         5
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         6
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         4
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         2
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, width:15px, text-align:center,">
//
//                                         </td>
//                                         </tr>
//                                         </table>
//                                         </td>
//                                         <td style="border-left:2px solid #000,">
//                                         <table cellpadding="0" cellspacing="0">
//                                         <tr style="height:15px,">
//                                         <td style="width:120px, display:block,">
//                                         شماره ثبت/شماره ملی:
//                                         </td>
//
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         8
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         1
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         5
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         2
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         5
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         5
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         5
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         0
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         0
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         4
//                                         </td>
//                                         <td style="border:1px solid #000, width:15px, text-align:center,">
//                                         1
//                                         </td>
//                                         </tr>
//                                         </table>
//                                         </td>
//                                         </tr>
//                                         <tr style="text-align:right, ">
//                                         <td style="width:1px, font-family: inherit, border-right:2px solid #000, border-bottom:2px solid #000,">&nbsp,<br />&nbsp,</td>
//                                         <td style="border-bottom:2px solid #000,">
//                                         شماره تلفن / نمابر :
//                                         08338232247 /
//                                         </td>
//                                         <td style="border-bottom:2px solid #000,">
//                                         <table cellpadding="0" cellspacing="0">
//                                         <tr style="height:15px,">
//                                         <td style="width:100px, display:block,">
//                                         کد پستی 10رقمی :
//                                         </td>
//
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         4
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         1
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         7
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         7
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         7
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         7
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         3
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         1
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//                                         7
//                                         </td>
//                                         <td style="border:1px solid #000, width:15px, text-align:center,">
//                                         6
//                                         </td>
//                                         </tr>
//                                         </table>
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-left:2px solid #000,">
//                                         آدرس :
//                                         <span id="sellerAddress">
//                                         کرمانشاه - میدان آزادی - خ امیریه - خ گمرک - پلاک 165
//
//                                         </span>
//                                         </td>
//                                         </tr>
//
//                                         <tr style="">
//                                         <td colspan="4" style="border-bottom:2px solid #000, border-right:2px solid #000, border-left:2px solid #000, font-size:110%,">
//                                         مشخصات خریدار
//                                         </td>
//                                         </tr>
//                                         <tr style=" text-align:right,">
//                                         <td style="width:1px, font-family: inherit, border-right:2px solid #000,">&nbsp,<br />&nbsp,</td>
//                                         <td style="">
//                                         <span style="color:#000,"> نام شخص حقیقی / حقوقی :</span>
//                                         <span>تست  100</span>
//                                         </td>
//                                         <td>
//                                         <table cellpadding="0" cellspacing="0">
//                                         <tr style="height:15px,">
//                                         <td style="width:100px, display:block,">
//                                         <span style="color:#000,"> شماره اقتصادی :</span>
//                                         </td>
//
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, width:15px, text-align:center,">
//
//                                         </td>
//                                         </tr>
//                                         </table>
//                                         </td>
//                                         <td style="border-left:2px solid #000,">
//                                         <table cellpadding="0" cellspacing="0">
//                                         <tr style="height:15px,">
//                                         <td style="width:120px, display:block,">
//                                         <span style="color:#000,"> شماره ثبت/شماره ملی :</span>
//                                         </td>
//
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, width:15px, text-align:center,">
//
//                                         </td>
//                                         </tr>
//                                         </table>
//                                         </td>
//                                         </tr>
//                                         <tr style=" text-align:right,">
//                                         <td style="width:1px, font-family: inherit, border-right:2px solid #000, border-bottom:2px solid #000,">&nbsp,<br />&nbsp,</td>
//                                         <td style="border-bottom:2px solid #000,">
//                                         <span style="color:#000,"> شماره تلفن / نمابر :</span>
//                                         <span></span>
//                                         </td>
//                                         <td style="border-bottom:2px solid #000,">
//                                         <table cellpadding="0" cellspacing="0">
//                                         <tr style="height:15px,">
//                                         <td style="width:100px, display:block,">
//                                         <span style="color:#000,"> کد پستی 10رقمی :</span>
//                                         </td>
//
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, border-left:none, width:15px, text-align:center,">
//
//                                         </td>
//                                         <td style="border:1px solid #000, width:15px, text-align:center,">
//
//                                         </td>
//                                         </tr>
//                                         </table>
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-left:2px solid #000,">
//                                         <span style="color:#000,"> آدرس :</span>
//                                         <span></span>
//                                         </td>
//                                         </tr>
//                                         </table>
//                                         <table cellspacing="0" cellpadding="1" style={{"width":"100%"}}>
//
//                                         <thead>
//                                         <tr style="">
//                                         <td colspan="11" style="border-bottom:2px solid #000, border-left:2px solid #000, border-right:2px solid #000, font-size:110%,">
//                                         مشخصات کالا یا خدمات مورد معامله
//                                         <span style="font-weight:normal, font-size:90%,">
//
//                                         ( کلیه مبالغ به ریال می باشد )
//                                         </span>
//                                         </td>
//                                         </tr>
//                                         <tr style="">
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000, width:3%,">
//                                         ردیف
//                                         </td>
//
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000, width:6%,">
//                                         کد کالا
//                                         </td>
//
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000, width:30%,">
//                                         شرح کالا یا خدمت
//                                         </td>
//
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000, width:3%,">
//                                         تعداد
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000, width:6%,">
//                                         معادل
//                                         </td>
//
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000, width:6%,">
//                                         مبلغ واحد
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000, width:6%,">
//                                         مبلغ کل
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000, width:6%,">
//                                         مبلغ تخفیف
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000, width:6%,">
//                                         مبلغ کل <br />
//                                         پس از کسر تخفیف
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000, width:6%,">
//                                         جمع مالیات و عوارض
//                                         </td>
//
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000, border-left:2px solid #000, font-size:80%, width:9%,">
//                                         مبلغ کل پس از کسر تخفیف
//                                         بعلاوه <br />
//                                         جمع مالیات و عوارض
//                                         </td>
//                                         </tr>
//                                         </thead>
//                                         <tbody>
//
//                                         <tr class="OrderRow" style="">
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         1
//                                         </td>
//
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         50000300
//                                         </td>
//
//                                         <td name="StuffNameCell" style="border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         پت استوایی یک لیتری 10500 فروش
//                                         </td>
//
//                                         <td style="white-space:nowrap, border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         2 باکس
//                                         </td>
//                                         <td style="white-space:nowrap, border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         12 عدد
//                                         </td>
//
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         120,000
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         1,440,000
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         0
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         1,440,000
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         129,600
//                                         </td>
//
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000, border-left:2px solid #000,">
//                                         1,569,600
//                                         </td>
//                                         </tr>
//
//                                         <tr style="font-weight:bold, ">
//                                         <td colspan="3" style="color:#000, text-align:right,border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         جمع کل :
//                                         </td>
//
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         2
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         12
//                                         </td>
//
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         1,440,000
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         0
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         1,440,000
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         129,600
//                                         </td>
//
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000, border-left:2px solid #000,">
//                                         1,569,600
//                                         </td>
//                                         </tr>
//
//                                         <tr>
//                                         <td colspan="8" style={{'text-align':'left', color:#000, text-align:right,border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         مبلغ نهایی به حروف: یک میلیون و پانصد و شصت و نه هزار و ششصد  ریال
//                                         </td>
//                                         <td colspan="2" style={{'text-align':'left', color:#000, text-align:right,border-bottom:2px solid #000, border-right:2px solid #000,">
//                                         <span style="float:left,">مبلغ نهایی:</span>
//                                         </td>
//                                         <td style="border-bottom:2px solid #000, border-right:2px solid #000, border-left:2px solid #000,">
//                                         1,569,600
//                                         </td>
//                                         </tr>
//
//                                         <tr style="text-align:right,">
//                                         <td colspan="11" style="border-bottom:2px solid #000, border-right:2px solid #000, border-left:2px solid #000,">
//                                         <table style={{"width":"100%"}} cellpadding="0" cellspacing="0">
//                                         <tr style="">
//                                         <td style="padding:0 0px 0 20px,">
//                                         شرایط و نحوه فروش :
//                                         </td>
//                                         <td style="padding:0 20px 0 20px,">
//                                         <img src="../../../../Content/Image/CheckedCheckBox.png" style="position:relative, top:3px," />
//                                         نقدی
//                                         </td>
//                                         <td style="padding:0 20px 0 20px,">
//                                         <img src="../../../../Content/Image/UnCheckedCheckBox.png" style="position:relative, top:3px," />
//                                         غیر نقدی
//                                         </td>
//                                         <td style="padding:0 20px 0 20px,">
//                                         مهلت تسویه: 1 روز
//                                         </td>
//                                         </tr>
//                                         </table>
//                                         </td>
//                                         </tr>
//
//
//                                         <tr style="">
//                                         <td colspan="11" style="border-bottom:2px solid #000, border-right:2px solid #000, border-left:2px solid #000,">
//                                         <table style={{"width":"100%"}}>
//                                         <tr style="text-align:right, vertical-align:top,">
//                                         <td style="50%, height:40px,">
//                                         مهر و امضاء فروشنده
//                                         </td>
//                                         <td style="50%,">
//                                         مهر و امضاء خریدار
//                                         </td>
//                                         </tr>
//                                         </table>
//                                         </td>
//                                         </tr>
//                                         </tbody>
//                                         </table>
//
//                                         &nbsp&nbsp&nbsp&nbsp
//                                         <tr style="text-align:right,">
//                                         <td colspan="11">
//                                         <span style=""> شرح تاییدیه تحویل کالا:</span>
//                                         <span style="">فقط برای تست<br /></span>
//                                         </td>
//                                         </tr>
//
//                                         <tr style="text-align:right,">
//                                         <td colspan="11">
//                                         &nbsp&nbsp&nbsp&nbsp
//                                         </td>
//                                         </tr>
//                                         <tr style="text-align:right,">
//                                         <td colspan="11">
//                                         <span style="">شرح تسویه فاکتور: </span>
//                                         <span style="">شماره شبا ir670150000003100002310776
//                                         خورشید تجارت زاگرس بانک سپه<br /></span>
//                                         </td>
//                                         </tr>
//
//                                         </td>
//                                         </tr>
//                                         </table>
//                                         </div>
//
//         )
// }
// export default MultiOrderPrint