// eslint-disable-next-line style/quotes
import { API_BASE_URL } from "./config";

// 게시글 조회
export function getPost(id) {
  return fetch(`${API_BASE_URL}/posts/${id}`);
}

// 조회수 갱신
export function updatePostViews(id, views) {
  return fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ views }),
  });
}

// 게시글 삭제
export function deletePost(id) {
  return fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "DELETE",
  });
}

import { API_BASE_URL } from "./config.js";

// 댓글 목록 조회
export function getComments(postId) {
  return fetch(`${API_BASE_URL}/comments?postId=${postId}`);
}

// 댓글 작성
export function createComment({ postId, author, content, createdAt }) {
  return fetch(`${API_BASE_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, author, content, createdAt }),
  });
}

// 댓글 수정
export function updateComment(commentId, content) {
  return fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

// 댓글 삭제
export function deleteComment(commentId) {
  return fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
  });
}
