import path from 'path';
import express from 'express';
import sslRedirect from 'heroku-ssl-redirect';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(__dirname));
app.use(sslRedirect());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(port, () => console.log(`Listening on port ${port}`));
