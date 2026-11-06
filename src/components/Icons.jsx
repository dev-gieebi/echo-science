// Logo ECHOSCIENCE (public/logo.png, recadré en CSS) + pictogrammes SVG en ligne

export function Logo({ size = 'md' }) {
  return (
    <span className={`logo logo--${size}`}>
      <img src="/logo.jpeg" alt="ECHOSCIENCE" width="500" height="500" />
    </span>
  );
}

const PATHS = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  arrowLeft: <path d="M19 12H5M11 18l-6-6 6-6" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  pin: <><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
  play: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M10 9l5 3-5 3z" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  link: <><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></>,
  copy: <><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></>,
  check: <path d="M5 12l5 5L20 7" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8z" fill="currentColor" stroke="none" />,
  tiktok: <path d="M16 3c.4 2.4 1.9 4 4 4.3v3.4a7.6 7.6 0 0 1-4-1.2V16a6 6 0 1 1-6-6v3.4a2.6 2.6 0 1 0 2.6 2.6V3z" fill="currentColor" stroke="none" />,
  youtube: <><rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" stroke="none" /><path d="M10 9l5 3-5 3z" fill="var(--icon-cut, #0B1638)" stroke="none" /></>,
  linkedin: <><rect x="3" y="9" width="4" height="12" fill="currentColor" stroke="none" /><circle cx="5" cy="5" r="2" fill="currentColor" stroke="none" /><path d="M10 9h4v2a4 4 0 0 1 7 3v7h-4v-6a2 2 0 0 0-4 0v6h-3z" fill="currentColor" stroke="none" /></>,
  x: <path d="M4 4l16 16M20 4L4 20" />,
  whatsapp: <><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" /><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z" fill="currentColor" stroke="none" /></>,
};

export function Icon({ name, size = 20, className = '' }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {PATHS[name]}
    </svg>
  );
}
