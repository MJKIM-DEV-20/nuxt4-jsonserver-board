import {API_URL} from "./url.jsx";

const BASE_URL = "http://localhost:4100";

export async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(message || `요청에 실패했습니다. (${res.status})`);
    }

    if (res.status === 204) return null; // DELETE 등 body 없는 응답
    return res.json();
}

export async function fetchPosts({ page, perPage, query, notice, sort }) {
    const params = new URLSearchParams({ _page: page, _per_page: perPage });
    if (query) params.set("query", query);
    if (notice) params.set("notice", notice);
    if (sort) params.set("sort", sort);

    const res = await fetch(`${BASE_URL}/posts?${params}`);
    if (!res.ok) throw new Error("게시글을 불러오지 못했습니다.");
    return res.json();
}

// export async function fetchPost(id) {
//     const res = await fetch(`${BASE_URL}/posts/${id}`);
//     if (!res.ok) throw new Error("게시글을 찾을 수 없습니다.");
//     return res.json();
// }


export async function fetchAllPosts({ notice, sort }) {
    const params = new URLSearchParams();
    if (notice !== "all") params.set("notice", notice);
    params.set("_sort", sort === "view" ? "-views" : "-createdAt");

    const res = await fetch(`http://localhost:4100/posts?${params}`);
    if (!res.ok) throw new Error("게시글을 불러오지 못했습니다.");
    return res.json();
}

export async function getPostList({ page, perPage, query, notice, sort }) {
    let data = await fetchAllPosts({ notice, sort });
        // console.log(data)
    if (query) {
        const q = query.toLowerCase();
        data = data.filter((post) =>
            Object.values(post).some((v) => String(v).toLowerCase().includes(q))
        );
    }

    const total = data.length;
    const start = (page - 1) * perPage;
    return { data: data.slice(start, start + perPage), total };
}

export async function createPost(payload) {
    const res = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...payload,
            views: 0,
            createdAt: new Date().toISOString(),
            notice: false,
        }),
    });
    if (!res.ok) throw new Error("게시글 작성에 실패했습니다.");
    return res.json();
}

export async function updatePost(id, payload) {
    const res = await fetch(`${BASE_URL}/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("게시글 수정에 실패했습니다.");
    return res.json();
}

export async function deletePost(id) {
    const res = await fetch(`${BASE_URL}/posts/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("삭제에 실패했습니다.");
}


export function attachCommentCounts(posts, countMap) {
    return posts.map((post) => ({
        ...post,
        commentCount: countMap[post.id] || 0,
    }));
}

// 게시글 작성




export function fetchPost(id) {
    return request(`/posts/${id}`);
}


export function incrementView(id, currentViews) {
    return request(`/posts/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ views: currentViews + 1 }),
    });
}

// export function deletePost(id) {
//     return request(`/posts/${id}`, { method: "DELETE" });
// }



// export function createPost({ title, author, content }) {
//     return request("/posts", {
//         method: "POST",
//         body: JSON.stringify({
//             title,
//             author,
//             content,
//             views: 0,
//             createdAt: new Date().toISOString(),
//             notice: false,
//         }),
//     });
// }
//
// export function updatePost(id, { title, author, content }) {
//     return request(`/posts/${id}`, {
//         method: "PATCH",
//         body: JSON.stringify({ title, author, content }),
//     });
// }





//댓글

export async function fetchAllComments() {
    const res = await fetch(`${BASE_URL}/comments`);
    if (!res.ok) throw new Error("댓글을 불러오지 못했습니다.");
    return res.json();
}

export function countCommentsByPostId(comments) {
    return comments.reduce((acc, c) => {
        acc[c.postId] = (acc[c.postId] || 0) + 1;
        return acc;
    }, {});
}


export function fetchComments(postId) {
    return request(`/comments?postId=${postId}`);
}

export function createComment(postId, content) {
    return request("/comments", {
        method: "POST",
        body: JSON.stringify({
            postId,
            author: "보",
            content,
            createdAt: new Date().toISOString(),
        }),
    });
}

export function updateComment(commentId, content) {
    return request(`/comments/${commentId}`, {
        method: "PATCH",
        body: JSON.stringify({ content }),
    });
}

export function deleteComment(commentId) {
    return request(`/comments/${commentId}`, { method: "DELETE" });
}

