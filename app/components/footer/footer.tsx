import { IconLeaf, IconHeart, IconPhone, IconMail, IconMapPin } from '@tabler/icons-react';
import { Link } from 'react-router';
import styles from './footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <IconLeaf size={24} stroke={2} />
            <span>FoodEx</span>
          </div>
          <p>Connecting surplus food with those who need it most. Together, we can eliminate food waste and hunger.</p>
        </div>

        <div className={styles.column}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/donate">Donate Food</Link></li>
            <li><Link to="/recipients">Recipient Dashboard</Link></li>
            <li><Link to="/track">Track Delivery</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Contact Us</h4>
          <ul className={styles.contactList}>
            <li><IconPhone size={15} /><span>+91 80 1234 5678</span></li>
            <li><IconMail size={15} /><span>hello@foodex.in</span></li>
            <li><IconMapPin size={15} /><span>Bengaluru, Karnataka, India</span></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2024 FoodEx. Made with <IconHeart size={13} className={styles.heart} /> to fight hunger.</p>
      </div>
    </footer>
  );
}
