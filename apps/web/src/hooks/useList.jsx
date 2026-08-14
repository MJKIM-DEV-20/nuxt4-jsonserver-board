// hooks/useList.js (postlist)
import { useState, useEffect } from "react";
import { getPostList,fetchAllComments, countCommentsByPostId,attachCommentCounts } from "../api/api.js";

export function useList({ page, perPage, query, notice, sort }) {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;
        setLoading(true);
        setError(null);

        Promise.all([
            getPostList({ page, perPage, query, notice, sort }),
            fetchAllComments(),
        ])
            .then(([{ data: posts, total }, comments]) => {
                if (ignore) return;
                const countMap = countCommentsByPostId(comments);
                setData(attachCommentCounts(posts, countMap));
                setTotal(total);
            })
            .catch((e) => {
                if (!ignore) setError(e.message);
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => { ignore = true; };
    }, [page, perPage, query, notice, sort]);
    // console.log("getPostList 호출 인자:", { page, perPage, query, notice, sort });
    return { data, total, loading, error };
}