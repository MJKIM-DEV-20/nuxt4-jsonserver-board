import { Link, NavLink, useSearchParams } from "react-router-dom";
import { data, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import PostListSkeleton from "../components/ContentState.jsx";

export function PostList() {
  const [boardList, setBoardList] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalCount, setTotalCount] = useState(0);

  const currentPage = Number(searchParams.get("_page")) || 1;
  const postPerPage = Number(searchParams.get("_limit")) || 10;

  const totalPages = Math.ceil(totalCount / postPerPage);

  const query = searchParams.get("query") || "";
  const notice = searchParams.get("notice") || "all";
  const sort = searchParams.get("sort") || "latest";

  async function getList(page, limit, query, notice, sort) {
    const params = new URLSearchParams();

    if (query) {
      params.set("q", query);
    }
    if (notice !== "all") {
      params.set("notice", notice);
    }

    if (sort === "view") {
      params.set("_sort", "view");
      params.set("_order", "ASC");
    } else {
      params.set("_sort", "latest");
      params.set("_order", "createAt");
    }

    params.set("_page", String(page));
    params.set("_per_page", String(limit));

    // 페이지네이션

    const response = await fetch(
      `http://localhost:4100/posts?${params.toString()}`,
      {
        method: "GET",
      },
    );
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    async function getLists() {
      setLoading(true);

      try {
        const resp = await getList(
          currentPage,
          postPerPage,
          query,
          notice,
          sort,
        );

        console.log("query:", query);
        console.log("resp:", resp);
        console.log("검색 결과:", resp.data);

        setBoardList(resp.data);
        setTotalCount(resp.items);
      } finally {
        setLoading(false);
      }
    }

    getLists();
  }, [currentPage, postPerPage, query, notice, sort]);


  const handlePagination = (pageNumber) => {
    console.log(pageNumber);
    console.log(totalPages);
    console.log(totalCount);
    if (pageNumber < 1 || pageNumber > totalPages) return;


    setSearchParams({
      query,
      notice,
      sort,
      _page: String(pageNumber),
      _limit: String(postPerPage),
    });
  };

  const noticeTab = (value) => {
    setSearchParams({
      query,
      notice: value,
      sort,
      _page: 1,
      _limit: postPerPage,
    });
  };

  const handlebars = (value) => {
    setSearchParams({
      query,
      notice,
      sort: value,
      _page: 1,
      _limit: postPerPage,
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

      <section className="board-panel" aria-label="게시글 목록">
        <div className="board-toolbar">
          <div className="tabs" role="group" aria-label="게시글 필터">
            <button
              type="button"
              onClick={() => noticeTab("all")}
              className="tab is-active"
              aria-pressed="true"
            >
              전체
            </button>
            <button
              type="button"
              onClick={() => noticeTab("true")}
              className="tab"
              aria-pressed="false"
            >
              공지
            </button>
          </div>
          <div className="toolbar-meta">
            <p className="result-count">{totalCount}개의 글</p>
            <label className="sort-control">
              <span className="sr-only">게시글 정렬</span>
              <select value={sort} onChange={(e) => handlebars(e.target.value)}>
                <option value="latest">최신순</option>
                <option value="view">조회순</option>
              </select>
              <i className="pi pi-chevron-down" aria-hidden="true" />
            </label>
          </div>
        </div>
      </section>

      {isloading ? (
        <PostListSkeleton />
      ) : (
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
      )}

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
