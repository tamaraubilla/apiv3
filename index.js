const express = require('express');
const app = express();
const port = process.env.PORT|| 80;
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Funcionando:D');
    });

app.get('/alertas', async (req, res) => {
  const { data, error } = await supabase.from('alertas').select('*');
  if (error) return res.status(500).json({ error });
  res.json(data);
});

app.post('/alertas', async (req, res) => {
  const { rssi, mensaje } = req.body;
  try{
  const { data, error } = await supabase.from('alertas').insert([{ rssi, mensaje }]);
  if (error) return res.status(500).json({ error: 'Supabase error', detalle: error.message });
  res.status(200).json({mensaje:'Alerta Guardada', data });
    }
    catch (error) {
    return res.status(500).json({ error: 'Error al guardar la alerta', detalle: error.message });
}});

app.get('/ubicaciones', async (req, res) => {
  const { data, error } = await supabase.from('ubicaciones').select('*');
  if (error) return res.status(500).json({ error });
  res.json(data);
});

app.post('/ubicaciones', async (req, res) => {
  const { latitud, longitud } = req.body;
  try{
  const { data, error } = await supabase.from('ubicaciones').insert([{ ubicacion: `SRID=4326;POINT(${longitud} ${latitud})`}]);
  if (error) return res.status(500).json({ error: 'Supabase error', detalle: error.message });
  res.status(200).json({mensaje:'Ubicacion Guardada', data });
  }
  catch (error) {
  return res.status(500).json({ error: 'Error al guardar la ubicación', detalle: error.message });

}});



app.listen(port, '0.0.0.0', () => {
  console.log(`¡Servidor corriendo en puerto ${port}!`);
});