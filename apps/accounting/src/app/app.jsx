// eslint-disable-next-line @typescript-eslint/no-unused-vars
import './app.module.css';
import { SharedLibHeaderAndSidebar } from '@kara-erp/shared-lib-header-and-sidebar';
// import { calenderLang } from '@kara-erp/shared-lib-header-and-sidebar';
// import '@kara-erp/shared-lib-header-and-sidebar/';

export function App() {
  return (
    <div>
      {/* <NxWelcome title="accounting" /> */}
      <SharedLibHeaderAndSidebar />
      {/* <div
        style={{
          background: 'red',
          height: '50vh',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <calenderLang />
      </div> */}
    </div>
  );
}

export default App;
