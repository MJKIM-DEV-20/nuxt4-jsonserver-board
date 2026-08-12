import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useState } from "react";
import { useRef, useEffect } from "react";
import {NavLink, useNavigate, useParams} from "react-router-dom";

export default function PostsForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [author, setAuthor] = useState(initialData?.author ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [visible, setVisible] = useState(false);
  const [validation, setValidation] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, author, content });
  };

  return (
      <>
      <NavLink to='/'className='Nav'>
      <span className="back-link is-static">
        <i className="pi pi-chevron-left" aria-hidden="true" />
        전체 글로
      </span>
      </NavLink>

        <section className="page-intro page-intro--compact">
          <div>
            <h1 className="page-title">
              {initialData ? "게시글 수정하기" : "새 글 작성하기"}
            </h1>
            <p className="page-description">
              질문이나 해결 방법을 작성하면 목록에 바로 보여요.
            </p>
          </div>
        </section>

        <div className="write-layout">
          <form className="card form-card">
            <div className="field" onSubmit={handleSubmit}>
              <label className="field-label" htmlFor="title">
                제목
                <span className="req" aria-hidden="true">
                *
              </span>
              </label>
              <InputText
                  id="title"
                  placeholder="예: 페이지네이션 쿼리는 어떻게 넘기시나요?"
                  aria-describedby="title-count"
                  value={title}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  maxlength={100}
              />
              <div className="field-foot">
              <span className="field-hint" id="title-count">
                {title.length} / 100자
              </span>
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
                  placeholder="목록에 표시될 이름"
                  aria-describedby={validation ? "error" : undefined}
                  aria-invalid={validation ? "true" : false}
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  onFocus={() => setValidation(true)}
                  maxLength={20}
              />
              <div className="field-foot">
              <span className="field-hint" id="author-count">
                {author.length} / 20자
              </span>
                {/*{validation &&*/}
                {/*    <p id="error">*/}
                {/*        닉네임을 20자 이내로 입력해주세요*/}
                {/*    </p>}*/}
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
                  rows={12}
                  placeholder="막힌 부분, 시도해본 방법, 궁금한 점을 차례로 적어보세요"
                  aria-describedby="content-count"
                  value={content}
                  required
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={2000}/>
              <div className="field-foot">
              <span className="field-hint" id="content-count">
                {content.length} / 2,000자
              </span>
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
                {initialData ? "작성 완료" : "수정 완료"}
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