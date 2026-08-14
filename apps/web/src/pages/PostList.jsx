import { NavLink, useSearchParams } from "react-router-dom";
import { data, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import PostListSkeleton from "../components/ContentState.jsx";
import { ContentState } from "../components/ContentState.jsx";
import {useList} from "../hooks/useList.jsx";
import {fetchPost} from "../api/api.js";

export function PostList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("_page") ?? 1);
  const perPage = Number(searchParams.get("_per_page") ?? 10);
  const query = searchParams.get("query") ?? "";
  const notice = searchParams.get("notice") ?? "all";
  const sort = searchParams.get("sort") ?? "latest";

  const { data, total, loading, error } = useList({ page, perPage, query, notice, sort });

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  function updateListParams(overrides) {
    setSearchParams({
      query,
      notice,
      sort,
      _page: 1,
      _per_page: perPage,
      ...overrides,
    });
  }

  const handlePagination = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    updateListParams({ _page: pageNumber });
  };
  const handleNoticeChange = (value) => updateListParams({ notice: value });
  const handleSortChange = (value) => updateListParams({ sort: value });

  // if (loading) {
  //   return <PostListSkeleton rows={perPage} aria-busy="true" />;
  // }
  //
  // if (error) {
  //   return (
  //       <ContentState
  //           icon="pi-exclamation-triangle"
  //           title="게시글을 불러오지 못했습니다"
  //           description={error}
  //           tone="danger"
  //       />
  //   );
  // }
  //
  // if (data.length === 0) {
  //   return (
  //       <ContentState
  //           icon="pi-inbox"
  //           title="게시글이 없습니다"
  //           description={query ? "검색 결과가 없어요." : "아직 등록된 게시글이 없어요."}
  //       />
  //   );
  // }


console.log(data)

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
                  onClick={() => handleNoticeChange("all")}
                  className="tab"
                  aria-pressed="true"
              >
                전체
              </button>
              <button
                  type="button"
                  onClick={() => handleNoticeChange("true")}
                  className="tab"
                  aria-pressed="true"
              >
                공지
              </button>
            </div>
            <div className="toolbar-meta">
              <p className="result-count">{total}개의 글</p>
              <label className="sort-control">
                <span className="sr-only">게시글 정렬</span>
                <select value={sort} onChange={(e) => handleSortChange(e.target.value)}>
                  <option value="latest">최신순</option>
                  <option value="view">조회순</option>
                </select>
                <i className="pi pi-chevron-down" aria-hidden="true" />
              </label>
            </div>
          </div>

          <div className="card card--list">
            <ul className="post-list">
              {loading ? (
                  <PostListSkeleton />
              ) : error ? (
                  <ContentState
                      icon="pi-exclamation-triangle"
                      title="조회에 실패했습니다"
                      description={error}
                      tone="danger"
                  />
              ) : data.length === 0 ? (
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
                    {data && data?.map((list, index) => (
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
                              {list?.commentCount}
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
          {/*  <button*/}
          {/*      onClick={() => handlePagination(currentPage - 1)}*/}
          {/*      disabled={currentPage <= 1}>*/}
          {/*    <i className="pi pi-chevron-left" aria-hidden="true"></i>*/}
          {/*  </button>*/}
          {/*</span>*/}
          {/*  <span className="is-static" aria-current="page">*/}
          {/*  {currentPage}*/}
          {/*</span>*/}

          {/*  /!* 다음 버튼 *!/*/}
          {/*  <span className="is-static" aria-label="다음 페이지">*/}
          {/*  <button*/}
          {/*      onClick={() => handlePagination(currentPage + 1)}*/}
          {/*      disabled={currentPage >= totalPages}*/}
          {/*  >*/}
          {/*    <i className="pi pi-chevron-right" aria-hidden="true" />*/}
          {/*  </button>*/}
            <button disabled={page <= 1} onClick={() => handlePagination(page - 1)}>
          <i className="pi pi-chevron-left" aria-hidden="true"></i>
        </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    aria-current={p === page ? "page" : undefined}
                    onClick={() => handlePagination(p)}
                >
                  {p}
                </button>
            ))}
            <button disabled={page >= totalPages} onClick={() => handlePagination(page + 1)}>
          <i className="pi pi-chevron-right" aria-hidden="true" />
        </button>
          </span>
          </div>
        </div>
      </>
  );
}
