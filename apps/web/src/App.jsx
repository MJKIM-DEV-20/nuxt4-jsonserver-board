import AppHeader from './components/AppHeader.jsx'
import PostDetail from './pages/PostDetail.jsx'
import PostForm from './pages/PostForm.jsx'
import PostList from './pages/PostList.jsx'
import { useRoutes } from 'react-router-dom';
import { router } from './router/router.jsx';


// UI 검수용 하드코딩 값이다. list | detail | form 중 하나로 바꿔 각 화면을 확인한다.
const PREVIEW_SCREEN = 'detail'

const screens = {
  detail: PostDetail,
  form: PostForm,
  list: PostList,
}

export default function App() {
  //const Screen = screens[PREVIEW_SCREEN]

  return (
    <>
      <main id="main" tabIndex="-1" className="shell page">
        <PostList/>
      </main>
    </>
  )
}
