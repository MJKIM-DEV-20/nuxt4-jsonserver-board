import { InputText } from "primereact/inputtext";
import { NavLink } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AppHeader() {
  // const [keywords, setKeywords] = useState([]);
  //const [keyword, setKeyword] = useState('');
  //const [search, setSearch] = useSearchParams()
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [keyword, setKeyword] = useState(query);
  const postPerPage = Number(searchParams.get("_limit")) || 10;
  const notice = searchParams.get("notice") || "all";
  const sort = searchParams.get("sort") || "latest";

  const handleSearch = () => {
    setSearchParams({
      query: keyword,
      notice,
      sort,
      _page: 1,
      _limit: String(postPerPage),
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams({
        query: keyword,
        notice,
        sort,
        _page: "1",
        _limit: String(postPerPage),
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <div className="logo">
          <NavLink to="/">
            <span className="logo-mark" aria-hidden="true">
              M
            </span>
            <span className="logo-copy">
              <strong>개발 미션 게시판</strong>
            </span>
          </NavLink>
        </div>

        <div className="header-actions">
          <div className="search">
            <i className="pi pi-search" aria-hidden="true" />
            <InputText
              type="text"
              value={keyword}
              placeholder="질문이나 해결 방법 검색"
              aria-label="게시글 검색"
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchParams({
                    query: keyword,
                    notice,
                    sort,
                    _page: "1",
                    _limit: String(postPerPage),
                  });
                }
              }}
            />
          </div>
          <NavLink to="/write">
            <span className="p-button header-write is-static">
              <i className="pi pi-plus" aria-hidden="true" />
              <span>글쓰기</span>
            </span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
