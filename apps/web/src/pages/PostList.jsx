import {Link, NavLink} from "react-router-dom";
import {data, useNavigate} from "react-router";
import {useState,useEffect} from "react";
import axios from "axios";
import {getList} from "../api/api.js";


export function PostList() {
  const [boardList, setBoardList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10); // Number of posts per page, default: 5
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [loading, setLoading] = useState(true);
  const searchParams = new URLSearchParams();
  const page = searchParams.get('page');
  const limit = 10;
  const [totalCount, setTotalCount] = useState(0);

  async function getList () {
    const response = await fetch(`http://localhost:4100/posts`,
        {
          method: 'GET',
        });
    const data = await response.json();
    setBoardList(data);
}


  const indexOfLastItem = currentPage * postsPerPage;
  const indexOfFirstItem = indexOfLastItem - postsPerPage;
  //const currentItems = boardList.slice(indexOfFirstItem, indexOfLastItem);


  useEffect(() => {
    setLoading(true);
    getList().then(({  totalCount }) => {
      setBoardList(data);
      setTotalPages(totalCount);
    })
        .catch((err) => console.error('getPosts error:', err))
        .finally(() => setLoading(false));
  }, []);



  return (
      <>
      <section className="page-intro" aria-labelledby="board-title">
        <div>
          <h1 className="page-title" id="board-title">질문과 해결 방법</h1>
          <p className="page-description">
            미션을 진행하며 생긴 질문과 해결한 방법을 나눠보세요.
          </p>
        </div>
      </section>
          <section className="board-panel" aria-label="게시글 목록">
            {boardList?.map((list, index) => (
                <NavLink to ={`/posts/${list.id}`}>
            <li className="post-item" key={list.index}>
              <div key = {list.id} className="post-item-body">
                <div className="post-item-head">
                  <h2 className="post-item-title"><span>{list?.title}</span></h2>
                </div>
                <div className="post-item-meta">
                  <span className="post-author">{list?.author}</span>
                  <span className="sep" />
                  <span>{list?.date}</span>
                  <span className="sep" />
                  <span>{list.inquries}</span>
                </div>
              </div>
              <div className="post-item-side">
                <span className="reply-count has-replies">
                  <i className="pi pi-comment" aria-hidden="true" />
                  <span className="sr-only">댓글 </span>
                  {list.comment}
                </span>
              </div>
            </li>
                </NavLink>
              ))}
    </section>
    <div className="pager" aria-label="페이지 이동 UI">
      <div>
        <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
        >
          <span className="is-static" aria-label="이전 페이지"><i className="pi pi-chevron-left" aria-hidden="true"/></span>
        </button>
        <span className="is-static" aria-current="page">{currentPage} </span>
        <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastItem >= boardList.length}
        >
          <span className="is-static" aria-label="다음 페이지"><i className="pi pi-chevron-right" aria-hidden="true"/></span>
        </button>
      </div>
    </div>
  </>
)
}
