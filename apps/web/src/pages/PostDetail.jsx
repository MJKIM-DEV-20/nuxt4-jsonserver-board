import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea'
import {useEffect, useRef, useState} from "react";
import {Link, useParams, NavLink, useNavigate} from "react-router-dom";



export default function PostDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState({});
  const [visible,setVisible] = useState(false);
  const [comment, setComment] = useState([]);
  // const [reply,setReply] = useState("");
  const replyRef = useRef("")
  const [commentCount,setCommentCount] = useState(0);
  const navigate = useNavigate();


  const getBoardDetail = async () => {
    const resp = await fetch(`http://localhost:4100/posts/${id}`,
        {
          method: 'GET',
        });
    const data = await resp.json();
    setBoard(data);
    console.log(data);
    setLoading(false);
  };



  async function getComment() {
    const response = await fetch(
        `http://localhost:4100/comments/?postId=${id}`,
        {
          method: "GET",
        },
    );
    const data = await response.json();
    // console.log(data);
    return data;
  }

  useEffect(() => {
    async function getComments() {
      setLoading(true);
      try {
        const resp = await getComment();
        setComment(resp);
        setCommentCount(resp.length);
        // console.log(resp);
      } finally {
        setLoading(false);
      }
    }

    getComments();
  }, []);

  // async function getComment() {
  //   const response = await fetch(
  //       `http://localhost:4100/comments/?postId=${id}`,
  //       {
  //         method: "GET",
  //       },
  //   );
  //   const data = await response.json();
  //   // console.log(data);
  //   return data;
  // }
  //
  // useEffect(() => {
  //   async function getComments() {
  //     setLoading(true);
  //     try {
  //       const resp = await getComment();
  //       setComment(resp);
  //       setCommentCount(resp.length);
  //       // console.log(resp);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //
  //   getComments();
  // }, []);
  //
  // onSubmit={() => createReply(reply)}


  // const createReply = async () => {
  //   const response = await fetch(`http://localhost:4100/comments`,)
  //
  //
  //
  // }

  const createReply = (e) => {
    e.preventDefault()
    fetch(`http://localhost:4100/comments`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        // cid: cid,
        author: "참치잠만보",
        comment: replyRef.current.value,
        date: new Date(),
      }),
    }).then(res => {
      if (res.ok) {
        alert('생성이 완료됐습니다.')
        setReply()
      } else {
        console.log("error")
      }
    })
  }




  useEffect(() => {
    const getBoardDetail = async () => {
      const resp = await fetch(`http://localhost:4100/posts/${id}`,
          {
            method: 'GET',
          });
      const data = await resp.json();
      setBoard(data);
      console.log(data);
      setLoading(false);
    };

    getBoardDetail();
  }, []);



  const deleteBoard = async (id) => {
    const res = await fetch(`http://localhost:4100/posts/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      navigate(`/`)

    } else {
      console.log('삭제 실패:', res.status);
    }
  }

  return (
    <>
      <span className="back-link is-static">
        <NavLink to ={'/'}>
        <i className="pi pi-chevron-left" aria-hidden="true" />
        전체 글로
          </NavLink>
      </span>
      {/*{ board?.map((item, index) => (*/}
      <article className="card article-card" >

      <h1 className="page-title article-title">{board && board?.title}</h1>

        <div className="post-head">
          <div className="author">
            <span className="author-face" aria-hidden="true">작</span>
            <div>
              <div className="author-name">{board?.author}</div>
              <div className="author-date">{board?.createAt}</div>
            </div>
          </div>
          <div className="stat-row">
            <span aria-label="조회">
              <i className="pi pi-eye" aria-hidden="true" />
              {board?.view}
            </span>
            <span aria-label="댓글 2개">
              <i className="pi pi-comment" aria-hidden="true" />
              2
            </span>
          </div>
        </div>

        <hr className="rule" />

        <div className="post-body">
          {board?.content}
        </div>

        <div className="post-actions">
          <Button type="button" label="글 삭제" severity="danger" icon="pi pi-trash" className="is-static" onClick={() => setVisible(true)} />
          <span className="p-button p-button-secondary is-static" onClick={() => navigate(`/posts/${id}/edit`)}>
            <i className="pi pi-pencil" aria-hidden="true" />
            <span>글 수정</span>
          </span>
        </div>
      </article>
      {/*))}*/}
      <section className="card comments-card">
        <div className="section-heading">
          <div>
            <h2 className="section-title">댓글 {commentCount}개</h2>
            <p>답변이나 참고 자료를 나누면 더 빨리 해결할 수 있어요.</p>
          </div>
        </div>

        <ul className="comment-list">
          {comment?.map((comment,index) => (
          <li className="comment"  key={String(comment.cid)}>
            <span className="comment-face" aria-hidden="true">작</span>
            <div>
              <div className="author-name">
                {comment?.author}
                <span className="author-date comment-when">{comment?.createAt}</span>
              </div>
              <p className="comment-text">{comment?.comment}</p>
            </div>
          </li>
          ))}
        </ul>


        <form className="comment-form field">
          <label className="field-label" htmlFor="comment">댓글 작성</label>
          <InputTextarea
            id="comment"
            rows={3}
            placeholder="해결 방법이나 참고 자료를 알려주세요"
            ref={replyRef}
          />
          <div className="row-end">
            <Button type="button" label="댓글 등록"  onClick={createReply}/>
          </div>
        </form>
      </section>

      {/* 퍼블리싱된 삭제 확인 UI. visible 상태와 이벤트는 인턴이 구현한다. */}
      <Dialog
          visible={visible} onHide={() => setVisible(false)}
          breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '50vw'}}
        header="이 글을 삭제할까요?"
        draggable={false}
        footer={(
          <>
            <Button type="button" label="취소" severity="help" onClick={() => setVisible(false)}/>
            <Button type="button" label="삭제" severity="danger" onClick={(e) => deleteBoard(board?.id)}/>
          </>
        )}
      >
        댓글 2개도 함께 사라지고, 되돌릴 수 없어요.
      </Dialog>
    </>
  )
}
