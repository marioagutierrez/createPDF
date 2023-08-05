const express = require('express');
const form01Routes = require('./routes/form01');
const form02Routes = require('./routes/form02');
const form03Routes = require('./routes/form03');
const form04Routes = require('./routes/form04');
const form06Routes = require('./routes/form06');
const form07Routes = require('./routes/form07');
const form08Routes = require('./routes/form08');
const form09Routes = require('./routes/form09');

const app = express();

app.use(express.json({ limit: '50mb' }));  

// Usar las rutas definidas en form01Routes.js
app.use('/form01', form01Routes);
app.use('/form02', form02Routes);
app.use('/form03', form03Routes);
app.use('/form04', form04Routes);
app.use('/form06', form06Routes);
app.use('/form07', form07Routes);
app.use('/form08', form08Routes);
app.use('/form09', form09Routes);

app.listen(8080, '0.0.0.0', () => console.log("Server running on port 8080"));
