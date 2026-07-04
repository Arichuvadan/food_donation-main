import { NavLink, Link } from 'react-router';
import { IconLeaf, IconMenu2, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import styles from './navbar.module.css';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <IconLeaf size={26} stroke={2} />
          <span>FoodEx</span>
        </Link>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/donate" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>
              Donate Food
            </NavLink>
          </li>
          <li>
            <NavLink to="/recipients" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>
              Recipient Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/track" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>
              Track Delivery
            </NavLink>
          </li>
          <li>
            <NavLink to="/domain" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>
              Domain
            </NavLink>
          </li>
        </ul>

        <div className={styles.actions}>
          <Link to="/donate" className={styles.ctaBtn}>Donate Now</Link>
          <button
            className={styles.menuToggle}
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
