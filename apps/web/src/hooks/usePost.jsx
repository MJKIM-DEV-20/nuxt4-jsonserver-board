//게시물 조회 및 삭제 hook
import { useState, useEffect, useCallback } from "react";
import { fetchPost, incrementView, deletePost } from "../api/api.js";

export function usePost(id) {
    const [board, setBoard] = useState(null);
    const [boardLoading, setBoardLoading] = useState(true);
    const [boardError, setBoardError] = useState(null);

    const [isDeletingBoard, setIsDeletingBoard] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        let ignore = false;

        async function load() {
            setBoardLoading(true);
            setBoardError(null);
            try {
                const data = await fetchPost(id);
                if (ignore) return;

                incrementView(id, data.views).catch(() => {});
                setBoard({ ...data, views: data.views + 1 });
            } catch (e) {
                if (ignore) return;
                setBoardError(
                    e.message?.includes("404")
                        ? "존재하지 않는 게시글입니다."
                        : "게시글을 불러오지 못했습니다."
                );
            } finally {
                if (!ignore) setBoardLoading(false);
            }
        }

        load();
        return () => {
            ignore = true;
        };
    }, [id]);


    const removeBoard = useCallback(async () => {
        if (isDeletingBoard) return false;
        setIsDeletingBoard(true);
        setDeleteError(null);
        try {
            await deletePost(id);
            return true;
        } catch {
            setDeleteError("삭제에 실패했습니다. 다시 시도해주세요.");
            return false;
        } finally {
            setIsDeletingBoard(false);
        }
    }, [id, isDeletingBoard]);
    const clearDeleteError = useCallback(() => setDeleteError(null), []);
    return { board, boardLoading, boardError, isDeletingBoard, deleteError, removeBoard,clearDeleteError };
}