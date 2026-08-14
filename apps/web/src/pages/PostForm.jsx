import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { toastRef } from "../App.jsx";
import PostsForm from "../components/form";
import { useForm } from "../hooks/useForm";
import { ContentState } from "../components/ContentState.jsx";

export default function PostForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isEdit, post, loading, loadError, submitError, submit } = useForm(id);

    const handleSubmit = async (formData) => {
        const { id: savedId } = await submit(formData);
        toastRef.current?.show({
            severity: "success",
            summary: isEdit ? "수정 완료" : "작성 완료",
            detail: isEdit ? "게시글이 수정되었습니다." : "게시글이 작성되었습니다.",
            life: 2000,
        });
        navigate(`/posts/${savedId}`);
    };

    if (isEdit && loadError) {
        return (
            <ContentState
                icon="pi-exclamation-triangle"
                title="게시글을 불러오지 못했습니다"
                description={loadError}
                tone="danger"
            />
        );
    }

    if (isEdit && loading) return <p>로딩중...</p>;

    return (
        <>
            <Toast ref={toastRef} />
            <PostsForm initialData={post} onSubmit={handleSubmit} submitError={submitError} />
        </>
    );
}