import { Link } from 'react-router';
import {
  IconArrowLeft,
  IconBrandGithub,
  IconCircleCheck,
  IconExternalLink,
  IconLink,
  IconMapPin,
  IconShieldCheck,
  IconWorld,
} from '@tabler/icons-react';
import styles from './domain.module.css';

const liveDomain = 'https://food-donation-main-1.onrender.com/';

const quickLinks = [
  { label: 'Donate Food', path: '/donate', description: 'Register surplus food for pickup.' },
  { label: 'Find Food', path: '/recipients', description: 'Review available donations as a recipient.' },
  { label: 'Track Delivery', path: '/track', description: 'Follow pickup and delivery progress.' },
];

export default function Domain() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Link to="/" className={styles.backLink}>
            <IconArrowLeft size={16} /> Back to Home
          </Link>
          <div className={styles.badge}>
            <IconWorld size={13} /> Live Domain
          </div>
          <h1>FoodEx Domain Center</h1>
          <p>
            Share the public FoodEx address, check the deployment surface, and jump into the most used app areas.
          </p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.domainPanel}>
          <div className={styles.domainHeader}>
            <div className={styles.domainIcon}>
              <IconLink size={24} />
            </div>
            <div>
              <span className={styles.panelLabel}>Current public URL</span>
              <h2>{liveDomain.replace('https://', '').replace(/\/$/, '')}</h2>
            </div>
          </div>

          <div className={styles.urlRow}>
            <code>{liveDomain}</code>
            <a href={liveDomain} target="_blank" rel="noreferrer" className={styles.openButton}>
              <IconExternalLink size={16} /> Open
            </a>
          </div>

          <div className={styles.statusGrid}>
            <div className={styles.statusItem}>
              <IconCircleCheck size={18} />
              <span>Render deployment active</span>
            </div>
            <div className={styles.statusItem}>
              <IconShieldCheck size={18} />
              <span>HTTPS enabled</span>
            </div>
            <div className={styles.statusItem}>
              <IconMapPin size={18} />
              <span>FoodEx routes available</span>
            </div>
          </div>
        </div>

        <div className={styles.quickLinks}>
          {quickLinks.map(link => (
            <Link key={link.path} to={link.path} className={styles.quickLink}>
              <div>
                <h3>{link.label}</h3>
                <p>{link.description}</p>
              </div>
              <IconExternalLink size={18} />
            </Link>
          ))}
        </div>

        <div className={styles.infoBand}>
          <IconBrandGithub size={22} />
          <div>
            <h2>Ready for a custom domain</h2>
            <p>
              The app can point to a branded domain such as foodex.org after the domain DNS records are connected to Render.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
