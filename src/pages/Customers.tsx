import { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Modal, Form, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Customer } from '../types/database';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .ilike('name', `%${searchText}%`);

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      message.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCustomer(values: Partial<Customer>) {
    try {
      const { error } = await supabase
        .from('customers')
        .insert([values]);

      if (error) throw error;

      message.success('Customer added successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchCustomers();
    } catch (error) {
      console.error('Error adding customer:', error);
      message.error('Failed to add customer');
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Customer) => (
        <a onClick={() => navigate(`/customers/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Search customers..."
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            fetchCustomers();
          }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Customer
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={customers}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Add Customer"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddCustomer}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input customer name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="company" label="Company">
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: 'email', message: 'Please enter a valid email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}