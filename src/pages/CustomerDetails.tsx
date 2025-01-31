import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Tabs, Table, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import type { Customer, Deal, Contact } from '../types/database';

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCustomerData();
    }
  }, [id]);

  async function fetchCustomerData() {
    try {
      const [customerData, dealsData, contactsData] = await Promise.all([
        supabase.from('customers').select('*').eq('id', id).single(),
        supabase.from('deals').select('*').eq('customer_id', id),
        supabase.from('contacts').select('*').eq('customer_id', id),
      ]);

      if (customerData.error) throw customerData.error;
      if (dealsData.error) throw dealsData.error;
      if (contactsData.error) throw contactsData.error;

      setCustomer(customerData.data);
      setDeals(dealsData.data || []);
      setContacts(contactsData.data || []);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      message.error('Failed to fetch customer data');
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  }

  const dealColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Deal) => (
        <a onClick={() => navigate(`/deals/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => amount ? `$${amount.toLocaleString()}` : '-',
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => stage.replace('_', ' ').toUpperCase(),
    },
    {
      title: 'Expected Close',
      dataIndex: 'expected_close_date',
      key: 'expected_close_date',
      render: (date: string) => date ? format(new Date(date), 'MMM d, yyyy') : '-',
    },
  ];

  const contactColumns = [
    {
      title: 'Name',
      key: 'name',
      render: (record: Contact) => `${record.first_name} ${record.last_name}`,
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
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <div>
      <Card
        title="Customer Details"
        extra={
          <Space>
            <Button icon={<EditOutlined />}>Edit</Button>
            <Button icon={<DeleteOutlined />} danger>Delete</Button>
          </Space>
        }
      >
        <Descriptions column={2}>
          <Descriptions.Item label="Name">{customer.name}</Descriptions.Item>
          <Descriptions.Item label="Company">{customer.company || '-'}</Descriptions.Item>
          <Descriptions.Item label="Email">{customer.email || '-'}</Descriptions.Item>
          <Descriptions.Item label="Phone">{customer.phone || '-'}</Descriptions.Item>
          <Descriptions.Item label="Status">{customer.status}</Descriptions.Item>
          <Descriptions.Item label="Created">
            {format(new Date(customer.created_at), 'MMM d, yyyy')}
          </Descriptions.Item>
        </Descriptions>

        <Tabs
          items={[
            {
              key: 'deals',
              label: 'Deals',
              children: (
                <Table
                  columns={dealColumns}
                  dataSource={deals}
                  rowKey="id"
                  pagination={false}
                />
              ),
            },
            {
              key: 'contacts',
              label: 'Contacts',
              children: (
                <Table
                  columns={contactColumns}
                  dataSource={contacts}
                  rowKey="id"
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}