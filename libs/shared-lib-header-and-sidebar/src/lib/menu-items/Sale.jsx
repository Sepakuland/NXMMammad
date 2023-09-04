// assets
import {
  IconTags,
  IconClipboardText,
  IconClipboardCheck,
  IconFileX,
  IconFileLike,
  IconHeadset,
} from "@tabler/icons";
// icons
const icons = {
  IconTags,
  IconClipboardText,
  IconClipboardCheck,
  IconFileX,
  IconFileLike,
  IconHeadset,
};
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
const Sale = {
  id: "Sale",
  title: "Sale",
  type: "MegaGroup",
  icon: icons.IconTags,
  children: [
    {
      id: "proformaSaleInvoice",
      title: "Proforma Sale Invoice",
      type: "item",
      url: "/Sell/Order",
      icon: icons.IconClipboardText,
      breadcrumbs: true,
    },
    {
      id: "saleConfirmation",
      title: "Sale Confirmation",
      type: "item",
      url: "/Sell/saleConfirmation",
      icon: icons.IconFileLike,
      breadcrumbs: true,
    },
    {
      id: "sellReversion",
      title: "Sale Reversion",
      type: "item",
      url: "/Sell/sellReversion",
      icon: icons.IconFileX,
      breadcrumbs: true,
    },
    {
      id: "saleReversionConfirmation",
      title: "Sale Reversion Confirmation",
      type: "item",
      url: "/Sell/sellReversionConfirmation",
      icon: icons.IconClipboardCheck,
      breadcrumbs: true,
    },
    {
      id: "salePhoneVisit",
      title: "Sale Phone Visit",
      type: "item",
      url: "/Sell/sellPhone",
      icon: icons.IconHeadset,
      breadcrumbs: true,
    },
  ],
};

export default Sale;
