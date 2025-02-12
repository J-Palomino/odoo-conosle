import React from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ProductForm } from './components/ProductForm';
import { QuotationTemplateForm } from './components/QuotationTemplateForm';
import { MessageForm } from './components/MessageForm';
import { OdooClient } from './api/odooClient';

const queryClient = new QueryClient();

// Initialize Odoo client
const odooClient = new OdooClient(
  'YOUR_ODOO_URL',
  'YOUR_DATABASE',
  'YOUR_USERNAME',
  'YOUR_PASSWORD'
);

export default function App() {
  const handleProductSubmit = async (values) => {
    try {
      await odooClient.createProduct(values);
      alert('Product created successfully!');
    } catch (error) {
      alert('Failed to create product');
    }
  };

  const handleTemplateSubmit = async (values) => {
    try {
      await odooClient.createQuotationTemplate(values);
      alert('Template created successfully!');
    } catch (error) {
      alert('Failed to create template');
    }
  };

  const handleMessageSubmit = async (values) => {
    try {
      await odooClient.sendMessage(values);
      alert('Message sent successfully!');
    } catch (error) {
      alert('Failed to send message');
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Router>
          <div style={{ padding: '20px' }}>
            <nav style={{ marginBottom: '20px' }}>
              <Link to="/" style={{ marginRight: '10px' }}>Products</Link>
              <Link to="/templates" style={{ marginRight: '10px' }}>Templates</Link>
              <Link to="/messages">Messages</Link>
            </nav>

            <Routes>
              <Route path="/" element={<ProductForm onSubmit={handleProductSubmit} odooClient={odooClient} />} />
              <Route path="/templates" element={<QuotationTemplateForm onSubmit={handleTemplateSubmit} odooClient={odooClient} />} />
              <Route path="/messages" element={<MessageForm onSubmit={handleMessageSubmit} odooClient={odooClient} />} />
            </Routes>
          </div>
        </Router>
      </MantineProvider>
    </QueryClientProvider>
  );
}
