import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../../api/http.js";
import Img from "../../components/common/Img.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { useSettings } from "../../context/SettingsContext.jsx";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BuildIcon from "@mui/icons-material/Build";
import HandshakeIcon from "@mui/icons-material/Handshake";
import CampaignIcon from "@mui/icons-material/Campaign";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";

const WHAT = [
  [<BuildIcon />, "Workshops", "Hands-on sessions on building, pitching and launching."],
  [<EmojiEventsIcon />, "Hackathons", "Build real products with your team in a few hours."],
  [<CampaignIcon />, "Expert talks", "Founders and investors share what actually works."],
  [<HandshakeIcon />, "Mentorship", "One-to-one guidance from alumni and industry mentors."],
  [<RocketLaunchIcon />, "Startup support", "Ideas to MVPs, with network and resources."],
];

export default function AboutPage() {
  const { settings: s } = useSettings();
  const a = s.about || {};
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    http.get("/developers").then((r) => setDevs(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <PageHeader
        title='About E-Cell SCSIT'
        subtitle='Where SCSIT students turn ideas into startups'
      />
      <div className='container section'>
        <div className='about-intro'>
          <img src='/images/scsit-logo.png' alt='SCSIT DAVV' />
          <p>
            {a.intro ||
              "The Entrepreneurship Cell of SCSIT, DAVV Indore, is a student-run community that helps students explore entrepreneurship, build startups and learn from the people who have done it."}
          </p>
        </div>

        {(a.vision || a.mission) && (
          <div className='grid-2'>
            {a.vision && (
              <div className='card about-card'>
                <div className='card-body'>
                  <div className='about-card-icon'><VisibilityIcon /></div>
                  <h2>Vision</h2>
                  <p>{a.vision}</p>
                </div>
              </div>
            )}
            {a.mission && (
              <div className='card about-card'>
                <div className='card-body'>
                  <div className='about-card-icon'><TrackChangesIcon /></div>
                  <h2>Mission</h2>
                  <p>{a.mission}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {(a.davv || a.scsit) && (
          <div className='grid-2' style={{ marginTop: 24 }}>
            {a.davv && (
              <div className='card about-card'>
                <div className='card-body'>
                  <div className='about-card-icon'><AccountBalanceIcon /></div>
                  <h3>About DAVV</h3>
                  <p>{a.davv}</p>
                </div>
              </div>
            )}
            {a.scsit && (
              <div className='card about-card'>
                <div className='card-body'>
                  <div className='about-card-icon'><SchoolIcon /></div>
                  <h3>About SCSIT</h3>
                  <p>{a.scsit}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {a.objectives?.length > 0 && (
          <>
            <h2 className='about-h2'>Objectives</h2>
            <div className='objective-grid'>
              {a.objectives.map((o, i) => (
                <div key={i} className='objective'>
                  <CheckCircleIcon fontSize='small' />
                  <span>{o}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <h2 className='about-h2'>What we do</h2>
        <div className='grid-3'>
          {WHAT.map(([icon, t, d]) => (
            <div key={t} className='card feature'>
              <div className='card-body'>
                <div className='feature-icon'>{icon}</div>
                <h3>{t}</h3>
                <p className='muted'>{d}</p>
              </div>
            </div>
          ))}
        </div>

        {a.timeline?.length > 0 && (
          <>
            <h2 className='about-h2'>Our journey</h2>
            <div className='timeline'>
              {a.timeline.map((t, i) => (
                <div key={i} className='tl-item'>
                  <b>{t.year}</b>
                  <p>{t.text}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {s.hod?.message && (
          <blockquote className='faculty'>
            <h3>Message from the HOD</h3>
            {s.hod.message}
            <footer>
              — {s.hod.name}, {s.hod.title}
            </footer>
          </blockquote>
        )}

        <div className='about-join'>
          <Link to='/register' className='btn btn-primary btn-lg'>
            Join E-Cell
          </Link>
        </div>

        {/* ---------- Developers (sabse last mein) ---------- */}
        {devs.length > 0 && (
          <section className='dev-section'>
            <h2 className='about-h2' style={{ marginTop: 0 }}>Developers</h2>
            <p className='muted'>The people who designed and built this website.</p>
            <div className='team-grid dev-grid'>
              {devs.map((d) => (
                <div key={d._id} className='team-card'>
                  <Img className='team-photo' src={d.photo} alt={d.name} />
                  <h4>{d.name}</h4>
                  {d.role && <p className='team-role'>{d.role}</p>}
                  {(d.linkedin || d.github || d.website) && (
                    <div className='team-socials'>
                      {d.linkedin && (
                        <a href={d.linkedin} target='_blank' rel='noreferrer' aria-label='LinkedIn'>
                          <LinkedInIcon fontSize='small' />
                        </a>
                      )}
                      {d.github && (
                        <a href={d.github} target='_blank' rel='noreferrer' aria-label='GitHub'>
                          <GitHubIcon fontSize='small' />
                        </a>
                      )}
                      {d.website && (
                        <a href={d.website} target='_blank' rel='noreferrer' aria-label='Website'>
                          <LanguageIcon fontSize='small' />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
