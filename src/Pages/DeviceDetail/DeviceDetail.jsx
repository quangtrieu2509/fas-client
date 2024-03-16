import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertOutlined } from '@ant-design/icons';
import { Switch } from 'antd';

import './DeviceDetail.css';
import { getRequest, putRequest } from '../../hooks/api';
import TempChart from './TempChart';
import { socket } from '../../configs/socket';

export default function DeviceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ device, setDevice ] = useState({});
  const [ val, setVal ] = useState({});
  const [ deviceState, setDeviceState ] = useState(false);
  const boxWarning = useRef(null);
  const accessToken = localStorage.getItem('accessToken')

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }

    const GetSystem = async () => {
      const data = await getRequest(`/device/${id}`);
      setDevice(data);
      setDeviceState(data.state ?? false);
    }
    GetSystem();
    socket.connect(accessToken)
  }, [navigate, id, accessToken]);

  useEffect(() => {
    var interval;
    if (deviceState && val?.warning) {
      interval = setInterval(async () => {
        boxWarning.current.classList.toggle('box-warning');
      }, 1000);
    } else boxWarning.current.classList.remove('box-warning');

    return () => {
      clearInterval(interval);
    }
  }, [deviceState, id, val?.warning]);

  useEffect(() => {
    socket.on(id.toString(), (message) => {
      setVal(message)
    })
  }, [val, id])

  useEffect(() => {
    if (!deviceState) setVal({})
    socket.on('overall', (message) => {
      if (id.toString() === message.deviceId) {
        if (message.state !== undefined) 
          setDeviceState(message.state)
      }
    })
  }, [deviceState, id])

  const OpenUpdateNameBox = () => {
    document.getElementById('update-name-box').classList.remove('hide');
  }

  const CloseUpdateNameBox = () => {
    document.getElementById('update-name-box').classList.add('hide');
  }

  const UpdateName = async () => {
    const newName = document.getElementById('new-device-name').value;
    if (newName === '') { alert('Cần nhập gồm ít nhất 1 kí tự!'); }
    else {
      const data = await putRequest(`/device/${id}`, { name: newName });
      console.log(data);
      setDevice({...device, name: newName});
      CloseUpdateNameBox();
    }
  }

  const ChangeState = async () => {
    setDeviceState(!deviceState);
    const data = await putRequest(`/device/${id}`, { state: !deviceState });
    console.log(data);
  }

  return (
    <div ref={boxWarning} className="device-detail page-component">
      <h1 className='component-title'>Chi tiết thiết bị</h1>
      <div className='device-info'>
        <div className='device-info-box'>
          <div className='text-content id-content'>
            <b>Mã thiết bị:</b> {id}
          </div>
          <div className="name-content">
            <div className='text-content'>
              <b>Tên thiết bị:</b> {device.name}
            </div>
            <div className='update-name'>
              <button onClick={OpenUpdateNameBox}>Đổi tên</button>
              <div id='update-name-box' className="update-name-box hide">
                <input id='new-device-name' placeholder='Nhập tên mới' />
                <button
                  style={{ backgroundColor: 'rgb(73, 221, 73)', color: 'white' }}
                  onClick={UpdateName}
                >Xác nhận</button>
                <button
                  style={{ backgroundColor: 'rgb(216, 77, 81)', color: 'white' }}
                  onClick={CloseUpdateNameBox}
                >Hủy</button>
              </div>
            </div>
          </div>
        </div>
        {
          <Switch
            className='switch-button'
            checked={deviceState}
            checkedChildren='Bật'
            unCheckedChildren='Tắt'
            onClick={ChangeState}
          />
        }
        
        {
          deviceState && val?.warning ?
          <div className='warning'>
            <AlertOutlined /> Nguy hiểm!
          </div>
          :
          <div className='warning ok-state'>
            Trạng thái tốt
          </div>
        }
      </div>
      
      <div className="param-content">
        <div className='text-content'>
          <b>Nhiệt độ: </b> {val.temp}°C
        </div>
        <div className='text-content'>
          <b>Lửa: </b> {val.fire}
        </div>
        <div className='text-content'>
          <b>Gas: </b> {val.gas} PPM
        </div>
      </div>
      <div className='grid-chart-content'>
        <div className='chart-box'>
          <TempChart 
            val={val?.temp ? Math.round(val?.temp) : 0} 
            name='Nhiệt độ' />
          <h3>Biểu đồ nhiệt độ</h3>
        </div>
        <div className='chart-box'>
          <TempChart 
            val={val?.gas ? Math.round(val?.gas) : 0} 
            name='Gas'
          />
          <h3>Biểu đồ gas</h3>
        </div>
        <div className='chart-box'>
          <TempChart 
            val={val?.fire ? Math.round(val?.fire) : 0} 
            name='Lửa'
          />
          <h3>Biểu đồ lửa</h3>
        </div>
      </div>
    </div>
  )
}