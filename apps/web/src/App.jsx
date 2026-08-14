import PostDetail from "./pages/PostDetail.jsx";
import PostForm from "./pages/PostForm.jsx";
import { PostList } from "./pages/PostList.jsx";
import { Routes, Route } from "react-router-dom";
import { Toast } from "primereact/toast";
export const toastRef = { current: null };

export default function App() {

    return (
        <>
            <Toast ref={(el) => (toastRef.current = el)} />
            <main id="main" tabIndex="-1" className="shell page" >
            <Routes>
                <Route path="/" element={<PostList />} />
                <Route path="/posts/:id/edit" element={<PostForm />} />
                <Route path="/write" element={<PostForm />} />
                <Route path="posts/:id" element={<PostDetail />} />
            </Routes>
            </main>
        </>
    );
}