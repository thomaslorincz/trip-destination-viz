import path from 'path';
import express from 'express';

const app = express();

const httpsRedirect = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'https') {
    return next();
  } else {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
};

app.use(httpsRedirect);
app.use(express.static(__dirname));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(8080, () => console.log('Listening on port 8080'));
