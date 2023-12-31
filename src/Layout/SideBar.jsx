import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRequest } from "../hooks/api";

export default function SideBar() {
  const [customerInfo, setCustomerInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getCustomerInfo();
  }, []);

  const getCustomerInfo = async () => {
    const data = await getRequest('/user/');
    setCustomerInfo(await data.user);
    localStorage.setItem('name', await data.user.name);
    localStorage.setItem('email', await data.user.email);
    localStorage.setItem('phoneNumber', await data.user.phoneNumber);
  }

  const Logout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  }

  return(
    <div className='customer-info-box'>
      <div className="customer-name-box">
        <img src='/Image/logo.png' alt='' onClick={() => {navigate('/')}} />
        <div className="customer-name">
          <h1>{localStorage.getItem('name')}</h1>
        </div>
      </div>
      <div className='customer-info'>
        <p><b>Email: </b>{localStorage.getItem('email')}</p>
        <p><b>Số điện thoại: </b>{localStorage.getItem('phoneNumber')}</p>
        <p><b>Số thiết bị sở hữu: </b>{customerInfo.deviceCount}</p>
        <div className='customer-info-button'>
          <a href='/update-info' className='update-info'>Sửa thông tin</a>
          <button onClick={Logout}>Đăng xuất</button>
        </div>
      </div>
    </div>
  )
}