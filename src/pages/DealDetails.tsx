import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Timeline, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import type { Deal, Activity } from '../types/database';

export default function DealDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDealData();
    }
  }, [id]);

  async function fetchDealData() {
    try {
      const [dealData, activitiesData] = await Promise.all([
        supabase
          .from('deals')
          .select(`
            *,
            customers (
              name
            )
          `)
          .eq('id', id)
          .single(),
        supabase
          .from('activities')
          .select('*')
          .eq('entity_type', 'deal')
          .eq('entity_id', id)
          .order('created_at', { ascending: false }),
      ]);

      if (dealData.error) throw dealData.error;
      if (activitiesData.error) throw activitiesData.error;

      setDeal(dealData.data);
      setActivities(activitiesData.data || []);
    } catch (error) {
      console.error('Error fetching deal data:', error);
      message.error('Failed to fetch deal data');
      navigate('/deals');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!deal) {
    return <div>Deal not found</div>;
  }

  return (
    <div>
      <Card
        title="Deal Details"
        extra={
          <Space>
            <Button icon={<EditOutlined />}>Edit</Button>
            <Button icon={<DeleteOutlined />} danger>Delete</Button>
          </Space>
        }
      >
        <Descriptions column={2}>
          <Descriptions.Item label="Name">{deal.name}</Descriptions.Item>
          <Descriptions.Item label="Customer">{(deal as any).customers?.name}</Descriptions.Item>
          <Descriptions.Item label="Amount">
            {deal.amount ? `$${deal.amount.toLocaleString()}` : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Stage">
            {deal.stage.replace('_', ' ').toUpperCase()}
          </Descriptions.Item>
          <Descriptions.Item label="Expected Close">
            {deal.expected_close_date
              ? format(new Date(deal.expected_close_date), 'MMM d, yyyy')
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Probability">
            {deal.probability ? `${deal.probability}%` : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Created">
            {format(new Date(deal.created_at), 'MMM d, yyyy')}
          </Descriptions.Item>
        </Descriptions>

        <Card title="Activity Timeline" style={{ marginTop: 24 }}>
          <Timeline
            items={activities.map(activity => ({
              children: (
                <div>
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                  <small>{format(new Date(activity.created_at), 'MMM d, yyyy h:mm a')}</small>
                </div>
              ),
            }))}
          />
        </Card>
      </Card>
    </div>
  );
}