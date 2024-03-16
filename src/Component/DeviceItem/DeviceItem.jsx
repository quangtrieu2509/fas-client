import { Switch } from 'antd';
import { useNavigate } from 'react-router-dom';

import './DeviceItem.css';
import { putRequest } from '../../hooks/api';
import { useEffect, useRef, useState } from 'react';

export default function DeviceItem({ id, name, state, warning }) {
  const navigate = useNavigate();
  const [deviceState, setDeviceState] = useState(state)
  const boxWarning = useRef(null);

  const HandleViewDetail = () => {
    navigate(`/device/${id}`);
  }

  const StopPropagation = async (e) => {
    e.stopPropagation();
    setDeviceState(!deviceState);
    const data = await putRequest(`/device/${id}`, { state: !deviceState });
    console.log(data);
  }

  useEffect(() => {
    setDeviceState(state)
  }, [state])

  useEffect(() => {
    var interval;
    if (deviceState && warning) {
      interval = setInterval(async () => {
        boxWarning.current.classList.toggle('device-item-warning');
      }, 500);
    } else boxWarning.current.classList.remove('device-item-warning');

    return () => {
      clearInterval(interval);
    }
  }, [deviceState, warning]);

  return(
    <div 
      className="device-item"
      ref={boxWarning} 
      onClick={HandleViewDetail}
    >
      <div className='text-content'>
        <div className="device-item-text"><b>ID:</b> {id}</div>
        <div className='device-item-text'><b>Tên thiết bị:</b> {name}</div>
      </div>
      <div className="switch-button-box" onClick={StopPropagation}>
        <Switch 
          className='switch-button' 
          checked={deviceState}
          checkedChildren='Bật'
          unCheckedChildren='Tắt'
        />
      </div>
    </div>
  )
}