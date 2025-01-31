import { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Modal, Form, Select, InputNumber, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import type { Deal, DealStage } from '../types/database';

const DEAL_STAGES: DealStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeals();
    fetchCustomers();
  }, []);

  async function fetchDeals() {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          customers (
            name
          )
        `)
        .ilike('name', `%${searchText}%`);

      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCustomers() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }

  async function handleAddDeal(values: any) {
    try {
      const { error } = await supabase
        .from('deals')
        .insert([{
          ...values,
          expected_close_date: values.expected_close_date?.toISOString(),
        }]);

      if (error) throw error;

      setIsModalVisible(false);
      form.resetFields();
      fetchDeals();
    } catch (error) {
      console.error('Error adding deal:', error);
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Deal) => (
        <a onClick={() => navigate(`/deals/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: 'Customer',
      dataIndex: ['customers', 'name'],
      key: 'customer',
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

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Search deals..."
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            fetchDeals();
          }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Deal
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={deals}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Add Deal"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddDeal}
        >
          <Form.Item
            name="name"
            label="Deal Name"
            rules={[{ required: true, message: 'Please input deal name!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="customer_id"
            label="Customer"
            rules={[{ required: true, message: 'Please select a customer!' }]}
          >
            <Select>
              {customers.map(customer => (
                <Select.Option key={customer.id} value={customer.id}>
                  {customer.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="amount" label="Amount">
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="stage"
            label="Stage"
            rules={[{ required: true, message: 'Please select a stage!' }]}
          >
            <Select>
              {DEAL_STAGES.map(stage => (
                <Select.Option key={stage} value={stage}>
                  {stage.replace('_', ' ').toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="expected_close_date" label="Expected Close Date">
            <DatePicker style={{ width: '100%' }} />
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