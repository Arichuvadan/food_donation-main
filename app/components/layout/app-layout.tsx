import { Outlet } from 'react-router';
import { Navbar } from '~/components/navbar/navbar';
import { Footer } from '~/components/footer/footer';
import styles from './app-layout.module.css';

export function AppLayout() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
