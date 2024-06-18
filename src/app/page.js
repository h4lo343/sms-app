"use client";

import { Form, Input, Button } from "antd";
import { useState } from "react";

export default function Home() {
  const [deleteNum, setDeleteNum] = useState("");
  const [taskUuid, setTaskUuid] = useState("");
  const deleteTask = async () => {
    await fetch("/api/message", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deleteNum }),
    });
  };
  const getReport = async () => {
    await fetch(`/api/record?taskUuid=${taskUuid}`, {
      method: "GET",
    });
  };
  const testMessage = async () => {
    const infoObj = {
      data: {
        to: ["23123123123123", "61477605786"],
        from: "TopSMS",
        message:
          "Hello {first_name} {last_name}\n\nGet your food here {link}\n\nunsub.au/184",
        scheduleDate: "1718362587000",
        link: "https://eux.com.au/",
        sub: [
          {
            first_name: "Adrian ",
            last_name: "Test",
          },
          {
            first_name: "Joe ",
            last_name: "Z",
          },
        ],
      },
    };
    await fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(infoObj),
    });
  };
  const onFinish = async (formObj) => {
    const infoObj = {};
    infoObj.senderName = formObj.senderName;
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
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        ></Form.Item>
      </Form>
      <Button onClick={testMessage}>Test Message</Button>
      <Input
        onChange={(v) => {
          setDeleteNum(v.target.value);
        }}
        className={"w-24"}
      ></Input>
      <Button onClick={() => deleteTask()}>Delete Task</Button>
      <Input
        onChange={(v) => {
          setTaskUuid(v.target.value);
        }}
        className={"w-24"}
      ></Input>
      <Button onClick={() => getReport()}>Get Report</Button>
    </main>
  );
}
