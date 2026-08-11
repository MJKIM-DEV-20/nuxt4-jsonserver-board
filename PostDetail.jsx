import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useRef, useState } from "react";
import { Link, useParams, NavLink, useNavigate } from "react-router-dom";

export default function PostDetail() {
  const { id } = useParams();
  const postid = id;
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState({});
  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState([]);
  const replyRef = useRef("");
  const [rid, setRid] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditValue(comment.content); // 수정전
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const submitEdit = async (e, commentId) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:4100/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editValue }),
    });
    if (res.ok) {
      setEditingId(null);
      refreshComments();
    }
  };

  async function getComment(id) {
    const response = await fetch(
      `http://localhost:4100/comments?postId=${id}`,
      {
        method: "GET",
      },
    );
    const data = await response.json();
    return data;
  }
  //     const postId = data.map(data=>(data.postid));

  useEffect(() => {
    async function getComments() {
      setLoading(true);
      try {
        const resp = await getComment(id);
        console.log("댓글 응답:", resp); // ← 여기 찍어봐
        setComment(resp);
        setCommentCount(resp.length);
      } finally {
        setLoading(false);
      }
    }
    getComments();
  }, [id]);

  async function refreshComments() {
    const resp = await getComment(id);
    setComment(resp);
    setCommentCount(resp.length);
  }

  const createReply = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:4100/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: id,
        author: "보",
        content: replyRef.current.value,
        createdAt: new Date().toISOString(),
      }),
    });
    if (res.ok) {
      replyRef.current.value = "";
      refreshComments(); // navigate 대신 목록만 갱신
    }
  };

  const deleteComment = async (commentId) => {
    const res = await fetch(`http://localhost:4100/comments/${commentId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      refreshComments(); // navigate 대신 목록만 갱신
    }
  };

  const updateComment = (e, commentId) => {
    e.preventDefault();
    fetch(`http://localhost:4100/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: replyRef.current.value }),
    }).then((res) => {
      if (res.ok) alert("수정 완료");
    });
  };

  //  const getBoardDetail = async () => {
  //     const resp = await fetch(`http://localhost:4100/posts/${id}`, {
  //       method: "GET",
  //     });
  //     const data = await resp.json();
  //     setBoard(data);
  //     console.log(data);
  //     setLoading(false);
  //   };

  useEffect(() => {
    let ignore = false;

    const getBoardDetail = async () => {
      const resp = await fetch(`http://localhost:4100/posts/${id}`, {
        method: "GET",
      });
      const data = await resp.json();

      if (ignore) return;

      await fetch(`http://localhost:4100/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ views: data.views + 1 }),
      });

      setBoard({ ...data, views: data.views + 1 });
      setLoading(false);
    };

    getBoardDetail();

    return () => {
      ignore = true;
    };
  }, [id]);

  const deleteBoard = async (id) => {
    const res = await fetch(`http://localhost:4100/posts/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      navigate("/", { replace: true });
    } else {
      console.log("삭제 실패:", res.status);
    }
  };

  return (
    <>
      <span className="back-link is-static">
        <NavLink to={"/"}>
          <i className="pi pi-chevron-left" aria-hidden="true" />
          전체 글로
        </NavLink>
      </span>
      {/*{ board?.map((item, index) => (*/}
      <article className="card article-card">
        <h1 className="page-title article-title">{board && board?.title}</h1>

        <div className="post-head">
          <div className="author">
            <span className="author-face" aria-hidden="true">
              작
            </span>
            <div>
              <div className="author-name">{board?.author}</div>
              <div className="author-date">{board?.createAt}</div>
            </div>
          </div>
          <div className="stat-row">
            <span aria-label="조회">
              <i className="pi pi-eye" aria-hidden="true" />
              {board?.views}
            </span>
            <span aria-label="댓글">
              <i className="pi pi-comment" aria-hidden="true" />
              {comment.length}
            </span>
          </div>
        </div>

        <hr className="rule" />

        <div className="post-body">{board?.content}</div>

        <div className="post-actions">
          <Button
            type="button"
            label="글 삭제"
            severity="danger"
            icon="pi pi-trash"
            className="is-static"
            onClick={() => setVisible(true)}
          />
          <span
            className="p-button p-button-secondary is-static"
            onClick={() => navigate(`/posts/${id}/edit`)}
          >
            <i className="pi pi-pencil" aria-hidden="true" />
            <span>글 수정</span>
          </span>
        </div>
      </article>
      {/*))}*/}
      <section className="card comments-card">
        <div className="section-heading">
          <div>
            <h2 className="section-title">댓글 {comment.length}개</h2>

            <p>답변이나 참고 자료를 나누면 더 빨리 해결할 수 있어요.</p>
          </div>
        </div>
        <ul className="comment-list">
          {comment &&
            comment?.map((comment, index) => (
              <li className="comment" key={comment.id}>
                <span className="comment-face" aria-hidden="true">
                  {comment?.author?.split("")[0]}
                </span>
                <div>
                  <div className="author-name">
                    {comment?.author}
                    <span className="author-date comment-when">
                      {comment?.createdAt}
                    </span>
                  </div>

                  {editingId === comment.id ? (
                    <form
                      className="comment-form field"
                      onSubmit={(e) => submitEdit(e, comment.id)}
                    >
                      <label className="field-label" htmlFor="comment">
                        댓글 수정
                      </label>
                      <InputTextarea
                        id="comment"
                        rows={3}
                        placeholder="해결 방법이나 참고 자료를 알려주세요"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                      <div className="row-end">
                        <Button type="submit" label="댓글 등록" />
                        <Button
                          type="button"
                          label="댓글 취소"
                          onClick={cancelEdit}
                        />
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="comment-text">{comment?.content}</p>
                      <button
                        className="comment-button"
                        onClick={() => deleteComment(comment?.id)}
                      >
                        댓글 삭제
                      </button>
                      <button
                        className="comment-button"
                        onClick={() => startEdit(comment)}
                      >
                        댓글 수정
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
        </ul>

        <form className="comment-form field">
          <label className="field-label" htmlFor="comment">
            댓글 작성
          </label>
          <InputTextarea
            id="comment"
            rows={3}
            placeholder="해결 방법이나 참고 자료를 알려주세요"
            ref={replyRef}
          />
          <div className="row-end">
            <Button type="button" label="댓글 등록" onClick={createReply} />
          </div>
        </form>
      </section>

      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
        header="이 글을 삭제할까요?"
        draggable={false}
        footer={
          <>
            <Button
              type="button"
              label="취소"
              severity="help"
              onClick={() => setVisible(false)}
            />
            <Button
              type="button"
              label="삭제"
              severity="danger"
              onClick={(e) => deleteBoard(board?.id)}
            />
          </>
        }
      >
        댓글 {comment.length}개도 함께 사라지고, 되돌릴 수 없어요.
      </Dialog>
    </>
  );
}
