import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Activity, ActivityType } from '../types/database';

const ACTIVITY_TYPES: ActivityType[] = ['note', 'call', 'email', 'meeting', 'task'];

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  const [deals, setDeals] = useState<{ id: string; name: string }[]>([]);
  const [form] = Form.useForm();
  useNavigate(); // Keep for future use

  useEffect(() => {
    fetchActivities();
    fetchCustomersAndDeals();
  }, []);

  async function fetchActivities() {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          customers!activities_entity_id_fkey (
            name
          ),
          deals!activities_entity_id_fkey (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      message.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCustomersAndDeals() {
    try {
      const [customersData, dealsData] = await Promise.all([
        supabase.from('customers').select('id, name'),
        supabase.from('deals').select('id, name'),
      ]);

      if (customersData.error) throw customersData.error;
      if (dealsData.error) throw dealsData.error;

      setCustomers(customersData.data || []);
      setDeals(dealsData.data || []);
    } catch (error) {
      console.error('Error fetching customers and deals:', error);
    }
  }

  async function handleAddActivity(values: any) {
    try {
      const { error } = await supabase
        .from('activities')
        .insert([{
          ...values,
          due_date: values.due_date?.toISOString(),
        }]);

      if (error) throw error;

      message.success('Activity added successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchActivities();
    } catch (error) {
      console.error('Error adding activity:', error);
      message.error('Failed to add activity');
    }
  }

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => type.toUpperCase(),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Related To',
      key: 'related',
      render: (record: Activity & { 
        customers?: { name: string };
        deals?: { name: string };
      }) => {
        if (record.entity_type === 'customer') {
          return record.customers?.name;
        }
        if (record.entity_type === 'deal') {
          return record.deals?.name;
        }
        return '-';
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (date: string) => date ? format(new Date(date), 'MMM d, yyyy') : '-',
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: Activity) => record.completed_at ? 'Completed' : 'Pending',
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => format(new Date(date), 'MMM d, yyyy h:mm a'),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Activity
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={activities}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Add Activity"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddActivity}
        >
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select activity type!' }]}
          >
            <Select>
              {ACTIVITY_TYPES.map(type => (
                <Select.Option key={type} value={type}>
                  {type.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input activity title!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="entity_type"
            label="Related To"
            rules={[{ required: true, message: 'Please select related entity type!' }]}
          >
            <Select onChange={() => form.setFieldValue('entity_id', undefined)}>
              <Select.Option value="customer">Customer</Select.Option>
              <Select.Option value="deal">Deal</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.entity_type !== currentValues.entity_type}
          >
            {({ getFieldValue }) => {
              const entityType = getFieldValue('entity_type');
              return entityType ? (
                <Form.Item
                  name="entity_id"
                  label={entityType === 'customer' ? 'Customer' : 'Deal'}
                  rules={[{ required: true, message: `Please select a ${entityType}!` }]}
                >
                  <Select>
                    {(entityType === 'customer' ? customers : deals).map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null;
            }}
          </Form.Item>

          <Form.Item name="due_date" label="Due Date">
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