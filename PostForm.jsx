import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useState } from "react";
import { useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostsForm from "../components/form";

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  // const [visible, setVisible] = useState(false);
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
    if (isEdit) {
      await fetch(`http://localhost:4200/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      navigate(`/posts/${id}`);
    } else {
      const res = await fetch("http://localhost:4200/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          views: 0,
          createdAt: new Date().toISOString(),
          notice: false,
        }),
      });
      const created = await res.json();
      navigate(`/posts/${created.id}`);
    }
  };

  if ((isEdit && loading) || !post) return <p>로딩중...</p>;

  return (
    <>
      <PostsForm
        initialData={post}
        onSubmit={handleSubmit}
        onCancel={() => setVisible(true)}
      />
    </>
  );
}
