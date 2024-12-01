import React, { useContext } from "react";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Switch, message } from "antd";

import { Context } from "../../context/AuthContext";
import api from "../../services/api";

import { CardContainer, CentrilizerContainer } from "./styles";
import { Link } from "react-router-dom";

const Signup = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const { handleLogin } = useContext(Context);

  const userTimeZone =
    Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone ?? "UTC";

  const successMessage = (success) => {
    messageApi.open({
      type: "success",
      content: success,
    });
  };

  const errorMessage = (error) => {
    messageApi.open({
      type: "error",
      content: error,
    });
  };

  const onFinish = async (values) => {
    try {
      values = {
        password: values.senha,
        email: values.email,
        name: values.nome,
        timezone: userTimeZone,
      };
      await api.post("/auth/signup", values);
      handleLogin(values.email, values.password, successMessage, errorMessage);
    } catch (error) {
      errorMessage(error.response.data.message);
    }
  };

  return (
    <CardContainer>
      {contextHolder}
      <Card
        title="Registrar-se"
        style={{ width: 300, boxShadow: "0 0 40px 4px gray" }}
      >
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
          <Form.Item
            name="nome"
            rules={[
              {
                required: true,
                message: "Digite seu nome!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Nome"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Digite um email válido!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="senha"
            rules={[
              {
                required: true,
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#&])[A-Za-z\d@$!%*#&]{8,}$/,
                message: "Digite uma senha mais forte!",
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
            <Link to="/login">
              <p>Já possui conta? Entre</p>
            </Link>
          </Form.Item>

          <Form.Item>
            <CentrilizerContainer>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Registrar-se
              </Button>
            </CentrilizerContainer>
          </Form.Item>
        </Form>
      </Card>
    </CardContainer>
  );
};
export default Signup;
