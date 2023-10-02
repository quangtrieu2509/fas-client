import { Switch } from 'antd';
import { useNavigate } from 'react-router-dom';

import './DeviceItem.css';
import { putRequest } from '../../hooks/api';
import { useState } from 'react';

export default function DeviceItem({ id, name, state }) {
  const navigate = useNavigate();
  const [deviceState, setDeviceState] = useState(state)

  const HandleViewDetail = () => {
    navigate(`/device/${id}`);
  }

  const StopPropagation = async (e) => {
    e.stopPropagation();
    setDeviceState(!deviceState);
    const data = await putRequest(`/device/${id}`, { state: !deviceState });
    console.log(await data);
  }

  return(
    <div className="device-item" onClick={HandleViewDetail}>
      <div className='text-content'>
        <div className="device-item-text"><b>ID:</b> {id}</div>
        <div className='device-item-text'><b>Tên thiết bị:</b> {name}</div>
      </div>
      <div className="switch-button-box" onClick={StopPropagation}>
        <Switch 
          className='switch-button' 
          defaultChecked={deviceState}
          checkedChildren='Bật'
          unCheckedChildren='Tắt'
        />
      </div>
    </div>
  )
}