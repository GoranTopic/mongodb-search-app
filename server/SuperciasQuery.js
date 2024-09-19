const { MongoClient } = require('mongodb');
// and query supercias collection

/* create client and connect to MongoDB */
class SuperciasQuery {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.database_name = 'supercias';
    this.collection_name = 'consulta_personal';
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
      console.log('Connected to supercias collection');
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
        'cedula': { '$regex': '.*' + cedula + '.*', '$options': 'i' }
      }).toArray();
      return result;
    } catch (error) {
      console.error('Error querying MongoDB:', error);
      return null;
    }
  }

  async findByNombre(nombre) {
    if (!this.collection) {
      console.error('Not connected to the collection');
      return null;
    }
    try {
      const result = await this.collection.find({
        'nombre': { '$regex': '.*' + nombre + '.*', '$options': 'i' }
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

module.exports = SuperciasQuery;