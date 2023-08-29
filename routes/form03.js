const express = require('express');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Estas credenciales deben ser almacenadas de forma segura, preferentemente en variables de entorno
const supabaseUrl = 'https://fpvxrsabicqnqdswijck.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdnhyc2FiaWNxbnFkc3dpamNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MTI4Njk2NywiZXhwIjoxOTg2ODYyOTY3fQ.q8Ekn0o6vCkQcUvNIvVK92VlvPxoXXhwXlN0RJb4YZY';  // Recuerda cambiar esto por una variable de entorno
const supabase = createClient(supabaseUrl, supabaseKey, {
    persistSession: false
});

router.post('/upload', async (req, res) => {
    const bodyData = req.body.data;
    const fileName = req.body.file_name;

    const options = {
        hostname: 'app.useanvil.com',
        port: 443,
        path: '/api/v1/fill/BC8jY3c9BLcb5W1k7eNW.pdf',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic UWRrWDF6cVNPOEVkaWtnQzNHSmRxMHlsTmc3RTZWQXI6',  // Asegúrate de manejar esto de forma segura
            'Cookie': 'sesh=897784e1a463bcaa47fc71ae02e2482b; sesh.sig=txTRENaY37wogpOStkLDBFCntvE; b_id=1f9fc3360f0b38b5c835433d73d9eeaf; b_id.sig=Em0AnYzHiJx9i7b4VKMnb49Am5c',  // Asegúrate de manejar esto de forma segura
        },
    };

    const request = https.request(options, response => {
        let data = [];

        response.on('data', chunk => {
            data.push(chunk);
        });

        response.on('end', async () => {
            const buffer = Buffer.concat(data);

            // Al subir el archivo, agregamos el encabezado 'Content-Type': 'application/pdf'
            const { error: uploadError } = await supabase.storage.from('pdfs').upload(fileName, buffer, {
                contentType: 'application/pdf'
            });

            if (uploadError) {
                console.error(uploadError);
                return res.status(500).send("Error al subir el archivo");
            }

            const url = `https://fpvxrsabicqnqdswijck.supabase.co/storage/v1/object/public/pdfs/${fileName}`;

            res.json({
                link: url,
                file_name: fileName
            });
        });
    });

    request.on('error', error => {
        console.error(error);
        res.status(500).send("Error al hacer la solicitud");
    });

    request.write(JSON.stringify(bodyData));
    request.end();
});

router.get('/getpdf/:fileName', async (req, res) => {
    const fileName = req.params.fileName;

    const { data, error } = await supabase.storage.from('pdfs').download(fileName);
    if (error) {
        console.error(error);
        return res.status(500).send("Error al descargar el archivo");
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.send(data);
});

module.exports = router;
