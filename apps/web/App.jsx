import AppHeader from "./components/AppHeader.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import PostForm from "./pages/PostForm.jsx";
import { PostList } from "./pages/PostList.jsx";
import { createBrowserRouter } from "react-router";

import { Routes, Route } from "react-router-dom";
import PostEdit from "./pages/PostEdit.jsx";
// UI 검수용 하드코딩 값이다. list | detail | form 중 하나로 바꿔 각 화면을 확인한다.
const PREVIEW_SCREEN = "detail";

const screens = {
  detail: PostDetail,
  form: PostForm,
  list: PostList,
};

export default function App() {
  //const Screen = screens[PREVIEW_SCREEN]

  return (
    <>
      <main id="main" tabIndex="-1" className="shell page" />
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id/edit" element={<PostForm />} />
        <Route path="/write" element={<PostForm />} />
        <Route path="Posts/:id" element={<PostDetail />} />
      </Routes>
    </>
  );
}
