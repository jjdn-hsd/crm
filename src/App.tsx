import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import Layout from './components/Layout';

function App() {
  return (
    <ConfigProvider>
      <Router>
        <AuthProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;