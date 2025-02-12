import React, { useEffect, useState } from 'react';
import { TextInput, Textarea, Button, Box, Select } from '@mantine/core';
import { useForm } from '@mantine/form';

export function MessageForm({ onSubmit, odooClient }) {
  const [models, setModels] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    initialValues: {
      subject: '',
      body: '',
      model: '',
      res_id: '',
      partner_ids: [],
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelsData, partnersData] = await Promise.all([
          odooClient.getAvailableModels(),
          odooClient.getPartners()
        ]);
        
        setModels(modelsData.map(model => ({
          value: model.model,
          label: model.name
        })));
        
        setPartners(partnersData.map(partner => ({
          value: partner.id.toString(),
          label: partner.name
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
          label="Subject"
          placeholder="Enter subject"
          {...form.getInputProps('subject')}
        />
        
        <Textarea
          required
          label="Message"
          placeholder="Enter message"
          {...form.getInputProps('body')}
        />
        
        <Select
          required
          label="Model"
          placeholder="Select model"
          data={models}
          {...form.getInputProps('model')}
        />
        
        <TextInput
          required
          label="Record ID"
          placeholder="Enter record ID"
          {...form.getInputProps('res_id')}
        />
        
        <Select
          label="Recipients"
          placeholder="Select recipients"
          data={partners}
          multiple
          {...form.getInputProps('partner_ids')}
        />
        
        <Button type="submit" mt="md">Send Message</Button>
      </form>
    </Box>
  );
}
