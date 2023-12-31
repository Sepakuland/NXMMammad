// assets
import {
  IconHome,
  IconFileCheck,
  IconFileChart,
  IconHomeDot,
  IconReceipt,
  IconBrandMastercard,
  IconShoppingCart,
  IconTags,
  IconCheckbox,
  IconShoppingCartOff,
  IconFileLike,
  IconFileUpload,
  IconReceiptRefund,
  IconArrowBackUp,
  IconFileDiff,
  IconFileInvoice,
  IconCertificate2,
  IconClipboardList,
  IconCheckupList,
  IconFileDollar,
  IconReceipt2,
  IconBuildingWarehouse,
  IconBriefcase,
} from '@tabler/icons';

// icons
const icons = {
  IconHome,
  IconFileCheck,
  IconFileChart,
  IconHomeDot,
  IconReceipt,
  IconBrandMastercard,
  IconShoppingCart,
  IconTags,
  IconCheckbox,
  IconShoppingCartOff,
  IconFileLike,
  IconFileUpload,
  IconReceiptRefund,
  IconArrowBackUp,
  IconBriefcase,
  IconFileDiff,
  IconFileInvoice,
  IconCertificate2,
  IconClipboardList,
  IconCheckupList,
  IconFileDollar,
  IconReceipt2,
  IconBuildingWarehouse,
};
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
const wareHouse = {
  id: 'wareHouse',
  title: 'WareHouse',
  type: 'MegaGroup',
  icon: icons.IconHome,
  children: [
    {
      id: 'OperationNumbers',
      title: 'Operation Numbers',
      type: 'group',
      // url: '/WareHouse/MaintenanceCenters',
      icon: icons.IconFileDiff,
      breadcrumbs: true,
      children: [
        {
          id: 'WarehouseReceipt',
          title: 'Warehouse receipt',
          type: 'item',
          // url: '/WareHouse/MaintenanceCenters',
          icon: icons.IconReceipt,
          breadcrumbs: true,
        },
        {
          id: 'WarehouseTransfer',
          title: 'Warehouse Transfer',
          type: 'item',
          // url: '/WareHouse/MaintenanceCenters',
          icon: icons.IconFileInvoice,
          breadcrumbs: true,
        },
        {
          id: 'ReferenceLicense',
          title: 'Reference License',
          type: 'item',
          // url: '/WareHouse/MaintenanceCenters',
          icon: icons.IconCertificate2,
          breadcrumbs: true,
        },
        {
          id: 'ProductRequest',
          title: 'Product Request',
          type: 'item',
          // url: '/WareHouse/MaintenanceCenters',
          icon: icons.IconClipboardList,
          breadcrumbs: true,
        },
        {
          id: 'ReserveBalance',
          title: 'Reserve Balance',
          type: 'item',
          // url: '/WareHouse/MaintenanceCenters',
          icon: icons.IconCheckupList,
          breadcrumbs: true,
        },
      ],
    },
    {
      id: 'OperationRial',
      title: 'Operation Rial',
      type: 'group',
      // url: '/WareHouse',
      icon: icons.IconFileDollar,
      breadcrumbs: true,
      children: [
        {
          id: 'WarehouseReceiptCartable',
          title: 'Warehouse Receipt Cartable',
          type: 'item',
          // url: '/baseInformation/WareHouse/MaintenanceCenters',
          icon: icons.IconReceipt2,
          breadcrumbs: true,
        },
        {
          id: 'WarehouseTransferCartable ',
          title: 'Warehouse Transfer Cartable',
          type: 'item',
          // url: '/baseInformation/WareHouse/MaintenanceCenters',
          icon: icons.IconBriefcase,
          breadcrumbs: true,
        },
      ],
    },
  ],
};

export default wareHouse;
