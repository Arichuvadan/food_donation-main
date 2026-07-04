import { Link, useLoaderData } from 'react-router';
import { IconLeaf, IconDog, IconTruckDelivery, IconMapPin, IconPaw, IconBowl, IconPhone, IconUsers, IconPackage, IconTrendingUp } from '@tabler/icons-react';
import { getAllDonations, getAllRecipients } from '~/server/db.server';
import { oldAgeHomes } from '~/data/donations';
import type { Route } from './+types/home';
import type { Donation } from '~/data/donations';
import { DonationMap } from '~/components/donation-map/donation-map';
import styles from './home.module.css';

// ── Server loader ─────────────────────────────────────────────────────────────

export async function loader() {
  const donations = getAllDonations();
  const recipients = getAllRecipients();
  const activeDonations = donations.filter(d => d.status !== 'completed' && d.status !== 'delivered');
  const completedDonations = donations.filter(d => d.status === 'completed' || d.status === 'delivered');
  
  // Calculate stats
  const totalQuantity = donations.length;
  const totalOrganizations = recipients.length;
  const activeDonorsCount = new Set(donations.map(d => d.donorName)).size;

  return {
    donations: activeDonations.slice(0, 3), // Show top 3 active donations
    allDonations: donations,
    recipients,
    stats: {
      totalDonations: totalQuantity,
      completedDonations: completedDonations.length,
      activeDonations: activeDonations.length,
      organizationsServed: totalOrganizations,
      activeDonors: activeDonorsCount,
    },
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  const { donations, allDonations, recipients, stats } = useLoaderData<typeof loader>();

  return (
    <div className={styles.splash}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.logoSection}>
          <IconLeaf size={48} className={styles.leaf} />
          <h1 className={styles.brand}>FoodEx</h1>
          <p className={styles.tagline}>Reduce Food Waste, Feed Lives</p>
        </div>

        <div className={styles.actionsGrid}>
          <Link to="/donate" className={`${styles.btn} ${styles.primaryBtn}`}>
            <IconBowl size={20} />
            Donate Food
          </Link>
          <Link to="/recipients" className={`${styles.btn} ${styles.secondaryBtn}`}>
            <IconPackage size={20} />
            Find Food
          </Link>
          <Link to="/track" className={`${styles.btn} ${styles.ghostBtn}`}>
            <IconTruckDelivery size={20} />
            Track Delivery
          </Link>
        </div>
      </div>

      {/* Statistics Section */}
      <section className={styles.statsSection}>
        <h2>Impact So Far</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <IconBowl className={styles.statIcon} />
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{stats.completedDonations}</div>
              <div className={styles.statLabel}>Meals Delivered</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <IconUsers className={styles.statIcon} />
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{stats.organizationsServed}</div>
              <div className={styles.statLabel}>Organizations Served</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <IconTrendingUp className={styles.statIcon} />
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{stats.activeDonors}</div>
              <div className={styles.statLabel}>Active Donors</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <IconPackage className={styles.statIcon} />
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{stats.activeDonations}</div>
              <div className={styles.statLabel}>In Progress</div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={styles.mapSection}>
        <h2>Nearby Donations & Recipients</h2>
        <DonationMap
          donations={allDonations}
          recipients={recipients}
          oldAgeHomes={oldAgeHomes}
          height="400px"
        />
      </section>

      {/* Active Donations */}
      {donations.length > 0 ? (
        <section className={styles.activeDonationsSection}>
          <h2>Recently Posted Donations</h2>
          <div className={styles.donationsList}>
            {donations.map(donation => (
              <DonationCard key={donation.id} donation={donation} />
            ))}
          </div>
        </section>
      ) : (
        <section className={styles.emptyState}>
          <IconBowl size={48} />
          <h2>No Active Donations</h2>
          <p>Be the first to share food! Help us reduce waste and feed lives.</p>
          <Link to="/donate" className={styles.emptyStateBtn}>Start Donating</Link>
        </section>
      )}
    </div>
  );
}

function DonationCard({ donation }: { donation: Donation }) {
  const statusLabel = {
    'pending': 'Awaiting Pickup',
    'created': 'Just Posted',
    'accepted': 'Claimed',
    'pickup_started': 'Pickup Started',
    'picked_up': 'Picked Up',
    'in_transit': 'In Transit',
    'delivered': 'Delivered',
    'completed': 'Completed',
  }[donation.status] || donation.status;

  const foodTypeLabel = {
    'veg': '🥗 Vegetarian',
    'non-veg': '🍗 Non-Vegetarian',
    'both': '🍽️ Mixed',
    'animal-feed': '🐾 Animal Feed',
  }[donation.foodType] || donation.foodType;

  const statusColor = {
    'pending': '#f59e0b',
    'created': '#f59e0b',
    'accepted': '#3b82f6',
    'pickup_started': '#3b82f6',
    'picked_up': '#3b82f6',
    'in_transit': '#3b82f6',
    'delivered': '#10b981',
    'completed': '#06b6d4',
  }[donation.status] || '#6b7280';

  return (
    <div className={styles.donationCard}>
      <div className={styles.donationCardHeader}>
        <div>
          <h3>{donation.donorName}</h3>
          <p className={styles.foodType}>{foodTypeLabel}</p>
        </div>
        <span className={styles.statusBadge} style={{ backgroundColor: statusColor }}>
          {statusLabel}
        </span>
      </div>

      <div className={styles.donationCardBody}>
        <p><strong>Quantity:</strong> {donation.quantity}</p>
        <p><strong>Details:</strong> {donation.description}</p>
      </div>

      <div className={styles.donationCardFooter}>
        <span className={styles.distance}><IconMapPin size={14} /> {donation.distance}</span>
        <Link to={`/track?id=${donation.id}`} className={styles.trackBtn}>
          Track →
        </Link>
      </div>
    </div>
  );
}
