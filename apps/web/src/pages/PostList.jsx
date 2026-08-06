import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import {useState,useEffect} from "react";
import axios from "axios";

export function PostList() {
  const [boardList, setBoardList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10); // Number of posts per page, default: 5
  const [totalPages, setTotalPages] = useState(1); // Total number of pages

  useEffect(() => {
    fetch("http://localhost:4100/posts")
        .then((res) => res.json())
        .then((data) => setBoardList(data));
  }, [boardList]);

  console.log(boardList);
  console.log(boardList.length);

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
            {boardList?.data.map((list) => (
            <li className="post-item">
              <div className="post-item-body">
                <div className="post-item-head">
                  <h2 className="post-item-title"><span>{list.title}</span></h2>
                </div>
                <div className="post-item-meta">
                  <span className="post-author">{list.author}</span>
                  <span className="sep" />
                  <span>{list.date}</span>
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
              ))}
    </section>
    <div className="pager" aria-label="페이지 이동 UI">
      <span className="is-disabled" aria-hidden="true"><i className="pi pi-chevron-left"/></span>
      <span className="is-static" aria-current="page">1</span>
      <span className="is-static">2</span>
      <span className="is-static">3</span>
      <span className="is-static" aria-label="다음 페이지"><i className="pi pi-chevron-right" aria-hidden="true"/></span>
    </div>
  </>
)
}
