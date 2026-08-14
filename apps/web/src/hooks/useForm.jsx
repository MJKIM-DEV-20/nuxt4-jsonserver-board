import { useState, useEffect, useCallback } from "react";
import { fetchPost, createPost, updatePost } from "../api/api.js";

export function useForm(id) {
    const isEdit = Boolean(id);

    const [post, setPost] = useState(null);      // null = 아직 없음 (배열 아님!)
    const [loading, setLoading] = useState(isEdit);
    const [loadError, setLoadError] = useState(null);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        if (!isEdit) return;

        let ignore = false;
        setLoading(true);
        setLoadError(null);

        fetchPost(id)
            .then((data) => {
                if (ignore) return;
                setPost(data);
            })
            .catch((e) => {
                if (ignore) return;
                setLoadError(e.message || "게시글을 불러오지 못했습니다.");
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [id, isEdit]);

    const submit = useCallback(
        async (formData) => {
            setSubmitError(null);
            try {
                if (isEdit) {
                    await updatePost(id, formData);
                    return { id };
                } else {
                    const created = await createPost(formData);
                    return { id: created.id };
                }
            } catch (e) {
                setSubmitError(e.message || "저장 중 오류가 발생했습니다. 다시 시도해주세요.");
                throw e;
            }
        },
        [id, isEdit]
    );

    return { isEdit, post, loading, loadError, submitError, submit };
}