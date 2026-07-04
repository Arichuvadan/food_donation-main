import { useState } from 'react';
import { Link, useLoaderData, useFetcher } from 'react-router';
import {
  IconBuildingCommunity,
  IconMapPin,
  IconPhone,
  IconClock,
  IconLeaf,
  IconMeat,
  IconCheck,
  IconHistory,
  IconSettings,
  IconUsers,
  IconTruck,
  IconPackage,
  IconCircleCheck,
  IconSalad,
  IconArrowLeft,
  IconDog,
} from '@tabler/icons-react';
import { getAllDonations, getAllRecipients, claimDonation } from '~/server/db.server';
import type { Route } from './+types/recipients';
import type { Donation, Recipient } from '~/data/donations';
import styles from './recipients.module.css';

// ── Server loader & action ────────────────────────────────────────────────────

export async function loader() {
  const allDonations = getAllDonations();
  const allRecipients = getAllRecipients();
  const activeRecipient = allRecipients[0];

  const available = allDonations.filter(
    d => d.status === 'pending' && !activeRecipient.claimedDonations.includes(d.id),
  );
  const history = allDonations.filter(d =>
    activeRecipient.claimedDonations.includes(d.id),
  );

  return { available, history, activeRecipient };
}

export async function action({ request }: Route.ActionArgs) {
  const fd = await request.formData();
  const intent = String(fd.get('intent') ?? '');

  if (intent === 'claim') {
    const donationId = String(fd.get('donationId') ?? '');
    const recipientId = String(fd.get('recipientId') ?? '');
    return claimDonation(donationId, recipientId);
  }

  return { ok: false, error: 'Unknown action.' };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type Tab = 'available' | 'history' | 'profile';

const statusLabels: Record<string, string> = {
  pending: 'Available',
  picked_up: 'Being Picked Up',
  in_transit: 'In Transit',
  delivered: 'Delivered',
};

const foodTypeIcons: Record<string, React.ReactNode> = {
  veg: <IconSalad size={14} style={{ color: 'var(--color-success)' }} />,
  'non-veg': <IconMeat size={14} style={{ color: 'var(--color-error)' }} />,
  both: <IconLeaf size={14} style={{ color: 'var(--color-warning)' }} />,
  'animal-feed': <IconDog size={14} style={{ color: '#7c5c2e' }} />,
};

function getFoodTypeLabel(type: string): string {
  if (type === 'veg') return 'Vegetarian';
  if (type === 'non-veg') return 'Non-Vegetarian';
  if (type === 'animal-feed') return 'Animal Feed';
  return 'Mixed';
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Recipients() {
  const { available, history, activeRecipient } = useLoaderData<typeof loader>();
  const [tab, setTab] = useState<Tab>('available');

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.backLink}>
            <IconArrowLeft size={16} /> Back to Home
          </Link>
          <div className={styles.badge}>
            <IconBuildingCommunity size={13} /> Recipient Dashboard
          </div>
          <h1>{activeRecipient.name}</h1>
          <div className={styles.headerMeta}>
            <span><IconMapPin size={14} />{activeRecipient.address}</span>
            <span><IconPhone size={14} />{activeRecipient.phone}</span>
            <span><IconUsers size={14} />Capacity: {activeRecipient.capacity} residents</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsBar}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'available' ? styles.activeTab : ''}`}
            onClick={() => setTab('available')}
          >
            <IconPackage size={16} />
            Available Donations
            {available.length > 0 && <span className={styles.tabBadge}>{available.length}</span>}
          </button>
          <button
            className={`${styles.tab} ${tab === 'history' ? styles.activeTab : ''}`}
            onClick={() => setTab('history')}
          >
            <IconHistory size={16} />
            Claim History
          </button>
          <button
            className={`${styles.tab} ${tab === 'profile' ? styles.activeTab : ''}`}
            onClick={() => setTab('profile')}
          >
            <IconSettings size={16} />
            Profile Settings
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Available Donations */}
        {tab === 'available' && (
          <div className={styles.donationList}>
            {available.length === 0 ? (
              <div className={styles.empty}>
                <IconCircleCheck size={48} style={{ color: 'var(--color-primary-light)' }} />
                <h3>All caught up!</h3>
                <p>No available donations right now. Check back soon.</p>
              </div>
            ) : (
              available.map(d => (
                <DonationCard key={d.id} donation={d} recipientId={activeRecipient.id} />
              ))
            )}
          </div>
        )}

        {/* Claim History */}
        {tab === 'history' && (
          <div className={styles.donationList}>
            {history.length === 0 ? (
              <div className={styles.empty}>
                <IconHistory size={48} style={{ color: 'var(--color-text-light)' }} />
                <h3>No history yet</h3>
                <p>Donations you claim will appear here.</p>
              </div>
            ) : (
              history.map(d => <HistoryCard key={d.id} donation={d} />)
            )}
          </div>
        )}

        {/* Profile */}
        {tab === 'profile' && (
          <div className={styles.profileCard}>
            <h2>Organization Profile</h2>
            <div className={styles.profileGrid}>
              <div className={styles.profileField}>
                <label>Organization Name</label>
                <input type="text" defaultValue={activeRecipient.name} />
              </div>
              <div className={styles.profileField}>
                <label>Type</label>
                <select defaultValue={activeRecipient.type}>
                  <option value="old-age-home">Old Age Home</option>
                  <option value="orphanage">Orphanage</option>
                  <option value="shelter">Shelter</option>
                  <option value="animal-shelter">Animal Shelter</option>
                </select>
              </div>
              <div className={`${styles.profileField} ${styles.full}`}>
                <label>Address</label>
                <input type="text" defaultValue={activeRecipient.address} />
              </div>
              <div className={styles.profileField}>
                <label>Contact Person</label>
                <input type="text" defaultValue={activeRecipient.contactPerson} />
              </div>
              <div className={styles.profileField}>
                <label>Phone</label>
                <input type="tel" defaultValue={activeRecipient.phone} />
              </div>
              <div className={styles.profileField}>
                <label>Resident Capacity</label>
                <input type="number" defaultValue={activeRecipient.capacity} />
              </div>
            </div>
            <button className={styles.saveBtn}>Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DonationCard({ donation, recipientId }: { donation: Donation; recipientId: string }) {
  const fetcher = useFetcher<typeof action>();
  const isClaiming = fetcher.state === 'submitting';
  const isClaimed = fetcher.data?.ok === true;

  return (
    <div className={`${styles.card} ${isClaimed ? styles.cardClaimed : ''}`}>
      <div className={styles.cardTop}>
        <div className={styles.cardLeft}>
          <div className={styles.donorName}>{donation.donorName}</div>
          <div className={styles.cardMeta}>
            <span className={styles.foodTag}>
              {foodTypeIcons[donation.foodType]}
              {getFoodTypeLabel(donation.foodType)}
            </span>
            <span><IconPackage size={13} />{donation.quantity}</span>
            <span><IconMapPin size={13} />{donation.distance} away</span>
            <span><IconClock size={13} />
              {new Date(donation.preparedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className={styles.cardDesc}>{donation.description}</p>
          <div className={styles.cardAddress}>
            <IconMapPin size={13} />{donation.address}
          </div>
        </div>
        <div className={styles.cardRight}>
          {isClaimed ? (
            <div className={styles.claimedBadge}>
              <IconCheck size={16} /> Claimed
            </div>
          ) : (
            <fetcher.Form method="post">
              <input type="hidden" name="intent" value="claim" />
              <input type="hidden" name="donationId" value={donation.id} />
              <input type="hidden" name="recipientId" value={recipientId} />
              <button type="submit" className={styles.claimBtn} disabled={isClaiming}>
                {isClaiming ? 'Claiming…' : 'Claim Donation'}
              </button>
            </fetcher.Form>
          )}
          <Link to={`/track?id=${donation.id}`} className={styles.trackLink}>
            <IconTruck size={14} /> Track
          </Link>
        </div>
      </div>
    </div>
  );
}

function HistoryCard({ donation }: { donation: Donation }) {
  const statusColors: Record<string, string> = {
    pending: styles.statusPending,
    picked_up: styles.statusTransit,
    in_transit: styles.statusTransit,
    delivered: styles.statusDelivered,
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardLeft}>
          <div className={styles.donorName}>{donation.donorName}</div>
          <div className={styles.cardMeta}>
            <span className={styles.foodTag}>
              {foodTypeIcons[donation.foodType]}
              {getFoodTypeLabel(donation.foodType)}
            </span>
            <span><IconPackage size={13} />{donation.quantity}</span>
          </div>
          <p className={styles.cardDesc}>{donation.description}</p>
        </div>
        <div className={styles.cardRight}>
          <span className={`${styles.statusBadge} ${statusColors[donation.status]}`}>
            {statusLabels[donation.status]}
          </span>
          <Link to={`/track?id=${donation.id}`} className={styles.trackLink}>
            <IconTruck size={14} /> Track
          </Link>
        </div>
      </div>
    </div>
  );
}
