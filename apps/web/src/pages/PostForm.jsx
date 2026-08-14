import React, { useState } from "react";
import { useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostsForm from "../components/form";
import { Toast } from "primereact/toast";
import {toastRef} from "../App.jsx";

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const ToastRef = useRef(null);
  const [submitError, setSubmitError] = useState(null);


  useEffect(() => {
    if (!isEdit) return;
    fetch(`http://localhost:4100/posts/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setPost(data);
          setLoading(false);
        });
  }, [id, isEdit]);

  const handleSubmit = async (formData) => {
      try {
      if (isEdit) {
        const res = await fetch(`http://localhost:4100/posts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
          if (!res.ok) throw new Error("게시글 수정에 실패했습니다.");
          toastRef.current?.show({
          severity: "success",
          summary: "수정 완료",
          detail: "게시글이 수정되었습니다.",
          life: 2000,
        });
        navigate(`/posts/${id}`);
      } else {
          const res = await fetch("http://localhost:4100/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              views: 0,
              createdAt: new Date().toISOString(),
              notice: false,
            }),
          });
          if (!res.ok) throw new Error("게시글 작성에 실패했습니다.");
              const created = await res.json();
              toastRef.current?.show({
                severity: "success",
                summary: "작성 완료",
                detail: "게시글이 작성되었습니다.",
                life: 2000,
        });
          navigate(`/posts/${created.id}`);
        }
          } catch (e) {
             setSubmitError(e.message || "저장 중 오류가 발생했습니다. 다시 시도해주세요.");
             throw e;
           }
    };

  if ((isEdit && loading) || !post) return <p>로딩중...</p>;
  return (
      <>
        <Toast ref={toastRef} />
        <PostsForm
            initialData={post}
            onSubmit={handleSubmit}
            onCancel={() => setVisible(true)}
            submitError={submitError}
        />
      </>
  );
}
