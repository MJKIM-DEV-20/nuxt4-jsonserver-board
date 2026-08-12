import { Link, NavLink, useSearchParams } from "react-router-dom";
import { data, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import PostListSkeleton from "../components/ContentState.jsx";
import { ContentState } from "../components/ContentState.jsx";

export function PostList() {
  const [boardList, setBoardList] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalCount, setTotalCount] = useState(0);
  const currentPage = Number(searchParams.get("_page")) || 1;
  const postPerPage = Number(searchParams.get("_limit")) || 10;
  const totalPages = Math.ceil(totalCount / postPerPage);
  const [error, setError] = useState(null);
  const query = searchParams.get("query") || "";
  const notice = searchParams.get("notice") || "all";
  const sort = searchParams.get("sort") || "latest";

  async function getList(page, limit, query, notice, sort) {
    const params = new URLSearchParams();

    if (notice !== "all") {
      params.set("notice", notice);
    }

    if (sort === "view") {
      params.set("_sort", "-views");
    } else {
      params.set("_sort", "-createdAt");
    }

    if (query) {
      const response = await fetch(
        `http://localhost:4100/posts?${params.toString()}`,
      );
      let data = await response.json();

      const q = query.toLowerCase();
      data = data.filter((post) =>
        Object.values(post).some((v) => String(v).toLowerCase().includes(q)),
      );

      const total = data.length;
      const start = (page - 1) * limit;
      const paged = data.slice(start, start + limit);
      return { data: paged, total };
    }

    params.set("_page", String(page));
    params.set("_per_page", String(limit));
    const response = await fetch(
      `http://localhost:4100/posts?${params.toString()}`,
    );
    const raw = await response.json();

    return { data: raw.data, total: raw.items };
  }

  useEffect(() => {
    let ignore = false;

    async function fetchList() {
      setLoading(true);
      try {
        const resp = await getListWithCommentCounts(
          currentPage,
          postPerPage,
          query,
          notice,
          sort,
        );
        if (!ignore) {
          setBoardList(resp.data);
          setTotalCount(resp.total);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchList();
    return () => {
      ignore = true;
    };
  }, [currentPage, postPerPage, query, notice, sort]);

  async function getListWithCommentCounts(page, limit, query, notice, sort) {
    const { data, total } = await getList(page, limit, query, notice, sort);

    const commentsRes = await fetch(`http://localhost:4100/comments`);
    const allComments = await commentsRes.json();

    const countMap = allComments.reduce((acc, c) => {
      acc[c.postId] = (acc[c.postId] || 0) + 1;
      return acc;
    }, {});

    const withCounts = data.map((post) => ({
      ...post,
      commentCount: countMap[post.id] || 0,
    }));

    return { data: withCounts, total };
  }

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
            {/*<button type="button" className="tab is-active" aria-pressed="true">전체</button>*/}
            {/*<button type="button" className="tab" aria-pressed="false">공지</button>*/}
            <button
              type="button"
              onClick={() => noticeTab("all")}
              className="tab"
              aria-pressed="true"
            >
              전체
            </button>
            <button
              type="button"
              onClick={() => noticeTab("true")}
              className="tab"
              aria-pressed="true"
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

        <div className="card card--list">
          <ul className="post-list">
            {isloading ? (
              <PostListSkeleton />
            ) : error ? (
              <ContentState
                icon="pi-exclamation-triangle"
                title="조회에 실패했습니다"
                description={error}
                tone="danger"
              />
            ) : boardList.length === 0 ? (
              <ContentState
                icon="pi-inbox"
                title="검색 결과가 없습니다"
                description={
                  query
                    ? `'${query}'에 대한 결과가 없습니다.`
                    : "게시글이 없습니다."
                }
              />
            ) : (
              <section className="board-panel" aria-label="게시글 목록}">
                {boardList &&
                  boardList?.map((list, index) => (
                    <NavLink
                      to={`/posts/${list.id}`}
                      key={index}
                      className="Nav"
                    >
                      {list?.notice === true ? (
                        <li className="post-item is-notice">
                          <div className="post-item-body">
                            <div className="post-item-head">
                              <span className="pill-notice">공지</span>
                              <h2 className="post-item-title">
                                <span>{list?.title}</span>
                              </h2>
                            </div>
                            <div className="post-item-meta">
                              <span className="post-author">
                                {list?.author}
                              </span>
                              <span className="sep" />
                              <span>{list?.createdAt}</span>
                              <span className="sep" />
                              <span>조회 {list?.views}</span>
                            </div>
                          </div>
                          <div className="post-item-side">
                            <span className="reply-count has-replies">
                              <i className="pi pi-comment" aria-hidden="true" />
                              <span className="sr-only">댓글 </span>
                              {list?.comment?.length()}
                            </span>
                          </div>
                        </li>
                      ) : (
                        <li className="post-item">
                          <div key={list.id} className="post-item-body">
                            <div className="post-item-head">
                              <h2 className="post-item-title">
                                <span>{list?.title}</span>
                              </h2>
                            </div>
                            <div className="post-item-meta">
                              <span className="post-author">
                                {list?.author}
                              </span>
                              <span className="sep" />
                              <span>{list?.createdAt}</span>
                              <span className="sep" />
                              <span>조회 {list?.views}</span>
                            </div>
                          </div>
                          <div className="post-item-side">
                            <span className="reply-count has-replies">
                              <i className="pi pi-comment" aria-hidden="true" />
                              <span className="sr-only">댓글 </span>
                              {list?.commentCount}
                            </span>
                          </div>
                        </li>
                      )}
                    </NavLink>
                  ))}
              </section>
            )}
          </ul>
        </div>
      </section>

      <div className="pager" aria-label="페이지 이동 UI">
        <div>
          <span className="is-static" aria-label="이전 페이지">
            <button
              onClick={() => handlePagination(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <i className="pi pi-chevron-left" aria-hidden="true"></i>
            </button>
          </span>
          <span className="is-static" aria-current="page">
            {currentPage}
          </span>

          {/* 다음 버튼 */}
          <span className="is-static" aria-label="다음 페이지">
            <button
              onClick={() => handlePagination(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <i className="pi pi-chevron-right" aria-hidden="true" />
            </button>
          </span>
        </div>
      </div>
    </>
  );
}
