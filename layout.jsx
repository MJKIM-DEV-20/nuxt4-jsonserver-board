import { Outlet } from 'react-router'
import AppHeader from "./AppHeader.jsx";
import {PostList} from "../pages/PostList.jsx";
export default function DefaultLayout() {
    return (
        <>
            <AppHeader />
            <Outlet/>
        </>
    )
}