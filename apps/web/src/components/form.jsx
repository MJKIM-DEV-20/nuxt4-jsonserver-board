import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useState } from "react";
import { useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContentState } from "./ContentState";

export default function PostsForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [author, setAuthor] = useState(initialData?.author ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {};

    if (!title.trim()) {
      nextErrors.title = "제목을 입력해주세요.";
    }

    if (!author.trim()) {
      nextErrors.author = "닉네임을 입력해주세요.";
    }

    if (!content.trim()) {
      nextErrors.content = "내용을 입력해주세요."; // author → content
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({ title, author, content });
  };

  return (
      <>
      <span className="back-link is-static">
        <i className="pi pi-chevron-left" aria-hidden="true" />
        전체 글로
      </span>

        <section className="page-intro page-intro--compact">
          <div>
            <h1 className="page-title">
              {initialData ? "새 글 작성하기" : "게시글 수정하기"}
            </h1>
            <p className="page-description">
              질문이나 해결 방법을 작성하면 목록에 바로 보여요.
            </p>
          </div>
        </section>

        <div className="write-layout">
          <form className="card form-card" onSubmit={handleSubmit}>
            <div className="field" >
              <label className="field-label" htmlFor="title">
                제목
                <span className="req" aria-hidden="true">
                *
              </span>
              </label>
              <InputText
                  id="title"
                  maxLength={100}
                  placeholder="예: 페이지네이션 쿼리는 어떻게 넘기시나요?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={[
                    "title-count",
                    errors.title ? "title-error" : null,
                  ]
                      .filter(Boolean)
                      .join(" ")}
              />
              <div className="field-foot">
              <span className="field-hint" id="title-count">
                {title.length} / 100자
              </span>
                {errors.title && (
                    <ContentState
                        id="title-error"
                        icon="pi-exclamation-triangle"
                        title="제목을 입력해주세요."
                        description="게시글 제목은 필수입니다."
                        tone="danger"
                    />
                )}
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="author">
                닉네임
                <span className="req" aria-hidden="true">
                *
              </span>
              </label>
              <InputText
                  id="author"
                  placeholder="닉네임"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  aria-invalid={Boolean(errors.author)}
                  aria-describedby={errors.author ? "author-error" : undefined}
              />
              <div className="field-foot">
              <span className="field-hint" id="author-count">
                {author.length} / 20자
              </span>
                {errors.author && (
                    <ContentState
                        id="author-error"
                        icon="pi-exclamation-triangle"
                        title="닉네임을 입력해주세요."
                        description="닉네임은 필수입니다."
                        tone="danger"
                    />
                )}
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="content">
                내용
                <span className="req" aria-hidden="true">
                *
              </span>
              </label>
              <InputTextarea
                  id="content"
                  placeholder="내용을 입력해주세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  aria-invalid={Boolean(errors.content)}
                  aria-describedby={errors.content ? "content-error" : undefined}
              />
              <div className="field-foot">
              <span className="field-hint" id="content-count">
                {content.length} / 2,000자
              </span>
                {errors.content && (
                    <ContentState
                        id="content-error"
                        icon="pi-exclamation-triangle"
                        title="내용을 입력해주세요."
                        description="게시글 내용은 필수입니다."
                        tone="danger"
                    />
                )}
              </div>
            </div>

            <div className="form-footer">
            <span
                className="p-button p-button-help btn-xl is-static"
                onClick={() => setVisible(true)}
            >
              작성 취소
            </span>

              <Button
                  type="submit"
                  className="btn-xl"
                  icon="pi pi-check"
                  onClick={handleSubmit}
              >
                {initialData ? "작성완료" : "수정완료"}
              </Button>
            </div>
          </form>

          <aside className="writing-guide" aria-labelledby="writing-guide-title">
          <span className="guide-icon" aria-hidden="true">
            <i className="pi pi-lightbulb" />
          </span>
            <h2 id="writing-guide-title">답변받기 좋은 글</h2>
            <ul>
              <li>문제가 생긴 상황을 먼저 알려주세요.</li>
              <li>이미 시도한 방법을 함께 적어주세요.</li>
              <li>개인정보는 글에 남기지 마세요.</li>
            </ul>
          </aside>
        </div>
        {visible && (
            <Dialog
                visible={visible}
                onHide={() => setVisible(false)}
                breakpoints={{ "960px": "75vw", "640px": "100vw" }}
                style={{ width: "50vw" }}
                header="작성을 그만둘까요?"
                draggable={false}
                footer={
                  <>
                    <Button
                        type="button"
                        label="계속 작성"
                        severity="help"
                        onClick={() => setVisible(false)}
                    />
                    <Button
                        type="button"
                        label="내용 버리고 나가기"
                        severity="danger"
                        onClick={() => navigate("/")}
                    />
                  </>
                }
            >
              지금 나가면 입력한 내용이 사라져요.
            </Dialog>
        )}
      </>
  );
}
