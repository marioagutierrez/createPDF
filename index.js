const express = require('express');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json({ limit: '50mb' }));  

const supabaseUrl = 'https://fpvxrsabicqnqdswijck.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdnhyc2FiaWNxbnFkc3dpamNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MTI4Njk2NywiZXhwIjoxOTg2ODYyOTY3fQ.q8Ekn0o6vCkQcUvNIvVK92VlvPxoXXhwXlN0RJb4YZY';
const supabase = createClient(supabaseUrl, supabaseKey, {
  persistSession: false
});

app.post('/upload', async (req, res) => {
    const bodyData = req.body.data; // Recibe los datos a enviar en la solicitud
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
          'Cookie': 'sesh=897784e1a463bcaa47fc71ae02e2482b; sesh.sig=txTRENaY37wogpOStkLDBFCntvE; b_id=1f9fc3360f0b38b5c835433d73d9eeaf; b_id.sig=Em0AnYzHiJx9i7b4VKMnb49Am5c',
        },
    };

    // Realiza la solicitud
    const request = https.request(options, response => {
        let data = [];

        response.on('data', chunk => {
            data.push(chunk);
        });

        response.on('end', async () => {
            // Concatena los chunks de datos
            const buffer = Buffer.concat(data);

            // Sube el archivo a Supabase Storage
            const { error: uploadError } = await supabase.storage.from('pdfs').upload(fileName, buffer);

            if (uploadError) {
                console.log(uploadError);
                res.status(500).send("Error al subir el archivo");
                return;
            }

            // Genera la URL de descarga
            const url = await supabase.storage.from('pdfs').getPublicUrl(fileName);

            // Retorna la URL del archivo PDF y el nombre del archivo
            res.json({
                link: url,
                file_name: fileName
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


app.listen(8080, '0.0.0.0', () => console.log("Server running on port 8080"));