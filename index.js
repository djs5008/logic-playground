const Application = require('./src/app');
const PORT = process.env.PORT || 3000;

Application.then(app => {
  app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
});
