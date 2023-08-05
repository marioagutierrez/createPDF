const express = require('express');
const form01Routes = require('./routes/form01');
const form02Routes = require('./routes/form02');

const app = express();

app.use(express.json({ limit: '50mb' }));  

// Usar las rutas definidas en form01Routes.js
app.use('/form01', form01Routes);
app.use('/form02', form02Routes);

app.listen(5000, '0.0.0.0', () => console.log("Server running on port 5000"));
