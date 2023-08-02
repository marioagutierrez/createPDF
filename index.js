const express = require('express');
const https = require('https');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

// Crea un objeto S3
const s3 = new S3Client({ region: 'us-east-1' });
const bucketName = "cyclic-long-rose-xerus-hose-us-east-1";

app.post('/upload', (req, res) => {
    const bodyData = req.body.data;
    const fileName = req.body.file_name;

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

    const request = https.request(options, response => {
        let data = [];

        response.on('data', chunk => {
            data.push(chunk);
        });

        response.on('end', async () => {
            const buffer = Buffer.concat(data);

            // Parámetros para guardar en S3
            const params = {
                Bucket: bucketName,
                Key: fileName,
                Body: buffer
            };

            // Guardar en S3 usando la versión 3 del SDK
            try {
                await s3.send(new PutObjectCommand(params));
                res.send(`https://${bucketName}.s3.amazonaws.com/${fileName}`);
            } catch (err) {
                console.log(err);
                res.status(500).send("Error al guardar el archivo en S3");
            }
        });
    });

    request.on('error', error => {
        console.log(error);
        res.status(500).send("Error al hacer la solicitud");
    });

    request.write(JSON.stringify(bodyData));
    request.end();
});

app.listen(5000, '0.0.0.0', () => console.log("Server running on port 5000"));
