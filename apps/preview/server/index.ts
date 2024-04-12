import express from 'express';
import expressWs from 'express-ws';
import { Subject } from 'rxjs';

const expressServer = express();
const expressWsInstance = expressWs(expressServer);
const { app } = expressWsInstance;

const updates$ = new Subject();

// TODO: Protect endpoints and preview with Drupal authentication.
app.post('/__preview', (req, res) => {
  updates$.next({ body: req.body });
  res.json(true);
});

app.ws('/__preview', (ws) => {
  // TODO: Separate updates per user session.
  const sub = updates$.subscribe((payload) => {
    ws.send(JSON.stringify(payload));
  });
  ws.on('close', sub.unsubscribe);
});

app.get('/__preview/*', (req, _, next) => {
  req.url = '/';
  next();
});

app.use(express.static('./dist'));
const port = process.env.PREVIEW_PORT || 8001;
console.log(`Server is running on port ${port}`);

app.listen({ port });
