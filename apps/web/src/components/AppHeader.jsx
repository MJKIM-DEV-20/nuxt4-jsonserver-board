import { InputText } from 'primereact/inputtext'
import { NavLink}  from "react-router-dom";
import {useSearchParams} from "react-router-dom";
import {useState} from "react";


export default function AppHeader() {
  // const [keywords, setKeywords] = useState([]);
  //const [keyword, setKeyword] = useState('');
  //const [search, setSearch] = useSearchParams()
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ page: '1', q: searchInput });
  };

  const handleResetSearch = () => {
    setSearchInput('');
    setSearchParams({ page: '1' });
  };



  return (
    <header className="site-header">
      <div className="shell header-inner">

        <div className="logo">
          <NavLink to="/">
          <span className="logo-mark" aria-hidden="true">M</span>
          <span className="logo-copy"><strong>개발 미션 게시판</strong></span>
          </NavLink>
        </div>

        <div className="header-actions">
          <div className="search">
            <i className="pi pi-search" aria-hidden="true" />
            <InputText
              type="search"
              placeholder="질문이나 해결 방법 검색"
              aria-label="게시글 검색"
              onClick={handleSearch}
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
  )
}
