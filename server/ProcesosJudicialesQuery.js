const { MongoClient } = require('mongodb');
// and query supercias collection

/* create client and connect to MongoDB */
class ProcesosJudicialesQuery {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.database_name = 'Procesos_Judiciales';
    this.collection_name = 'procesos_judiciales_raw';
    this.client = new MongoClient(this.endpoint);
    this.db = null;
    this.collection = null;
  }

  // Connect to MongoDB and set the collection
  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.database_name);
      this.collection = this.db.collection(this.collection_name);
      console.log('Connected to ' + this.collection_name + ' collection');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  // Query MongoDB for a document by cedula using a regex search
  async findByCedula(cedula) {
    if (!this.collection) {
      console.error('Not connected to the collection');
      return null;
    }
    try {
      const result = await this.collection.find({
        'cedula': { $regex: ".*" + cedula + ".*" } 
      }).toArray();
      return result;
    } catch (error) {
      console.error('Error querying MongoDB:', error);
      return null;
    }
  }


  // Close the MongoDB connection
  async close() {
    await this.client.close();
    console.log('Connection to MongoDB closed');
  }
}

module.exports = ProcesosJudicialesQuery;