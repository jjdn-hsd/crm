import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, DollarOutlined, FunnelPlotOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalCustomers: number;
  totalDeals: number;
  totalRevenue: number;
  openDeals: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalDeals: 0,
    totalRevenue: 0,
    openDeals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [customersCount, dealsData] = await Promise.all([
          supabase.from('customers').select('id', { count: 'exact' }),
          supabase.from('deals').select('amount, stage'),
        ]);

        const deals = dealsData.data || [];
        const totalRevenue = deals.reduce((sum, deal) => sum + (deal.amount || 0), 0);
        const openDeals = deals.filter(deal => 
          !['closed_won', 'closed_lost'].includes(deal.stage)
        ).length;

        setStats({
          totalCustomers: customersCount.count || 0,
          totalDeals: deals.length,
          totalRevenue,
          openDeals,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Customers"
              value={stats.totalCustomers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Deals"
              value={stats.totalDeals}
              prefix={<FunnelPlotOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Open Deals"
              value={stats.openDeals}
              prefix={<FunnelPlotOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}