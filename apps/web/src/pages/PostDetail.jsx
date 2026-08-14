import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
    ArticleSkeleton,
    ContentState,
    CommentSkeleton,
} from "../components/ContentState.jsx";
import {toastRef} from "../App.jsx";

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [board, setBoard] = useState(null);
    const [boardLoading, setBoardLoading] = useState(true);
    const [boardError, setBoardError] = useState(null);

    const [visible, setVisible] = useState(false);
    const [isDeletingBoard, setIsDeletingBoard] = useState(false);

    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentsError, setCommentsError] = useState(null);
    const commentRef = useRef(null);

    const [replyValue, setReplyValue] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);

    const [deletingIds, setDeletingIds] = useState(new Set());
    const [deleteError, setDeleteError] = useState(null);


    useEffect(() => {
        let ignore = false;

        async function getBoardDetail() {
            setBoardLoading(true);
            setBoardError(null);
            try {
                const resp = await fetch(`http://localhost:4100/posts/${id}`);

                if (resp.status === 404) {
                    if (!ignore) setBoardError("존재하지 않는 게시글입니다.");
                    return;
                }
                if (!resp.ok) {
                    if (!ignore) setBoardError("게시글을 불러오지 못했습니다.");
                    return;
                }

                const data = await resp.json();
                if (ignore) return;

                try {
                    await fetch(`http://localhost:4100/posts/${id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ views: data.views + 1 }),
                    });
                } catch {}

                if (!ignore) setBoard({ ...data, views: data.views + 1 });
            } catch (e) {
                if (!ignore) setBoardError("네트워크 오류가 발생했습니다.");
            } finally {
                if (!ignore) setBoardLoading(false);
            }
        }

        getBoardDetail();
        return () => {
            ignore = true;
        };
    }, [id]);

    const refreshComments = useCallback(async () => {
        setCommentsLoading(true);
        setCommentsError(null);
        try {
            const res = await fetch(`http://localhost:4100/comments?postId=${id}`);
            if (!res.ok) throw new Error("FAILED");
            const data = await res.json();
            setComments(data);
        } catch (e) {
            setCommentsError("댓글을 불러오지 못했습니다.");
        } finally {
            setCommentsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        refreshComments();
    }, [refreshComments]);
    const createReply = async (e) => {
        e.preventDefault();
        if (isSubmittingComment) return;

        const value = replyValue.trim();
        if (!value.trim()) {
                 setCommentsError("댓글 내용을 입력해주세요.");
                 commentRef.current?.focus();
                 return;
               }
           setCommentsError(null);

        setIsSubmittingComment(true);
        try {
            const res = await fetch(`http://localhost:4100/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postId: id,
                    author: "보",
                    content: value,
                    createdAt: new Date().toISOString(),
                }),
            });
            if (res.ok) {
                await refreshComments();
                setReplyValue("");
                toastRef.current?.show({
                    severity: "success",
                    summary: "댓글 등록 완료",
                    detail: "댓글이 등록되었습니다.",
                    life: 1500,
                });
            }
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const startEdit = (comment) => {
        setEditingId(comment.id);
        setEditValue(comment.content);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue("");
    };

    const submitEdit = async (e, commentId) => {
        e.preventDefault();
        if (isEditSubmitting) return;

        setIsEditSubmitting(true);
        try {
            const res = await fetch(`http://localhost:4100/comments/${commentId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editValue }),
            });
            if (res.ok) {
                setEditingId(null);
                toastRef.current?.show({
                    severity: "success",
                    summary: "게시글 수정 완료",
                    detail: "게시글 수정완료 되었습니다.",
                    life: 1500,
                });
                await refreshComments();
            }
        } finally {
            setIsEditSubmitting(false);
        }
    };

    const deleteComment = async (commentId) => {
        if (deletingIds.has(commentId)) return;
        setDeletingIds((prev) => new Set(prev).add(commentId));

        try {
            const res = await fetch(`http://localhost:4100/comments/${commentId}`, {
                method: "DELETE",
            });
            if (res.ok) await refreshComments();
        } finally {
            setDeletingIds((prev) => {
                const next = new Set(prev);
                next.delete(commentId);
                return next;
            });
        }
    };

    const deleteBoard = async (boardId) => {
        if (isDeletingBoard) return;
        setIsDeletingBoard(true);
        setDeleteError(null);
        try {
            const res = await fetch(`http://localhost:4100/posts/${boardId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                navigate("/", { replace: true });
            } else {
                setDeleteError("삭제에 실패했습니다. 다시 시도해주세요")
            }
        } catch (e) {
                setDeleteError("네트워크 오류로 삭제하지 못했습니다. 다시 시도해주세요.");
        } finally {
            setIsDeletingBoard(false);
        }
    };

    if (boardLoading) return <ArticleSkeleton />;

    if (boardError) {
        return (
            <ContentState
                icon="pi-exclamation-triangle"
                title="게시글을 불러올 수 없습니다"
                description={boardError}
                tone="danger"
            />
        );
    }

    if (!board) {
        return (
            <ContentState
                icon="pi-inbox"
                title="게시글이 없습니다"
                description="삭제되었거나 존재하지 않는 게시글입니다."
            />
        );
    }

    return (
        <>
      <span className="back-link is-static">
        <NavLink to={"/"} className="Nav">
          <i className="pi pi-chevron-left" aria-hidden="true" />
          전체 글로
        </NavLink>
      </span>

            <article className="card article-card">
                <h1 className="page-title article-title">{board.title}</h1>

                <div className="post-head">
                    <div className="author">
            <span className="author-face" aria-hidden="true">
              {board.author?.split("")[0]}
            </span>
                        <div>
                            <div className="author-name">{board.author}</div>
                            <div className="author-date">{board.createdAt}</div>
                        </div>
                    </div>
                    <div className="stat-row">
            <span aria-label="조회">
              <i className="pi pi-eye" aria-hidden="true" />
                {board.views}
            </span>
                        <span aria-label="댓글">
              <i className="pi pi-comment" aria-hidden="true" />
                            {comments.length}
            </span>
                    </div>
                </div>

                <hr className="rule" />

                <div className="post-body">{board.content}</div>

                <div className="post-actions">
                    <Button
                        type="button"
                        label="글 삭제"
                        severity="danger"
                        icon="pi pi-trash"
                        className="is-static"
                        onClick={() => {
                                   setDeleteError(null);
                                   setVisible(true);
                                 }}
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

            <section className="card comments-card">
                <div className="section-heading">
                    <div>
                        <h2 className="section-title">댓글 {comments.length}개</h2>
                        <p>답변이나 참고 자료를 나누면 더 빨리 해결할 수 있어요.</p>
                    </div>
                </div>

                {commentsLoading ? (
                    <CommentSkeleton />
                ) : commentsError ? (
                    <ContentState
                        icon="pi-exclamation-triangle"
                        title="댓글을 불러올 수 없습니다"
                        description={commentsError}
                        tone="danger"
                        compact
                    />
                ) : comments.length === 0 ? (
                    <ContentState
                        icon="pi-comment"
                        title="아직 댓글이 없습니다"
                        description="첫 댓글을 남겨보세요."
                        compact
                    />
                ) : (
                    <ul className="comment-list">
                        {comments.map((comment) => (
                            <li className="comment" key={comment.id}>
                <span className="comment-face" aria-hidden="true">
                  {comment.author?.split("")[0]}
                </span>
                                <div>
                                    <div className="author-name">
                                        {comment.author}
                                        <span className="author-date comment-when">
                      {comment.createdAt}
                    </span>
                                    </div>

                                    {editingId === comment.id ? (
                                        <form
                                            className="comment-form field"
                                            onSubmit={(e) => submitEdit(e, comment.id)}
                                        >
                                            <label
                                                className="field-label"
                                                htmlFor={`comment-edit-${comment.id}`}
                                            >
                                                댓글 수정
                                            </label>
                                            <InputTextarea
                                                id={`comment-edit-${comment.id}`}
                                                rows={3}
                                                placeholder="해결 방법이나 참고 자료를 알려주세요"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                disabled={isEditSubmitting}
                                            />
                                            <div className="row-end">
                                                <Button
                                                    type="submit"
                                                    label={isEditSubmitting ? "저장 중..." : "댓글 등록"}
                                                    disabled={isEditSubmitting || !editValue.trim()}
                                                    loading={isEditSubmitting}
                                                />
                                                <Button
                                                    type="button"
                                                    label="댓글 취소"
                                                    onClick={cancelEdit}
                                                    disabled={isEditSubmitting}
                                                />
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <p className="comment-text">{comment.content}</p>
                                            <button
                                                className="comment-button"
                                                onClick={() => deleteComment(comment.id)}
                                                disabled={deletingIds.has(comment.id)}
                                            >
                                                {deletingIds.has(comment.id)
                                                    ? "삭제 중..."
                                                    : "댓글 삭제"}
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
                )}

                <form className="comment-form field" onSubmit={createReply}>
                    <label className="field-label" htmlFor="comment">
                        댓글 작성
                    </label>
                    <InputTextarea
                        id="comment"
                        rows={3}
                        placeholder="해결 방법이나 참고 자료를 알려주세요"
                        value={replyValue}
                        ref={commentRef}
                        onChange={(e) => {
                            setReplyValue(e.target.value);
                                   if (commentsError) setCommentsError(null);
                                 }}
                        disabled={isSubmittingComment}
                        aria-invalid={Boolean(commentsError)}
                        aria-describedby={commentsError ? "comment-error" : undefined}
                    />
                    {commentsError && (
                        <p id="comment-error" role="alert" className="dialog-error">
                            {commentsError}
                        </p>
                    )}
                    <div className="row-end">
                        <Button
                            type="submit"
                            label={isSubmittingComment ? "등록 중..." : "댓글 등록"}
                            disabled={isSubmittingComment || !replyValue.trim()}
                            loading={isSubmittingComment}
                        />
                    </div>
                </form>
            </section>

            <Dialog
                visible={visible}
                onHide={() => (!isDeletingBoard ? setVisible(false) : null)}
                breakpoints={{ "960px": "75vw", "640px": "100vw" }}
                style={{ width: "50vw" }}
                header="이 글을 삭제할까요?"
                draggable={false}
                closable={!isDeletingBoard}
                footer={
                    <>
                        <Button
                            type="button"
                            label="취소"
                            severity="help"
                            onClick={() => setVisible(false)}
                            disabled={isDeletingBoard}
                        />
                        <Button
                            type="button"
                            label={isDeletingBoard ? "삭제 중..." : "삭제"}
                            severity="danger"
                            onClick={() => deleteBoard(board.id)}
                            disabled={isDeletingBoard}
                            loading={isDeletingBoard}
                        />
                    </>}>
                        댓글 {comments.length}개도 함께 사라지고, 되돌릴 수 없어요.
                        {deleteError && (
                        <p role="alert" className="dialog-error">
                             {deleteError}
                        </p>
                      )}
            </Dialog>
        </>
    );
}
