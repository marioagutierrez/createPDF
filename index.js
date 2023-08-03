const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));  

const uploadFolder = ".";  

app.post('/upload', (req, res) => {
    const bodyData = req.body.data;  // Recibe los datos a enviar en la solicitud
    const fileName = req.body.file_name;
    
    // Configuración de la solicitud
    const options = {
        hostname: 'app.useanvil.com',
        port: 443,
        path: '/api/v1/fill/aN0QkXcSWl4GCHI7iVME.pdf',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': 'Basic UWRrWDF6cVNPOEVkaWtnQzNHSmRxMHlsTmc3RTZWQXI6', 
            'Cookie': 'sesh=897784e1a463bcaa47fc71ae02e2482b; sesh.sig=txTRENaY37wogpOStkLDBFCntvE; b_id=1f9fc3360f0b38b5c835433d73d9eeaf; b_id.sig=Em0AnYzHiJx9i7b4VKMnb49Am5c'
        }
    };

    // Realiza la solicitud
    const request = https.request(options, response => {
        let data = [];

        response.on('data', chunk => {
            data.push(chunk);
        });

        response.on('end', () => {
            // Concatena los chunks de datos y los guarda como un archivo
            const buffer = Buffer.concat(data);
            const filePath = path.join(uploadFolder, fileName);
            fs.writeFile(filePath, buffer, err => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Error al guardar el archivo");
                } else {
                    // Retorna la URL del archivo PDF para poder visualizarlo
                    res.send(req.protocol + '://' + req.get('host') + '/' + fileName);
                }
            });
        });
    });

    request.on('error', error => {
        console.log(error);
        res.status(500).send("Error al hacer la solicitud");
    });

    // Escribe los datos en el cuerpo de la solicitud
    request.write(JSON.stringify(bodyData));
    request.end();
});

app.get('/:filename', (req, res) => {
    res.sendFile(path.join(uploadFolder, req.params.filename));
});

app.listen(5000, '0.0.0.0', () => console.log("Server running on port 5000"));