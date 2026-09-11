import { Card, Form, Input, Button, Alert, Divider, Row, Col, Typography, Descriptions } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLoginCode } from './Login.code';

const { Title, Text } = Typography;

export default function Login() {
  const { loading, error, onFinish } = useLoginCode();

  return (
    <Row align='middle' justify='center' className='min-h-screen bg-gray-100 p-4'>
      <Col xs={24} sm={20} md={12} lg={8} xl={7} xxl={6}>
        <Card className='shadow-lg'>
          <div className='space-y-6'>
            <div>
              <Title level={3} className='mb-2'>
                管理员登录
              </Title>
              <Text type='secondary'>请输入您的管理员账号和密码</Text>
            </div>

            {error && <Alert type='error' message='登录失败' description={error} showIcon className='mb-4' />}

            <Form
              layout='vertical'
              onFinish={values => {
                void onFinish(values);
              }}
            >
              <Form.Item
                label='用户名'
                name='username'
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' }
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder='请输入管理员用户名' autoComplete='username' />
              </Form.Item>
              <Form.Item
                label='密码'
                name='password'
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder='请输入密码' autoComplete='current-password' />
              </Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit' loading={loading} block>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>

        <div className='text-center mt-4'>
          <Text type='secondary'>© 2024 修仙管理系统</Text>
        </div>

        <Alert className='mt-4' type='info' message='安全提醒' description='请确保在安全的环境下登录，不要在公共场所保存密码。' showIcon />
      </Col>
    </Row>
  );
}
