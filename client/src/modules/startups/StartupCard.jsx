import Img from '../../components/common/Img.jsx';
import WebsiteIcon from '../../components/common/WebsiteIcon.jsx';

export default function StartupCard({ startup: s }) {
  return (
    <div className="card startup">
      <Img src={s.logo} alt={s.name} />
      <div className="card-body">
        <h3>{s.name}</h3><small>by {s.founders}</small>
        <p>{s.description}</p>
       {s.link && (
  <a href={s.link} target="_blank" rel="noreferrer" className="site-link">
    <WebsiteIcon size={16} /> Visit website
  </a>
)}
      </div>
    </div>
  );
}
