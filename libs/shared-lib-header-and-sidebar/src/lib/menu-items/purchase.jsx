// assets

import {
  IconShoppingCartPlus,
  IconListDetails,
  IconShoppingCart,
  IconShoppingCartOff,
  IconCheckbox,
} from "@tabler/icons";
// icons
const icons = {
  IconShoppingCartPlus,
  IconListDetails,
  IconShoppingCart,
  IconShoppingCartOff,
  IconCheckbox,
};
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
const purchase = {
  id: "purchase",
  title: "Purchase",
  type: "MegaGroup",
  icon: icons.IconShoppingCart,
  children: [
    {
      id: "needs",
      title: "Needs",
      type: "item",
      url: "/buy/Needs",
      icon: icons.IconListDetails,
      breadcrumbs: true,
    },
    {
      id: "order",
      title: "Order",
      type: "item",
      url: "/buy/order",
      icon: icons.IconShoppingCartPlus,
      breadcrumbs: true,
    },
    {
      id: "orderConfirmation",
      title: "Order Confirmation",
      type: "item",
      url: "/buy/orderConfirmation",
      icon: icons.IconCheckbox,
      breadcrumbs: true,
    },
    {
      id: "returnedPurchase",
      title: "Return from Purchase",
      type: "item",
      url: "/buy/returnedPurchase",
      icon: icons.IconShoppingCartOff,
      breadcrumbs: true,
    },
    {
      id: "approvedReturnedPurchase",
      title: "Approved Return from Purchase",
      type: "item",
      url: "/buy/approvedReturnedPurchase",
      icon: icons.IconCheckbox,
      breadcrumbs: true,
    },
  ],
};

export default purchase;
