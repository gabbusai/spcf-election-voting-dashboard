import React, { useState } from 'react';
import { LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { User, LogIn } from 'lucide-react';

import { loginUser } from '../utils/api';
import { useAuthContext } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { setUser, setToken } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await loginUser(values);
      setToken(response.token);
      message.success('Login successful');
      navigate('/');
    } catch (error) {
      console.error('LOGIN failed:', error);
      message.error('Login failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-10 space-y-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-blue-700 mb-3 flex items-center justify-center">
              <p className="font-title">SPCF</p>
            </h1>
            <p className="text-3xl font-bebasNeue text-blue-600 font-medium">Voting Dashboard</p>
          </div>

          <Form
            layout="vertical"
            onFinish={handleLogin}
            className="space-y-6"
          >
            <Form.Item
              name="student_id"
              rules={[{ required: true, message: 'Please enter your Student ID' }]}
            >
              <Input
                prefix={<IdcardOutlined className="text-blue-500" style={{ fontSize: '24px' }} />}
                placeholder="Student ID"
                size="large"
                className="rounded-lg text-lg h-14"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-blue-500" style={{ fontSize: '24px' }} />}
                placeholder="Email"
                size="large"
                className="rounded-lg text-lg h-14"
              />
            </Form.Item>

            <Form.Item
              name="tokenOTP"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-blue-500" style={{ fontSize: '24px' }} />}
                placeholder="Password"
                size="large"
                className="rounded-lg text-lg h-14"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center text-lg h-14"
              >
                <LogIn className="mr-2" size={28} />
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;