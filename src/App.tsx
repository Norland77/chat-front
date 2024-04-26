import './App.scss';
import {useEffect} from "react";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import {useAppDispatch, useAppSelector} from "./hooks/redux";
import Room from "./pages/Room/Room";
import {setId, setName, setToken} from "./store/reducers/UserSlice";
import {IUser} from "./interfaces/IChat";
import {jwtDecode} from "jwt-decode";
import Home from "./pages/Home/Home";
import RoomCreateModal from "./components/RoomCreateModal/RoomCreateModal";
import InvitePage from "./pages/InvitePage/InvitePage";
import {authAPI} from "./services/AuthServices";
import UsersListModal from "./components/UsersListModal/UsersListModal";
import Profile from "./pages/Profile/Profile";
import ProfileEdit from "./pages/ProfileEdit/ProfileEdit";

function App() {
  const { accessToken } = useAppSelector(state => state.userReducer)
    const {data: token, isSuccess, isError,isLoading} = authAPI.useRefreshQuery(null);
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (token) {
            dispatch(setToken(token.accessToken))
            const user: IUser = jwtDecode(token.accessToken);
            dispatch(setName(user.username))
            dispatch(setId(user.id))
        }
    }, [token]);
  const router = createBrowserRouter(createRoutesFromElements(
      <Route path="/" element={<Layout/>}>
        <Route path="/" element={<Register />}/>
        <Route path="/login" element={
            <Login />
        }/>
        <Route path="/:token" element={<InvitePage />}/>
        <Route path={"/home"} element={
            <ProtectedRoute isError={isError} isLoading={isLoading} user={accessToken} redirectPath={"/login"}>
                <Home />
            </ProtectedRoute>
        }>
            <Route path={"/home/room/:Id"} element={
                <ProtectedRoute isError={isError} isLoading={isLoading} user={accessToken} redirectPath={"/login"}>
                    <Room />
                </ProtectedRoute>
            }/>
            <Route path={"/home/profile"} element={<Profile />}/>
        </Route>
      </Route>
  ))


  return (
      <>
          {isSuccess && accessToken ? (
              <RouterProvider router={router}/>
          ) : isError && <RouterProvider router={router}/>}
      </>
  )
}

export default App;
