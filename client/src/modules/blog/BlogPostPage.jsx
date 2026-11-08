import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkIcon from '@mui/icons-material/Link';
import CheckIcon from '@mui/icons-material/Check';
import ShareIcon from '@mui/icons-material/Share';
import http from '../../api/http.js';
import Img from '../../components/common/Img.jsx';

const fmt = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const isBullet = (l) => /^[-•*]\s+/.test(l);

// content ko paragraphs / headings / bullets mein todta hai
function Body({ text }) {
  const blocks = (text || '').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const renderRest = (lines, key) => {
    if (!lines.length) return null;
    if (lines.every(isBullet))
      return <ul key={key}>{lines.map((l, i) => <li key={i}>{l.replace(/^[-•*]\s+/, '')}</li>)}</ul>;
    return <p key={key}>{lines.join('\n')}</p>;
  };
  return blocks.map((block, i) => {
    const lines = block.split('\n');
    const first = lines[0];
    const md = first.match(/^#{1,3}\s+(.*)/);
    const numbered = /^\d+[.)]\s+/.test(first) && lines.length > 1;
    if (md || numbered) {
      return (
        <div key={i}>
          <h3>{md ? md[1] : first}</h3>
          {renderRest(lines.slice(1), 'r')}
        </div>
      );
    }
    return renderRest(lines, i);
  });
}

function ShareBar({ url, title, label }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const links = [
    ['WhatsApp', WhatsAppIcon, `https://wa.me/?text=${enc(`${title} ${url}`)}`, 'wa'],
    ['LinkedIn', LinkedInIcon, `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, 'li'],
    ['X', XIcon, `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`, 'x'],
    ['Facebook', FacebookIcon, `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, 'fb'],
  ];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Copy this link', url);
    }
  };
  const canNative = typeof navigator !== 'undefined' && !!navigator.share;
  return (
    <div className="post-share">
      {label && <span className="post-share-label">{label}</span>}
      {canNative && (
        <button type="button" className="share-btn native" aria-label="Share" title="Share"
          onClick={() => navigator.share({ title, url }).catch(() => {})}>
          <ShareIcon fontSize="small" />
        </button>
      )}
      {links.map(([name, Icon, href, cls]) => (
        <a key={name} href={href} target="_blank" rel="noreferrer"
          className={`share-btn ${cls}`} aria-label={`Share on ${name}`} title={name}>
          <Icon fontSize="small" />
        </a>
      ))}
      <button type="button" className="share-btn copylink" onClick={copy}
        aria-label="Copy link" title={copied ? 'Copied!' : 'Copy link'}>
        {copied ? <CheckIcon fontSize="small" /> : <LinkIcon fontSize="small" />}
      </button>
      {copied && <small className="muted">Link copied</small>}
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(null);
    window.scrollTo(0, 0);
    http.get(`/blog/${slug}`).then((r) => setData(r.data)).catch(() => setData(false));
  }, [slug]);

  if (data === false)
    return (
      <div className="container section">
        <p>Post not found.</p>
        <Link to="/blog" className="btn btn-outline">← All posts</Link>
      </div>
    );
  if (!data)
    return <div className="container section"><p className="muted">Loading…</p></div>;

  const { post, related } = data;
  const url = `${window.location.origin}/blog/${post.slug}`;
  const words = (post.content || '').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));

  return (
    <article className="container section post-page">
      <div className="post-narrow">
        <Link to="/blog" className="post-back">
          <ArrowBackIcon fontSize="small" /> All posts
        </Link>

        <div className="post-badges"><span className="badge">{post.category}</span></div>
        <h1>{post.title}</h1>
        {post.excerpt && <p className="post-lead">{post.excerpt}</p>}

               <div className="post-meta-row">
          <div className="post-author">
            {/e-?cell/i.test(post.author || '') ? (
              <img src="/images/ecell-logo.png" alt="E-Cell SCSIT" className="post-author-logo" />
            ) : (
              <div className="avatar">{post.author?.[0] || 'E'}</div>
            )}
            <div>
              <b>{post.author}</b>
              <small>{fmt(post.publishedAt)} · {minutes} min read</small>
            </div>
          </div>
        </div>

        {post.cover && <img src={post.cover} alt="" className="post-cover" />}

        {/* content admins likhte hain, isliye HTML inject nahi karte (safe) */}
        <div className="post-body"><Body text={post.content} /></div>

        <div className="post-share bottom-box">
          <ShareBar url={url} title={post.title} label="Share this post" />
        </div>
      </div>

      {related.length > 0 && (
        <section className="post-related">
          <h2>Related posts</h2>
          <div className="grid-3 h-scroll">
            {related.map((r) => (
              <Link key={r._id} to={`/blog/${r.slug}`} className="card related-card">
                <Img src={r.cover} alt={r.title} />
                <div className="card-body">
                  <small>{r.category} · {fmt(r.publishedAt)}</small>
                  <h3>{r.title}</h3>
                  {r.excerpt && <p className="muted">{r.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
