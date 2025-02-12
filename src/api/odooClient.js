import axios from 'axios';

export class OdooClient {
  constructor(url, db, username, password) {
    this.url = url;
    this.db = db;
    this.username = username;
    this.password = password;
  }

  async authenticate() {
    try {
      const response = await axios.post(`${this.url}/web/session/authenticate`, {
        jsonrpc: '2.0',
        params: {
          db: this.db,
          login: this.username,
          password: this.password
        }
      });
      return response.data.result.session_id;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  async searchRead(model, domain = [], fields = []) {
    const session = await this.authenticate();
    try {
      const response = await axios.post(`${this.url}/web/dataset/call_kw`, {
        jsonrpc: '2.0',
        params: {
          model,
          method: 'search_read',
          args: [domain, fields],
          kwargs: {}
        }
      }, {
        headers: { 'Cookie': `session_id=${session}` }
      });
      return response.data.result;
    } catch (error) {
      throw new Error(`Failed to fetch ${model} data`);
    }
  }

  async getProductCategories() {
    return this.searchRead('product.category', [], ['id', 'name']);
  }

  async getProductTypes() {
    return [
      { id: 'consu', name: 'Consumable' },
      { id: 'service', name: 'Service' },
      { id: 'product', name: 'Storable Product' }
    ];
  }

  async getAvailableModels() {
    return this.searchRead('ir.model', [], ['model', 'name']);
  }

  async getPartners() {
    return this.searchRead('res.partner', [], ['id', 'name']);
  }

  // Original methods remain the same
  async createProduct(productData) {
    const session = await this.authenticate();
    try {
      const response = await axios.post(`${this.url}/web/dataset/call_kw`, {
        jsonrpc: '2.0',
        params: {
          model: 'product.template',
          method: 'create',
          args: [productData],
          kwargs: {}
        }
      }, {
        headers: { 'Cookie': `session_id=${session}` }
      });
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to create product');
    }
  }

  async createQuotationTemplate(templateData) {
    const session = await this.authenticate();
    try {
      const response = await axios.post(`${this.url}/web/dataset/call_kw`, {
        jsonrpc: '2.0',
        params: {
          model: 'sale.order.template',
          method: 'create',
          args: [templateData],
          kwargs: {}
        }
      }, {
        headers: { 'Cookie': `session_id=${session}` }
      });
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to create quotation template');
    }
  }

  async sendMessage(messageData) {
    const session = await this.authenticate();
    try {
      const response = await axios.post(`${this.url}/web/dataset/call_kw`, {
        jsonrpc: '2.0',
        params: {
          model: 'mail.message',
          method: 'create',
          args: [messageData],
          kwargs: {}
        }
      }, {
        headers: { 'Cookie': `session_id=${session}` }
      });
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to send message');
    }
  }
}
