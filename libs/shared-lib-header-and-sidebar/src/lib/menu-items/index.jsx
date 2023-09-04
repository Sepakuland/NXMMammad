// project import
import pages from './pages';
import dashboard from './dashboard';
import accessories from './accessories';
import accounting from './accounting';
import baseInformation from './baseInformation';
import purchase from './purchase';
import financialTransaction from './financialTransaction';
import guide from './guide';
import payroll from './payroll';
import reports from './reports';
import seasonalReports from './seasonalReports';
import Sale from './Sale';
import SMS from './SMS';
import wareHouse from './wareHouse';
import mainDashboard from './mainDashboard';
import setting from './setting';
// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    items: [
        mainDashboard,
        accounting,
        financialTransaction,
        wareHouse,
        purchase,
        Sale,
        payroll,
        reports,
        baseInformation,
        SMS,
        seasonalReports,
        accessories,
        guide,
        dashboard,
        pages,
        setting
    ]
};

export default menuItems;
