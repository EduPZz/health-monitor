import React, { useContext } from 'react';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message } from 'antd';

import { Context } from "../../context/AuthContext";

import { CardContainer, CentrilizerContainer } from './styles';
import { Link } from 'react-router-dom';

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const { handleLogin } = useContext(Context);

  const successMessage = (success) => {
    messageApi.open({
      type: 'success',
      content: success,
    });
  };

  const errorMessage = (error) => {
    messageApi.open({
      type: 'error',
      content: error,
    });
  };

  const onFinish = async (values) => {
    try {
      values = {
        ...values,
        perfil: values?.perfil ? 'cliente' : 'admin'
      }
      handleLogin(values.email, values.senha, successMessage, errorMessage);
    } catch (error) {
      errorMessage(error.response.data.message);
    }
  };

  return (
    <CardContainer>
      {contextHolder}
      <Card  title="Login" style={{ width: 300, boxShadow: "0 0 40px 4px gray" }}>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
          initialValues={{perfil: true}}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: 'email'
              },
            ]}
          >
            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="senha"
            rules={[
              {
                required: true
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Link to="/signin">
              <p>
                Não possui conta? Registre-se
              </p>
            </Link>
          </Form.Item>

          <Form.Item>
            <CentrilizerContainer>
              <Button type="primary"  htmlType="submit" className="login-form-button">
                Entrar
              </Button>
            </CentrilizerContainer>
          </Form.Item>
        </Form>
      </Card>
    </CardContainer>
  );
};
export default Login;
