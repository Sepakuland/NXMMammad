// import './wdyr'; // <--- first import

import { HashRouter } from 'react-router-dom';

// scroll bar
import '../../../../node_modules/simplebar/dist/simplebar.css';

// third-party
import { Provider as ReduxProvider } from 'react-redux';

// apex-chart
import './assets/third-party/apex-chart.css';
// import { backend } from './utils/backend';
// project import
import { store } from './store/store';
import Main from './main';
import './shared-lib-header-and-sidebar.module.css';

export function SharedLibHeaderAndSidebar() {
  return (
    <ReduxProvider store={store}>
      <HashRouter>
        <Main />
      </HashRouter>
    </ReduxProvider>
  );
}

export default SharedLibHeaderAndSidebar;
