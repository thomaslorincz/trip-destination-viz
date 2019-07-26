import * as path from 'path';
import * as express from 'express';
import * as helmet from 'helmet';

const app = express();
const port = process.env.PORT || 8080;

const httpsRedirect = (req, res, next): void => {
  if (req.headers['x-forwarded-proto'] === 'https') {
    return next();
  } else {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
};

app.use(helmet());
// Only use SSL redirect on deployed servers
if (port === process.env.PORT) {
  app.use(httpsRedirect);
}
app.use(express.static(__dirname));

app.get('/', (req, res): void => {
  return res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, (): void => console.log(`Listening on port ${port}`));
