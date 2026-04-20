const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists for JSON fallback
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ==================== JSON DATABASE CLASS ====================
class JSONDatabase {
  static getFilePath(collection) {
    return path.join(DATA_DIR, `${collection}.json`);
  }

  static readData(collection) {
    const filePath = this.getFilePath(collection);
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error(`Error reading ${collection}:`, error);
      return [];
    }
  }

  static writeData(collection, data) {
    const filePath = this.getFilePath(collection);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error(`Error writing ${collection}:`, error);
      return false;
    }
  }

  static create(collection, item) {
    const data = this.readData(collection);
    item.id = uuidv4();
    item.createdAt = new Date().toISOString();
    data.push(item);
    this.writeData(collection, data);
    return item;
  }

  static read(collection, id) {
    const data = this.readData(collection);
    return data.find(item => item.id === id);
  }

  static readAll(collection) {
    return this.readData(collection);
  }

  static update(collection, id, updates) {
    const data = this.readData(collection);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
    this.writeData(collection, data);
    return data[index];
  }

  static delete(collection, id) {
    const data = this.readData(collection);
    const filtered = data.filter(item => item.id !== id);
    this.writeData(collection, filtered);
    return true;
  }

  static findBy(collection, field, value) {
    const data = this.readData(collection);
    return data.find(item => item[field] === value);
  }

  static filterBy(collection, field, value) {
    const data = this.readData(collection);
    return data.filter(item => item[field] === value);
  }
}

// ==================== MONGODB DATABASE CLASS ====================
class MongoDBDatabase {
  static models = null;

  static setModels(models) {
    this.models = models;
  }

  static async create(collection, item) {
    try {
      if (!this.models) throw new Error('Models not initialized');
      const Model = this.models[this.getModelName(collection)];
      const doc = new Model(item);
      return await doc.save();
    } catch (error) {
      console.error(`Error creating document in ${collection}:`, error);
      throw error;
    }
  }

  static async read(collection, id) {
    try {
      if (!this.models) throw new Error('Models not initialized');
      const Model = this.models[this.getModelName(collection)];
      return await Model.findById(id);
    } catch (error) {
      console.error(`Error reading from ${collection}:`, error);
      return null;
    }
  }

  static async readAll(collection) {
    try {
      if (!this.models) throw new Error('Models not initialized');
      const Model = this.models[this.getModelName(collection)];
      return await Model.find();
    } catch (error) {
      console.error(`Error reading all from ${collection}:`, error);
      return [];
    }
  }

  static async update(collection, id, updates) {
    try {
      if (!this.models) throw new Error('Models not initialized');
      const Model = this.models[this.getModelName(collection)];
      return await Model.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      console.error(`Error updating ${collection}:`, error);
      return null;
    }
  }

  static async delete(collection, id) {
    try {
      if (!this.models) throw new Error('Models not initialized');
      const Model = this.models[this.getModelName(collection)];
      await Model.findByIdAndDelete(id);
      return true;
    } catch (error) {
      console.error(`Error deleting from ${collection}:`, error);
      return false;
    }
  }

  static async findBy(collection, field, value) {
    try {
      if (!this.models) throw new Error('Models not initialized');
      const Model = this.models[this.getModelName(collection)];
      return await Model.findOne({ [field]: value });
    } catch (error) {
      console.error(`Error finding in ${collection}:`, error);
      return null;
    }
  }

  static async filterBy(collection, field, value) {
    try {
      if (!this.models) throw new Error('Models not initialized');
      const Model = this.models[this.getModelName(collection)];
      return await Model.find({ [field]: value });
    } catch (error) {
      console.error(`Error filtering ${collection}:`, error);
      return [];
    }
  }

  static getModelName(collection) {
    // Convert collection name to model name
    // users -> User, products -> Product, etc.
    return collection.charAt(0).toUpperCase() + collection.slice(1, -1);
  }
}

// ==================== UNIFIED DATABASE CLASS ====================
class Database {
  static dbType = process.env.DATABASE_TYPE || 'json';
  static jsonDB = JSONDatabase;
  static mongoDB = MongoDBDatabase;

  // Initialize MongoDB models if using MongoDB
  static useMongoModels(models) {
    this.mongoDB.setModels(models);
  }

  // Create
  static create(collection, item) {
    if (this.dbType === 'mongodb') {
      return this.mongoDB.create(collection, item);
    }
    return this.jsonDB.create(collection, item);
  }

  // Read by ID
  static read(collection, id) {
    if (this.dbType === 'mongodb') {
      return this.mongoDB.read(collection, id);
    }
    return this.jsonDB.read(collection, id);
  }

  // Read all
  static readAll(collection) {
    if (this.dbType === 'mongodb') {
      return this.mongoDB.readAll(collection);
    }
    return this.jsonDB.readAll(collection);
  }

  // Update
  static update(collection, id, updates) {
    if (this.dbType === 'mongodb') {
      return this.mongoDB.update(collection, id, updates);
    }
    return this.jsonDB.update(collection, id, updates);
  }

  // Delete
  static delete(collection, id) {
    if (this.dbType === 'mongodb') {
      return this.mongoDB.delete(collection, id);
    }
    return this.jsonDB.delete(collection, id);
  }

  // Find by field
  static findBy(collection, field, value) {
    if (this.dbType === 'mongodb') {
      return this.mongoDB.findBy(collection, field, value);
    }
    return this.jsonDB.findBy(collection, field, value);
  }

  // Filter by field
  static filterBy(collection, field, value) {
    if (this.dbType === 'mongodb') {
      return this.mongoDB.filterBy(collection, field, value);
    }
    return this.jsonDB.filterBy(collection, field, value);
  }

  // Get current database type
  static getDatabaseType() {
    return this.dbType;
  }
}

module.exports = Database;
