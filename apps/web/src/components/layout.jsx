import { Outlet } from 'react-router'
import AppHeader from "./AppHeader.jsx";
import {PostList} from "../pages/PostList.jsx";



export default function DefaultLayout() {
    return (
        <>
            <Toast ref={(el) => (toastRef.current = el)} />
            <AppHeader />
            <Outlet/>
        </>
    )
}