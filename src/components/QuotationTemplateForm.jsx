import React from 'react';
import { TextInput, NumberInput, Button, Box } from '@mantine/core';
import { useForm } from '@mantine/form';

export function QuotationTemplateForm({ onSubmit }) {
  const form = useForm({
    initialValues: {
      name: '',
      note: '',
    }
  });

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          label="Template Name"
          placeholder="Enter template name"
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Note"
          placeholder="Enter note"
          {...form.getInputProps('note')}
        />
        <Button type="submit" mt="md">Create Template</Button>
      </form>
    </Box>
  );
}
