const express = require('express');
const cors = require('cors');
const SuperciasQuery = require('./SuperciasQuery');
const RegistoSocialQuery = require('./RegistroSocialQuery');
const CNEQuery = require('./CNEQuery');
const ANTQuery = require('./ANTQuery');
const ProcesosJudicialesQuery = require('./ProcesosJudicialesQuery');
const SuperciasCompanyQuery = require('./SuperciasCompanyQuery');

const app = express();
const PORT = 5000;

// allow requests from any origin
app.use(cors());
app.use(express.json());

let endpoint_localhost = 'mongodb://localhost:27017'
let endpoint_vpn = 'mongodb://10.0.10.5:27017'
let endpoint = endpoint_vpn

// Declare the instance outside so it can be reused
let superciasQuery, registoSocialQuery, cneQuery, antQuery, processJudicialesQuery, superciasCompanyQuery;

// Initialize the MongoDB connection once when the server starts
(async () => {
  superciasQuery = new SuperciasQuery(endpoint);
  superciasCompanyQuery = new SuperciasCompanyQuery(endpoint);
  registoSocialQuery = new RegistoSocialQuery(endpoint);
  cneQuery = new CNEQuery(endpoint);
  antQuery = new ANTQuery(endpoint);
  processJudicialesQuery = new ProcesosJudicialesQuery(endpoint);
  // Connect to MongoDB
  await superciasQuery.connect(); // Connect once when the server starts
  await superciasCompanyQuery.connect();
  await registoSocialQuery.connect();
  await cneQuery.connect();
  await antQuery.connect();
  await processJudicialesQuery.connect();
})();


app.post('/search', async (req, res) => {
  const { searchType, query } = req.body;
  try {
    let result = {};
    if(query !== ''){
      if (searchType === 'cedula') {
        result['supercias'] = (await superciasQuery.findByCedula(query))[0]
        console.log('supercias done');
        result['registro_social'] = (await registoSocialQuery.findByCedula(query))[0];
        console.log('registro_social done');
        result['cne'] = (await cneQuery.findByCedula(query))[0];
        console.log('cne done');
        result['ant'] = await antQuery.findByCedula(query);
        console.log('ant done');
        result['procesos_judiciales'] = (await processJudicialesQuery.findByCedula(query))[0];
        console.log('procesos_judiciales done');
      } else if (searchType === 'nombre') {
        // change query to all uppercaseo
        const upper_query = query.toUpperCase();
        result['supercias'] = await superciasQuery.findByNombre(upper_query);
        console.log('supercias done');
        result['cne'] = await cneQuery.findByNombre(upper_query);
        console.log('cne done');
        result['ant'] = await antQuery.findByNombre(upper_query);
        console.log('ant done');
      }
      else if (searchType === 'ruc') {
        result['supercias'] = (await superciasCompanyQuery.findByRuc(query))[0];
        console.log('supercias done');
        result['ant'] = (await antQuery.findByCedula(query))[0];
        console.log('ant done');
      }
    }
    // for result in cursor:
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

process.on('SIGINT', async () => {
  await superciasQuery.close(); // Close the connection gracefully
  await registoSocialQuery.close();
  await cneQuery.close();
  await antQuery.close();
  await processJudicialesQuery.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});