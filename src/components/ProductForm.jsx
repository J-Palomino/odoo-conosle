import React, { useEffect, useState } from 'react';
import { TextInput, NumberInput, Button, Box, Select } from '@mantine/core';
import { useForm } from '@mantine/form';

export function ProductForm({ onSubmit, odooClient }) {
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    initialValues: {
      name: '',
      list_price: 0,
      description: '',
      type: 'product',
      categ_id: '',
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, typesData] = await Promise.all([
          odooClient.getProductCategories(),
          odooClient.getProductTypes()
        ]);
        
        setCategories(categoriesData.map(cat => ({
          value: cat.id.toString(),
          label: cat.name
        })));
        
        setProductTypes(typesData.map(type => ({
          value: type.id,
          label: type.name
        })));
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [odooClient]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          required
          label="Product Name"
          placeholder="Enter product name"
          {...form.getInputProps('name')}
        />
        
        <NumberInput
          required
          label="Price"
          placeholder="Enter price"
          {...form.getInputProps('list_price')}
        />
        
        <Select
          required
          label="Product Type"
          placeholder="Select product type"
          data={productTypes}
          {...form.getInputProps('type')}
        />
        
        <Select
          required
          label="Category"
          placeholder="Select category"
          data={categories}
          {...form.getInputProps('categ_id')}
        />
        
        <TextInput
          label="Description"
          placeholder="Enter description"
          {...form.getInputProps('description')}
        />
        
        <Button type="submit" mt="md">Create Product</Button>
      </form>
    </Box>
  );
}
