import SmartLink from '../../components/common/SmartLink.jsx';

export default function InitiativeCard({ item }) {
  const body = (
    <div className="card feature"><div className="card-body">
      <div className="feature-icon">{item.icon || '💡'}</div>
      <h3>{item.title}</h3><p className="muted">{item.description}</p>
    </div></div>
  );
  return item.link ? <SmartLink to={item.link}>{body}</SmartLink> : body;
}
