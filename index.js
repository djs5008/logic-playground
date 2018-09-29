const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// static files
app.use(express.static('public'));

// index
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/lpg.html');
});

app.listen(PORT, console.log(`server listening on port ${PORT}`));
