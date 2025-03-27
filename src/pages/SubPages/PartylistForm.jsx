import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useAuthContext } from '../../utils/AuthContext';
import { ENV_BASE_URL } from '../../../DummyENV';

const { TextArea } = Input;

const PartylistForm = ({ onClose, onRefresh, partylist = null }) => {
  const [form] = Form.useForm();
  const { token } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set form values when editing existing partylist
  useEffect(() => {
    if (partylist) {
      form.setFieldsValue({
        name: partylist.name,
        description: partylist.description,
      });
    } else {
      form.resetFields();
    }
  }, [partylist, form]);

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      if (partylist) {
        await axios.put(`${ENV_BASE_URL}/api/admin/partylist/${partylist.id}`, values, config);
        message.success('Party list updated successfully');
      } else {
        await axios.post(`${ENV_BASE_URL}/api/partylist-make`, values, config);
        message.success('Party list created successfully');
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error saving party list:', error);
      message.error(error.response?.data?.message || 'Error saving party list');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        name: '',
        description: '',
      }}
    >
      <Form.Item
        label="Party List Name"
        name="name"
        rules={[{ required: true, message: 'Please enter the party list name' }]}
      >
        <Input placeholder="Enter party list name" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please enter a description' }]}
      >
        <TextArea 
          placeholder="Enter party list description" 
          rows={4}
        />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={isSubmitting} 
          style={{ marginRight: 10 }}
        >
          {partylist ? 'Update Party List' : 'Add Party List'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </Form.Item>
    </Form>
  );
};

export default PartylistForm;