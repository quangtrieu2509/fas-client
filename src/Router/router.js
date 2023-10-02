import DeviceDetail from '../Pages/DeviceDetail/DeviceDetail'
import Home from '../Pages/Home/Home'
import UpdateInfo from '../Pages/UpdateInfo/UpdateInfo'

export const PUBLIC_ROUTER = [
  {
    key: "home",
    path: '/',
    element: <Home/>,
  },
  {
    key: 'update-info',
    path: '/update-info',
    element: <UpdateInfo />,
  },
  {
    key: 'device',
    path: '/device/:id',
    element: <DeviceDetail />
  }
]