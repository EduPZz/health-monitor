import React, { useState } from "react";
import { Modal, Input, Button, Form, Space, Typography } from "antd";

const { Title } = Typography;

const AdicionarExercicioModal = ({ isOpen, onClose, onSave }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
        form.resetFields();
        onClose();
      })
      .catch((info) => {
        console.error("A validação falhou:", info);
      });
  };

  return (
    <Modal
      title={<Title level={4}>Adicionar Exercício</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          tipo: "",
          horaInicio: "",
          horaFim: "",
        }}
      >
        <Form.Item
          label="Tipo"
          name="type"
          rules={[{ required: true, message: "Por favor, insira o tipo de exercício!" }]}
        >
          <Input placeholder="Ex.: Corrida, Yoga" />
        </Form.Item>
        <Form.Item
          label="Hora de Início"
          name="beginTime"
          rules={[{ required: true, message: "Por favor, selecione a hora de início!" }]}
        >
          <Input type="datetime-local" />
        </Form.Item>
        <Form.Item
          label="Hora de Término"
          name="endTime"
          rules={[{ required: true, message: "Por favor, selecione a hora de término!" }]}
        >
          <Input type="datetime-local" />
        </Form.Item>
        <Form.Item>
          <Space style={{ width: "100%", justifyContent: "end" }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="primary" htmlType="submit">
              Salvar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AdicionarExercicioModal;
