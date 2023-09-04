// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import NxWelcome from './nx-welcome';
import { SharedLibHeaderAndSidebar } from '@kara-erp/shared-lib-header-and-sidebar';

export function App() {
  return (
    <div>
      {/* <NxWelcome title="accounting" /> */}
      <SharedLibHeaderAndSidebar />
    </div>
  );
}

export default App;
