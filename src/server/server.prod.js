import path from 'path';
import express from 'express';

const app = express();
const port = process.env.PORT || 8080;

app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect(`https://${req.get('Host')}${req.url}`);
  }
  next();
});
app.use(express.static(__dirname));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(port, () => console.log(`Listening on port ${port}`));
