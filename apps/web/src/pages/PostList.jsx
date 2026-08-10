import { Link, NavLink, useSearchParams } from "react-router-dom";
import { data, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { getList } from "../api/api.js";
import PostListSkeleton from "../components/ContentState.jsx";

export function PostList() {
  const [boardList, setBoardList] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalCount, setTotalCount] = useState(0);

  const currentPage = Number(searchParams.get("_page")) || 1;
  const postPerPage = Number(searchParams.get("_limit")) || 10;

  const totalPages = Math.ceil(totalCount / postPerPage);

  async function getList(page, limit) {
    const response = await fetch(
      `http://localhost:4100/posts?_page=${page}&_per_page=${limit}`,
      {
        method: "GET",
      },
    );
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    async function getLists() {
      const resp = await getList(currentPage, postPerPage);
      setBoardList(resp.data);
    }

    getLists();
  }, [currentPage, postPerPage]);

  //전체 데이터 길이
  useEffect(() => {
    async function getCounts() {
      const res = await fetch("http://localhost:4100/posts");
      const all = await res.json();
      setTotalCount(all.length);
      console.log(all.length);
    }

    getCounts();
  }, []);

  const handlePagination = (pageNumber) => {
    console.log(pageNumber);
    console.log(totalPages);
    console.log(totalCount);
    if (pageNumber < 1 || pageNumber > totalPages) return;

    setSearchParams({
      _page: String(pageNumber),
      _limit: String(postPerPage),
    });
  };

  return (
    <>
      <section className="page-intro" aria-labelledby="board-title">
        <div>
          <h1 className="page-title" id="board-title">
            질문과 해결 방법
          </h1>
          <p className="page-description">
            미션을 진행하며 생긴 질문과 해결한 방법을 나눠보세요.
          </p>
        </div>
      </section>

      {/* {isloading ? (
        <PostListSkeleton />
      ) : ( */}

      <section className="board-panel" aria-label="게시글 목록}">
        {boardList?.map((list, index) => (
          <NavLink to={`/posts/${list.id}`} key={index}>
            <li className="post-item">
              <div key={list.id} className="post-item-body">
                <div className="post-item-head">
                  <h2 className="post-item-title">
                    <span>{list?.title}</span>
                  </h2>
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

      {/* // )} */}

      <div className="pager" aria-label="페이지 이동 UI">
        <div>
          <button
            onClick={() => handlePagination(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <span className="is-static" aria-label="이전 페이지">
              <i className="pi pi-chevron-left" aria-hidden="true" />
            </span>
          </button>
          <span className="is-static" aria-current="page">
            {currentPage}
          </span>

          {/* 다음 버튼 */}
          <button
            onClick={() => handlePagination(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <span className="is-static" aria-label="다음 페이지">
              <i className="pi pi-chevron-right" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
