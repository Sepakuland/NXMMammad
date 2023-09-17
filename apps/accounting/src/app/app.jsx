// eslint-disable-next-line @typescript-eslint/no-unused-vars
import './app.module.css';
import { SharedLibHeaderAndSidebar } from '@kara-erp/shared-lib-header-and-sidebar';
// import { calenderLang } from '@kara-erp/shared-lib-header-and-sidebar';
// import '@kara-erp/shared-lib-header-and-sidebar/';
// import { MyComponent } from '@kara-erp/shared-lib-header-and-sidebar'
import { MyComponent } from '@kara-erp/shared-lib-header-and-sidebar';

export function App() {
  return (
    <div>
      {/* <NxWelcome title="accounting" /> */}
      <SharedLibHeaderAndSidebar />
      {/* <MyComponent /> */}
    </div>
  );
}

export default App;
