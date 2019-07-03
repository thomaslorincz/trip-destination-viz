import path from 'path';
import express from 'express';
import helmet from 'helmet';

const app = express();
const port = process.env.PORT || 8080;

const httpsRedirect = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'https') {
    return next();
  } else {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
};

app.use(helmet());
app.use(httpsRedirect);
app.use(express.static(__dirname));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(port, () => console.log(`Listening on port ${port}`));
