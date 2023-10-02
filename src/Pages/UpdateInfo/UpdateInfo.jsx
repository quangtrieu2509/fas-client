// css cho component này tại file UpdateInfo.css
// Các element thêm vào trong thẻ div.update-info
import './UpdateInfo.css';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { putRequest } from '../../hooks/api';
import ErrorMessage from "../../Component/ErrorMessage/ErrorMessage";

export default function UpdateInfo() {
  const [ form ] = Form.useForm();
  const navigate = useNavigate();
  const [ errorMessage, setErrorMesssage ] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = async (value) => {
    console.log({
      name: value.customerName,
      email: value.email,
      phoneNumber: value.phoneNumber
    });

    const data = await putRequest('/user', {
      name: value.customerName,
      email: value.email,
      phoneNumber: value.phoneNumber
    });
    const msg = await data.message;
    if (!msg) {
      setErrorMesssage(msg);
    }
    else {
      alert('Thành công!');
      navigate('/');
    }
  }

  return (
    <>
      <div className="update-info page-component">
        <h1 className="component-title">Chỉnh sửa thông tin</h1>
        <Form
          className="form-change-info"
          form={form}
          onFinish={(value) => handleChange(value)}
        >
          <h2>Tên khách hàng</h2>
          <Form.Item
            name="customerName"
            initialValue={localStorage.getItem('name')}
          >
            <Input className="box-input" size="large" />
          </Form.Item>
          <h2>Email</h2>
          <Form.Item
            name="email"
            initialValue={localStorage.getItem('email')}
            rules={[
              { required: true, message: "Cần nhập email!" },
              { type: "email", message: "Sai định dạng email" },
            ]}
          >
            <Input className="box-input" size="large" />
          </Form.Item>
          <h2>Số điện thoại</h2>
          <Form.Item
            name="phoneNumber"
            initialValue={localStorage.getItem('phoneNumber')}
          >
            <Input className="box-input" size="large" />
          </Form.Item>
          <Button
            className='box-button'
            htmlType='submit'
          >
            Xác nhận
          </Button>
        </Form>
        <p className='change-password'>
          Bạn muốn đổi mật khẩu?&nbsp;
          <a href='/change-password'>Đổi mật khẩu</a>
        </p>
      </div>
      <ErrorMessage 
        errorMessage={errorMessage} 
        setErrorMesssage={setErrorMesssage}
      />
    </>
  );
}