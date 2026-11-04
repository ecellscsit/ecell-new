import SmartLink from "../../components/common/SmartLink.jsx";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BuildIcon from '@mui/icons-material/Build';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CampaignIcon from '@mui/icons-material/Campaign';

const icons = {
  Lightbulb: LightbulbIcon,
  RocketLaunch: RocketLaunchIcon,
  Build: BuildIcon,
  EmojiEvents: EmojiEventsIcon,
  Handshake: HandshakeIcon,
  Campaign: CampaignIcon,
}

export default function InitiativeCard({ item }) {
  const Icon = icons[item.icon] || LightbulbIcon;
  console.log(icons[item.icon]);
  const body = (
    <div className='card feature'>
      <div className='card-body'>
        <div className='feature-icon'><Icon/></div>
        <h3>{item.title}</h3>
        <p className='muted'>{item.description}</p>
      </div>
    </div>
  );
  return item.link ? <SmartLink to={item.link}>{body}</SmartLink> : body;
}
