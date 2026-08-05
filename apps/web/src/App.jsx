import { Card } from 'primereact/card'
import { Route, Routes } from 'react-router-dom'

function Home() {
  return (
    <Card title="게시판">
      <p>여기에 게시글 목록을 구현하세요.</p>
    </Card>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
