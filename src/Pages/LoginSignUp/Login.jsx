import { useEffect, useState } from "react";
import { Input, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";

import "./LoginSignUp.css";
import { postRequest } from "../../hooks/api";
import ErrorMessage from "../../Component/ErrorMessage/ErrorMessage";

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [errorMessage, setErrorMesssage] = useState(null);

  useEffect(() => {
    if(localStorage.getItem('accessToken'))
      navigate('/');
  });

  const handleLogin = async () => {
    const { phoneNumber, password } = form.getFieldValue();
    const data = await postRequest('/user/login', {
      phoneNumber,
      password
    });
    const error = await data.error;
    if (error) {
      setErrorMesssage(error);
    }
    else {
      localStorage.setItem('accessToken', await data.accessToken);
      navigate('/');
    }
  };

  return (
    <>
    <div className="space">
      <div className="white-box-page">
        <div className="box-title">Đăng nhập</div>
        <p className="box-text">
          Hãy nhập số điện thoại và mật khẩu để đăng nhập.
        </p>
        <Form form={form}>
          <Form.Item
            name="phoneNumber"
            rules={[{ required: true, message: "Cần nhập số điện thoại!" }]}
          >
            <Input className="box-input" placeholder="Số điện thoại" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Cần nhập mật khẩu!" }]}
          >
            <Input.Password
              className="box-input"
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              className="box-button"
              type="primary"
              onClick={handleLogin}
              htmlType="submit"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <p className="box-text">
          Bạn chưa có tài khoản?&nbsp;
          <a style={{ textDecoration: "underline" }} href="/signup">
            Đăng kí ngay.
          </a>
        </p>
      </div>
    </div>
    <ErrorMessage 
        errorMessage={errorMessage} 
        setErrorMesssage={setErrorMesssage}
      />
    </>
  );
}

export default Login;
