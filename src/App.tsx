import './App.scss';
import {useConnectSocket} from "./hooks/useConnectSocket";
import {useState} from "react";
import SocketApi from "./api/socket-api";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Rooms from "./pages/Rooms/Rooms";
import Layout from "./pages/Layout/Layout";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";

function App() {
  useConnectSocket();
  const [text, setText] = useState('')
    const sendMessage = () => {
      SocketApi.socket?.emit('chatToServer', {text: text})
    }

  const router = createBrowserRouter(createRoutesFromElements(
      <Route path="/" element={<Layout/>}>
        <Route path="/" element={<Register />}/>
        <Route path="/rooms" element={<Rooms />}/>
        <Route path="/login" element={<Login />}/>
      </Route>
  ))

  return (
      <RouterProvider router={router}/>
  )
}

export default App;
