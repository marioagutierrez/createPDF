const express = require('express');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Estas credenciales deben ser almacenadas de forma segura, preferentemente en variables de entorno
const supabaseUrl = 'https://fpvxrsabicqnqdswijck.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdnhyc2FiaWNxbnFkc3dpamNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MTI4Njk2NywiZXhwIjoxOTg2ODYyOTY3fQ.q8Ekn0o6vCkQcUvNIvVK92VlvPxoXXhwXlN0RJb4YZY';
const supabase = createClient(supabaseUrl, supabaseKey, {
  persistSession: false
});

router.post('/upload', async (req, res) => {
    const bodyData = req.body.data;
    const fileName = req.body.file_name;

    const options = {
        hostname: 'app.useanvil.com',
        port: 443,
        path: '/api/v1/fill/PokgOTeFcMZS9nNCy32o.pdf',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic UWRrWDF6cVNPOEVkaWtnQzNHSmRxMHlsTmc3RTZWQXI6',
          'Cookie': 'sesh=897784e1a463bcaa47fc71ae02e2482b; sesh.sig=txTRENaY37wogpOStkLDBFCntvE; b_id=1f9fc3360f0b38b5c835433d73d9eeaf; b_id.sig=Em0AnYzHiJx9i7b4VKMnb49Am5c',
            },
        };
    const request = https.request(options, response => {
        let data = [];

        response.on('data', chunk => {
            data.push(chunk);
        });

        response.on('end', async () => {
            const buffer = Buffer.concat(data);
            const { error: uploadError } = await supabase.storage.from('pdfs').upload(fileName, buffer);

            if (uploadError) {
                console.error(uploadError);
                return res.status(500).send("Error al subir el archivo");
            }

            const url = await supabase.storage.from('pdfs').getPublicUrl(fileName);
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

module.exports = router;