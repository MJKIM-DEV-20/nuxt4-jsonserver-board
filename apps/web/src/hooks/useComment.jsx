//댓글 로직
import { useState, useEffect, useCallback } from "react";
import { fetchComments, createComment, updateComment, deleteComment } from "../api/api.js";
import { toastRef } from "../App.jsx";

export function useComments(postId) {
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentsError, setCommentsError] = useState(null);

    const [replyValue, setReplyValue] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);

    const [deletingIds, setDeletingIds] = useState(new Set());

    const refresh = useCallback(async () => {
        setCommentsLoading(true);
        setCommentsError(null);
        try {
            setComments(await fetchComments(postId));
        } catch {
            setCommentsError("댓글을 불러오지 못했습니다.");
        } finally {
            setCommentsLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const submitReply = useCallback(
        async (value) => {
            if (isSubmittingComment) return;
            setIsSubmittingComment(true);
            try {
                await createComment(postId, value);
                await refresh();
                setReplyValue("");
                toastRef.current?.show({ severity: "success", summary: "댓글 등록 완료", detail: "댓글이 등록되었습니다.", life: 1500 });
            } catch {
                setCommentsError("댓글 등록에 실패했습니다.");
            } finally {
                setIsSubmittingComment(false);
            }
        },
        [postId, isSubmittingComment, refresh]
    );

    const startEdit = (comment) => {
        setEditingId(comment.id);
        setEditValue(comment.content);
    };
    const cancelEdit = () => {
        setEditingId(null);
        setEditValue("");
    };

    const submitEdit = useCallback(
        async (commentId) => {
            if (isEditSubmitting) return;
            setIsEditSubmitting(true);
            try {
                await updateComment(commentId, editValue);
                setEditingId(null);
                await refresh();
                toastRef.current?.show({ severity: "success", summary: "댓글 수정 완료", detail: "댓글이 수정되었습니다.", life: 1500 });
            } finally {
                setIsEditSubmitting(false);
            }
        },
        [editValue, isEditSubmitting, refresh]
    );

    const removeComment = useCallback(
        async (commentId) => {
            if (deletingIds.has(commentId)) return;
            setDeletingIds((prev) => new Set(prev).add(commentId));
            try {
                await deleteComment(commentId);
                await refresh();
            } finally {
                setDeletingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(commentId);
                    return next;
                });
            }
        },
        [deletingIds, refresh]
    );

    return {
        comments, commentsLoading, commentsError, setCommentsError,
        replyValue, setReplyValue, isSubmittingComment, submitReply,
        editingId, editValue, setEditValue, isEditSubmitting, startEdit, cancelEdit, submitEdit,
        deletingIds, removeComment,
    };
}