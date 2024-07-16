import { OperationExecutorsProvider } from '@custom/schema';
import { Frame } from '@custom/ui/routes/Frame';
import { Preview, usePreviewRefresh } from '@custom/ui/routes/Preview';
import { useEffect } from 'react';
import { retry } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

import { drupalExecutor } from './drupal-executor';

declare global {
  interface Window {
    GRAPHQL_ENDPOINT: string;
  }
}

const updates$ = webSocket<any>({
  url: `${window.location.origin.replace('http', 'ws')}/__preview`,
}).pipe(
  retry({
    delay: 3000,
  }),
);

function App() {
  const refresh = usePreviewRefresh();
  useEffect(() => {
    const sub = updates$.subscribe((value) => refresh(value));
    return sub.unsubscribe;
  }, [refresh]);
  return (
    <OperationExecutorsProvider
      executors={[{ executor: drupalExecutor(window.GRAPHQL_ENDPOINT, false) }]}
    >
      <Frame>
        <Preview />
      </Frame>
    </OperationExecutorsProvider>
  );
}

export default App;
