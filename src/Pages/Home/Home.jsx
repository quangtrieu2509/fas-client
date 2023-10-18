import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Home.css';
import DeviceItem from '../../Component/DeviceItem/DeviceItem';
import { getRequest } from '../../hooks/api';

function Home() {
  const navigate = useNavigate();
  const [allDevices, setAllDevices] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
    else {
      GetAllDevices();
    }
  }, [navigate]);

  const GetAllDevices = async () => {
    const data = await getRequest('/device/');
    setAllDevices(await data);
    // console.log(await data);
  }

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
          />
        )}
      </div>
    </div>
  )
}

export default Home