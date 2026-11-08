import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getEvent } from "./eventsApi.js";

const day = (d) =>
  new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
const time = (d) =>
  new Date(d).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
const isUrl = (u) => /^https?:\/\//i.test(u || "");

const Info = ({ icon, label, children }) => (
  <div className='event-info-row'>
    <div className='event-info-icon'>{icon}</div>
    <div>
      <small>{label}</small>
      <b>{children}</b>
    </div>
  </div>
);

const Section = ({ title, icon, children }) => (
  <section className='event-section'>
    <h2>{icon}{title}</h2>
    {children}
  </section>
);

export default function EventDetailPage() {
  const { slug } = useParams();
  const [ev, setEv] = useState(null);

  useEffect(() => {
    setEv(null);
    getEvent(slug).then(setEv).catch(() => setEv(false));
  }, [slug]);

  if (ev === false)
    return (
      <div className='container section'>
        <p>Event not found.</p>
        <Link to='/events' className='btn btn-outline'>← All events</Link>
      </div>
    );
  if (!ev)
    return (
      <div className='container section'>
        <p className='muted'>Loading…</p>
      </div>
    );

  const multiDay = ev.endDate && !sameDay(ev.startDate, ev.endDate);
  const dateText = multiDay ? `${day(ev.startDate)} – ${day(ev.endDate)}` : day(ev.startDate);
  const timeText = multiDay
    ? `${time(ev.startDate)} onwards`
    : ev.endDate
      ? `${time(ev.startDate)} – ${time(ev.endDate)}`
      : time(ev.startDate);

  // Register button: Google Form naye tab mein
  let action;
  if (ev.status === "past") {
    action = <p className='event-note'>This event has ended.</p>;
  } else if (!ev.canRegister) {
    action = <p className='event-note'>Registration is closed.</p>;
  } else if (!isUrl(ev.registrationLink)) {
    action = <p className='event-note'>Registration link will be announced soon.</p>;
  } else {
    action = (
      <a href={ev.registrationLink} target='_blank' rel='noreferrer' className='btn btn-primary btn-lg event-register'>
        Register now <OpenInNewIcon fontSize='small' />
      </a>
    );
  }

  return (
    <div className='container section event-page'>
      <Link to='/events' className='event-back'>
        <ArrowBackIcon fontSize='small' /> All events
      </Link>

      <div className='event-head'>
        <div className='event-badges'>
          <span className={`badge badge-${ev.status}`}>{ev.status}</span>
          {ev.category && <span className='badge'>{ev.category}</span>}
        </div>
        <h1>{ev.title}</h1>
      </div>

      <div className='event-layout'>
        {/* ---------- Info + Register ---------- */}
        <aside className='event-side'>
          <div className='event-info'>
            <Info icon={<CalendarMonthIcon fontSize='small' />} label='Date'>{dateText}</Info>
            <Info icon={<AccessTimeIcon fontSize='small' />} label='Time'>{timeText}</Info>
            {ev.venue && (
              <Info icon={<LocationOnIcon fontSize='small' />} label='Venue'>{ev.venue}</Info>
            )}
            {ev.registrationDeadline && ev.status === "upcoming" && (
              <Info icon={<HourglassBottomIcon fontSize='small' />} label='Register by'>
                {day(ev.registrationDeadline)}, {time(ev.registrationDeadline)}
              </Info>
            )}
            {action}
            {isUrl(ev.externalLink) && (
              <a href={ev.externalLink} target='_blank' rel='noreferrer' className='btn btn-outline event-secondary'>
                Visit event website →
              </a>
            )}
          </div>
        </aside>

        {/* ---------- Main content ---------- */}
        <div className='event-main'>
          {ev.poster && <img src={ev.poster} alt={ev.title} className='event-poster' />}

          {ev.description && (
            <Section title='About the event'>
              <p className='event-about'>{ev.description}</p>
            </Section>
          )}

          {ev.schedule?.length > 0 && (
            <Section title='Schedule'>
              <div className='event-schedule'>
                {ev.schedule.map((s, i) => (
                  <div key={i} className='event-slot'>
                    <b>{s.time}</b>
                    <span>{s.title}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {ev.rules?.length > 0 && (
            <Section title='Rules'>
              <ul className='event-list'>
                {ev.rules.filter(Boolean).map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </Section>
          )}

          {ev.prizes?.length > 0 && (
            <Section title='Prizes'>
              <ul className='event-list prizes'>
                {ev.prizes.filter(Boolean).map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </Section>
          )}

          {ev.winners?.length > 0 && (
            <Section title='Winners' icon={<EmojiEventsIcon />}>
              <ul className='event-list winners'>
                {ev.winners.filter(Boolean).map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </Section>
          )}

          {ev.speakers?.length > 0 && (
            <Section title='Mentors & speakers'>
              <div className='event-speakers'>
                {ev.speakers.map((s, i) => (
                  <div key={i} className='event-speaker'>
                    {s.photo ? (
                      <img src={s.photo} alt={s.name} />
                    ) : (
                      <div className='avatar'>{s.name?.[0]}</div>
                    )}
                    <div>
                      <b>{s.name}</b>
                      <small>{s.role}</small>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {ev.status === "past" && ev.photos?.length > 0 && (
            <Section title='Photos'>
              <div className='masonry gallery-home'>
                {ev.photos.map((p) => (
                  <figure key={p} className='masonry-item loaded'>
                    <img src={p} alt='' loading='lazy' />
                  </figure>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
