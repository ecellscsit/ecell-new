import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../../api/http.js';
import Img from '../../components/common/Img.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => { http.get('/blog').then((r) => setPosts(r.data)); }, []);
  return (
    <>
      <PageHeader title="Blog" />
      <div className="container section grid-3">
        {posts.map((p) => (
          <Link key={p._id} to={`/blog/${p.slug}`} className="card">
            <Img src={p.cover} alt={p.title} />
            <div className="card-body"><small>{p.category} · {new Date(p.publishedAt).toLocaleDateString()}</small><h3>{p.title}</h3><p>{p.excerpt}</p></div>
          </Link>
        ))}
      </div>
    </>
  );
}
