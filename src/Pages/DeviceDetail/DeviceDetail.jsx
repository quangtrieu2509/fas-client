import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertOutlined } from '@ant-design/icons';
import { Switch } from 'antd';

import './DeviceDetail.css';
import { getRequest, putRequest } from '../../hooks/api';
import TempChart from './TempChart';

export default function DeviceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ device, setDevice ] = useState({});
  const [ val, setVal ] = useState({});
  const [ deviceState, setDeviceState ] = useState();
  const boxWarning = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }

    const GetSystem = async () => {
      const data = getRequest(`/device/${id}`);
      setDevice(await data);
      const { state } = await data
      if (await state) {
        setDeviceState(true);
      } else setDeviceState(false);
    }
    GetSystem();
  }, [navigate, id]);

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     const data = getRequest(`/params/${id}`);
  //     console.log(await data);
  //     if (await data) {
  //       setVal(await data);
  //     }
  //     // console.log(val);
  //   }, 3000);

  //   var interval2;
  //   if (val?.warning) {
  //     interval2 = setInterval(async () => {
  //       boxWarning.current.classList.toggle('box-warning');
  //     }, 1000);
  //   } else boxWarning.current.classList.remove('box-warning');

  //   return () => {
  //     clearInterval(interval);
  //     clearInterval(interval2);
  //   }
  // }, [id, val?.warning]);

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
      console.log(await data);
      setDevice({...device, name: newName});
      CloseUpdateNameBox();
    }
  }

  const ChangeState = async () => {
    // let state;
    // if (deviceState)
    //   state = 0;
    // else state = 1;
    // console.log(id)
    // console.log(state)
    setDeviceState(!deviceState);
    const data = await putRequest(`/device/${id}`, { state: !deviceState });
    console.log(await data);
    
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
          val?.warning ?
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
        {/* <div className='text-content'>
          <b>Độ ẩm: </b> {val.humid}%
        </div> */}
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
        {/* <div className='chart-box'>
          <TempChart 
            val={val?.humid ? Math.round(val?.humid) : 0} 
            name='Độ ẩm' 
          />
          <h3>Biểu đồ độ ẩm</h3>
        </div> */}
        <div className='chart-box'>
          <TempChart 
            val={val?.gas ? Math.round(val?.gas) : 0} 
            name='Gas'
          />
          <h3>Biểu đồ gas</h3>
        </div>
        <div className='chart-box'>
          <TempChart 
            val={val?.fire ? Math.round(val?.fire) : 4000} 
            name='Lửa'
          />
          <h3>Biểu đồ lửa</h3>
        </div>
      </div>
    </div>
  )
}