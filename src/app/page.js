"use client";

import { Form, Input, Button } from "antd";

export default function Home() {
  const onFinish = async (formObj) => {
    const infoObj = {};
    infoObj.senderName = formObj.senderName;
    infoObj.senderNumber = formObj.senderNumber;

    infoObj.SMSContent = formObj.SMSContent;

    const res = await fetch("/api/sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(infoObj),
    });
  };
  return (
    <main className="min-h-screen">
      <Form
        name="basic"
        className="mx-auto"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div>
          <Form.Item
            label="Sender Number"
            name="senderNumber"
            type={"number"}
            rules={[
              {
                required: true,
                message: "Please input sender's number",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Sender Name"
            name="senderName"
            rules={[
              {
                required: true,
                message: "Please input the sender's name",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="SMSContent"
            label="SMS Content"
            rules={[
              {
                required: true,
                message: "Please input the SMS content",
              },
            ]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
        </div>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </main>
  );
}
