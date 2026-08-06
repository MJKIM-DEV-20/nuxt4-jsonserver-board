import {PATH} from "./PATH.jsx";
import {  Navigate,Routes } from 'react-router-dom';
import PostDetail from  '../pages/PostDetail';
import PostForm from '../pages/PostForm';
import PostList from '../pages/PostList';
import PostEdit from '../pages/PostEdit';
import  DefaultLayout from '../components/layout.jsx';
import {createBrowserRouter} from "react-router";

export const routers = createBrowserRouter([
    {
        element: <DefaultLayout />,
        children: [
            {
                index: true,
                element: (
                    <PostList/>
                ),
            },
            {
                path: 'posts:/id',
                element: (
                    <PostDetail/>
                ),
            },
            {
                path: 'posts/edit/:id',
                element: (
                 <PostEdit/>
                ),
            },
            {
                path: 'posts/write',
                element: (
                    <PostForm/>
                ),
            },
        ],
    }
])

