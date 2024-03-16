import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Home.css';
import DeviceItem from '../../Component/DeviceItem/DeviceItem';
import { getRequest } from '../../hooks/api';
import { socket } from '../../configs/socket';

function Home() {
  const navigate = useNavigate();
  const [allDevices, setAllDevices] = useState([]);
  const accessToken = localStorage.getItem('accessToken')

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
    else {
      GetAllDevices();
      socket.connect(accessToken)
    }
  }, [navigate, accessToken]);

  const GetAllDevices = async () => {
    const data = await getRequest('/device/');
    setAllDevices(data);
  }

  useEffect(() => {
    socket.on('overall', (message) => {
      // console.log(message)
      let newList = []
      allDevices.forEach((value, _index) => {
        if (value._id === message.deviceId) {
          console.log(message.warning, message.state)
          if (message.warning !== undefined) 
            value.warning = message.warning
          if (message.state !== undefined) 
            value.state = message.state
        }
        newList.push(value)
      })
      setAllDevices(newList)
    })
  }, [allDevices])

  return(
    <div className="device-list page-component">
      <h1 className='component-title'>Danh sách thiết bị</h1>
      <div className='grid-container'>
        {allDevices.map((e, index) => 
          <DeviceItem
            key={index}
            id={e._id}
            name={e.name}
            state={e.state}
            warning={e.warning}
          />
        )}
      </div>
    </div>
  )
}

export default Home