import {PATH} from "./PATH.jsx";
import {  Navigate,Routes } from 'react-router-dom';
import PostDetail from  '../pages/PostDetail';
import PostForm from '../pages/PostForm';
import PostList from '../pages/PostList';
import PostEdit from '../pages/PostEdit';
import AppHeader from  '../components/AppHeader';
import React from 'react';
import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
} from 'react-router-dom';
// @ts-ignore
export const router  =  {
    element: <AppHeader/>,
    children: [
                {
                    path: "posts",
                    element: <PostList/>
                },
                {
                    path: `posts/:id`,
                    element: <PostDetail/>
                },
                {
                    path: "posts/edit",
                    element: <PostForm/>
                },
                {
                    path: "write",
                    element: <PostEdit />                }
            ]

                }
