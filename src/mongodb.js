import { MongoClient } from 'mongodb';

// Replace with your MongoDB URI
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

export const searchDatabase = async (searchType, query) => {
  try {
    await client.connect();
    const database = client.db('yourDatabase'); // Replace with your database name
    const collection = database.collection('users'); // Replace with your collection name

    let result;
    if (searchType === 'cedula') {
      result = await collection.find({ cedula: query }).toArray();
    } else if (searchType === 'nombre') {
      result = await collection.find({ nombre: { $regex: query, $options: "i" } }).toArray();
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  } finally {
    await client.close();
  }
};
