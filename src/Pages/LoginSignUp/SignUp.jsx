// import styled from "styled-components"
import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";

import "./LoginSignUp.css";
import { postRequest } from "../../hooks/api";
import ErrorMessage from "../../Component/ErrorMessage/ErrorMessage";

function SignUp() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [ errorMessage, setErrorMesssage ] = useState(null);

  useEffect(() => {
    if(localStorage.getItem('accessToken'))
      navigate('/');
  });

  const handleSignUp = async () => {
    const { username, password, name, email, phone } = form.getFieldValue();
    
    let data = await postRequest('/register', {
      username,
      password,
      name,
      email,
      phone
    });

    const error = await data.message;
    if (error) {
      setErrorMesssage(error);
    }
    else {
      alert('Đăng kí thành công');
      navigate('/login');
    }
  };

  return (
    <>
      <div className="space">
      <div className="white-box-page">
        <div className="box-title">Đăng kí</div>
        <p className="box-text">
          Hãy điền đầy đủ thông tin để đăng ký tài khoản
        </p>
        <Form form={form} onFinish={handleSignUp}>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Cần nhập tên đăng nhập!" }
            ]}
          >
            <Input className="box-input" placeholder="Tên đăng nhập" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Cần nhập mật khẩu!" },
              { min: 8, message: "Mật khẩu cần ít nhất 8 kí tự" },
              {
                pattern: new RegExp(/^[a-zA-Z0-9]*$/),
                message: "Mật khẩu không chứa kí tự đặc biệt và dấu cách",
              },
            ]}
          >
            <Input.Password
              className="box-input"
              placeholder="Mật khẩu"
              size="large"
              style={{ zIndex: 1 }}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Cần xác nhận lại mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  } else return Promise.reject("Mật khẩu xác nhận không khớp");
                },
              }),
            ]}
          >
            <Input.Password
              className="box-input"
              placeholder="Xác nhận mật khẩu"
              size="large"
            />
            {/* <p style={{margin: '0'}}>Abc</p> */}
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Cần nhập email!" },
              { type: "email", message: "Sai định dạng email" },
            ]}
          >
            <Input className="box-input" placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Cần nhập họ và tên!" },
            ]}
          >
            <Input className="box-input" placeholder="Họ và tên" size="large" />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Cần nhập số điện thoại!" },
              {
                pattern: new RegExp(/^[0-9]*$/),
                message: "Số điện thoại chỉ chứa số"
              },
            ]}
          >
            <Input className="box-input" placeholder="Số điện thoại" size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              className="box-button"
              type="primary"
              htmlType="submit"
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>
      </div>
      <ErrorMessage 
        errorMessage={errorMessage} 
        setErrorMesssage={setErrorMesssage}
      />
    </>
  );
}

export default SignUp;
