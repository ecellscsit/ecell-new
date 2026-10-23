import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import http from '../../api/http.js';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => { http.get(`/blog/${slug}`).then((r) => setData(r.data)).catch(() => setData(false)); }, [slug]);
  if (data === false) return <p className="container">Post not found.</p>;
  if (!data) return <p className="container">Loading…</p>;
  const { post, related } = data;
  return (
    <article className="container section post">
      {post.cover && <img src={post.cover} alt="" className="poster" />}
      <h1>{post.title}</h1>
      <small>{post.author} · {new Date(post.publishedAt).toLocaleDateString()} · {post.category}</small>
      {/* content is written by trusted admins; add DOMPurify if you allow rich HTML */}
      <div className="post-body" style={{ whiteSpace: 'pre-line' }}>{post.content}</div>
      <a href={`https://wa.me/?text=${encodeURIComponent(location.href)}`} target="_blank" rel="noreferrer">Share on WhatsApp</a>
      {related.length > 0 && <><h3>Related posts</h3><ul>{related.map((r) => <li key={r._id}><Link to={`/blog/${r.slug}`}>{r.title}</Link></li>)}</ul></>}
    </article>
  );
}
