import { useState } from 'react';
import { useLoaderData, useSearchParams, useNavigate, useFetcher } from 'react-router';
import {
  IconTruck,
  IconSearch,
  IconMapPin,
  IconUser,
  IconPackage,
  IconCircle,
  IconCircleCheck,
  IconClock,
  IconPhone,
  IconClipboardCheck,
  IconAlertCircle,
  IconBuildingWarehouse,
  IconFlag,
  IconPoint,
  IconCurrentLocation,
  IconNavigation,
  IconArrowRight,
} from '@tabler/icons-react';
import { searchDonationsByName, confirmDelivery } from '~/server/db.server';
import type { Route } from './+types/track';
import type { Donation, DonationStatus, RouteStop, RouteStopType } from '~/data/donations';
import styles from './track.module.css';

// ── Server loader & action ────────────────────────────────────────────────────

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('name')?.trim() ?? '';
  const donations = query ? searchDonationsByName(query) : [];
  return { donations, query };
}

export async function action({ request }: Route.ActionArgs) {
  const fd = await request.formData();
  const intent = String(fd.get('intent') ?? '');
  if (intent === 'confirm') {
    const donationId = String(fd.get('donationId') ?? '');
    confirmDelivery(donationId);
  }
  return { ok: true };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCurrentStop(donation: Donation): RouteStop | null {
  if (!donation.route || donation.route.length === 0) return null;
  return donation.route.find(s => s.status === 'current') ?? null;
}

function getStatusLabel(status: DonationStatus) {
  if (status === 'pending') return 'Awaiting Pickup';
  if (status === 'picked_up') return 'Picked Up';
  if (status === 'in_transit') return 'In Transit';
  if (status === 'delivered') return 'Delivered';
  return status;
}

const STEPS: { key: DonationStatus | 'submitted'; label: string; desc: string }[] = [
  { key: 'submitted', label: 'Submitted', desc: 'Donation details received.' },
  { key: 'picked_up', label: 'Picked Up', desc: 'Volunteer has collected the food from donor.' },
  { key: 'in_transit', label: 'In Transit', desc: 'Food is on the way to the recipient.' },
  { key: 'delivered', label: 'Delivered', desc: 'Food successfully delivered.' },
];

function getStepIndex(status: DonationStatus): number {
  if (status === 'pending') return 0;
  if (status === 'picked_up') return 1;
  if (status === 'in_transit') return 2;
  if (status === 'delivered') return 3;
  return 0;
}

const STOP_ICON: Record<RouteStopType, React.ReactNode> = {
  pickup: <IconPackage size={14} />,
  hub: <IconBuildingWarehouse size={14} />,
  transit: <IconTruck size={14} />,
  delivery: <IconFlag size={14} />,
};

const STOP_LABEL: Record<RouteStopType, string> = {
  pickup: 'Pickup',
  hub: 'FoodEx Hub',
  transit: 'Transit Point',
  delivery: 'Delivery',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function Track() {
  const loaderData = useLoaderData<typeof loader>();
  const { donations, query } = loaderData ?? { donations: [], query: '' };
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [inputName, setInputName] = useState(searchParams.get('name') ?? '');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const confirmFetcher = useFetcher<typeof action>();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const name = inputName.trim();
    if (name) navigate(`/track?name=${encodeURIComponent(name)}`);
  };

  const selected = donations.find(d => d.id === selectedId) ?? (donations.length === 1 ? donations[0] : null);
  const isDelivered = selected?.status === 'delivered' || confirmFetcher.data?.ok === true;
  const currentStop = selected ? getCurrentStop(selected) : null;
  const currentStep = selected ? getStepIndex(selected.status) : -1;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.badge}>
            <IconNavigation size={13} /> Live Tracking
          </div>
          <h1>Track Your Delivery</h1>
          <p>Enter the donor's name or your organization name to track where the food is right now.</p>

          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.searchInput}>
              <IconSearch size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="e.g. Ramesh Mehta or Little Stars Orphanage"
                value={inputName}
                onChange={e => setInputName(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.searchBtn}>Track</button>
          </form>
        </div>
      </div>

      <div className={styles.content}>
        {/* Idle state */}
        {!query && (
          <div className={styles.placeholder}>
            <IconClipboardCheck size={56} style={{ color: 'var(--color-text-light)' }} />
            <h3>Find Your Delivery</h3>
            <p>Enter a donor's name (e.g. <strong>Ramesh Mehta</strong>) or your organization name (e.g. <strong>Little Stars Orphanage</strong>) to see live location updates.</p>
          </div>
        )}

        {/* No results */}
        {query && donations.length === 0 && (
          <div className={styles.placeholder}>
            <IconAlertCircle size={56} style={{ color: 'var(--color-error)' }} />
            <h3>No Donations Found</h3>
            <p>We couldn't find any donations matching <strong>"{query}"</strong>. Try a different name.</p>
          </div>
        )}

        {/* Multiple results — pick one */}
        {donations.length > 1 && !selectedId && (
          <div className={styles.resultsList}>
            <h2 className={styles.resultsTitle}>{donations.length} donations found for "{query}"</h2>
            {donations.map(d => {
              const curStop = getCurrentStop(d);
              return (
                <button
                  key={d.id}
                  className={styles.resultCard}
                  onClick={() => setSelectedId(d.id)}
                >
                  <div className={styles.resultLeft}>
                    <div className={styles.resultDonor}>
                      <IconUser size={15} /> {d.donorName}
                    </div>
                    <div className={styles.resultAddress}>
                      <IconMapPin size={13} /> {d.address}
                    </div>
                    {d.claimedBy && (
                      <div className={styles.resultRecipient}>
                        <IconFlag size={13} /> For: {d.claimedBy}
                      </div>
                    )}
                  </div>
                  <div className={styles.resultRight}>
                    <span className={`${styles.statusPill} ${styles['status_' + d.status]}`}>
                      {getStatusLabel(d.status)}
                    </span>
                    {curStop && (
                      <span className={styles.resultCurrentLoc}>
                        <IconCurrentLocation size={12} /> {curStop.name}
                      </span>
                    )}
                    <IconArrowRight size={18} className={styles.resultArrow} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Detail view */}
        {selected && (
          <div className={styles.trackLayout}>
            {/* Back button when multiple results */}
            {donations.length > 1 && (
              <button className={styles.backBtn} onClick={() => setSelectedId(null)}>
                ← Back to results
              </button>
            )}

            <div className={styles.leftCol}>

              {/* Current Location Hero */}
              <div className={styles.locationHero}>
                <div className={styles.locationHeroLabel}>
                  <IconCurrentLocation size={16} />
                  {isDelivered ? 'Delivered To' : selected.status === 'pending' ? 'At Donor\'s Location' : 'Currently At'}
                </div>
                <div className={styles.locationHeroName}>
                  {isDelivered && selected.claimedBy
                    ? selected.claimedBy
                    : currentStop
                    ? currentStop.name
                    : selected.donorName}
                </div>
                <div className={styles.locationHeroAddress}>
                  <IconMapPin size={14} />
                  {isDelivered && selected.claimedBy
                    ? 'Delivery confirmed'
                    : currentStop
                    ? currentStop.address
                    : selected.address}
                </div>
                <span className={`${styles.statusPill} ${styles['status_' + (isDelivered ? 'delivered' : selected.status)]}`}>
                  {isDelivered ? 'Delivered' : getStatusLabel(selected.status)}
                </span>
              </div>

              {/* Delivery Route */}
              {selected.route && selected.route.length > 0 && (
                <div className={styles.routeCard}>
                  <div className={styles.cardHeader}>
                    <h2>📍 Live Route</h2>
                    <span className={styles.routeBadge}>{selected.route.length} stops</span>
                  </div>
                  <DeliveryRoute stops={selected.route} />
                </div>
              )}

              {/* Status Timeline */}
              <div className={styles.timelineCard}>
                <div className={styles.cardHeader}>
                  <h2>Delivery Timeline</h2>
                </div>
                <div className={styles.timeline}>
                  {STEPS.map((step, i) => {
                    const effectiveStep = isDelivered ? 3 : currentStep;
                    const done = i <= effectiveStep;
                    const active = i === effectiveStep;
                    return (
                      <div key={step.key} className={styles.timelineStep}>
                        <div className={styles.timelineLeft}>
                          <div className={`${styles.dot} ${done ? styles.dotDone : ''} ${active ? styles.dotActive : ''}`}>
                            {done ? <IconCircleCheck size={20} /> : <IconCircle size={20} />}
                          </div>
                          {i < STEPS.length - 1 && (
                            <div className={`${styles.line} ${done && i < effectiveStep ? styles.lineDone : ''}`} />
                          )}
                        </div>
                        <div className={styles.timelineRight}>
                          <div className={`${styles.stepLabel} ${done ? styles.stepLabelDone : ''}`}>
                            {step.label}
                          </div>
                          <div className={styles.stepDesc}>{step.desc}</div>
                          {step.key === 'submitted' && selected.submittedAt && (
                            <div className={styles.stepTime}>
                              <IconClock size={12} />
                              {new Date(selected.submittedAt).toLocaleString()}
                            </div>
                          )}
                          {step.key === 'picked_up' && selected.pickedUpAt && (
                            <div className={styles.stepTime}>
                              <IconClock size={12} />
                              {new Date(selected.pickedUpAt).toLocaleString()}
                            </div>
                          )}
                          {step.key === 'delivered' && selected.deliveredAt && (
                            <div className={styles.stepTime}>
                              <IconClock size={12} />
                              {new Date(selected.deliveredAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Side panel */}
            <div className={styles.sidePanel}>

              {/* Donator Info */}
              <div className={styles.detailCard}>
                <div className={styles.cardHeader}>
                  <h2>Donator Info</h2>
                </div>
                <div className={styles.detailRows}>
                  <DetailRow icon={<IconUser size={16} />} label="Donor Name" value={selected.donorName} />
                  <DetailRow icon={<IconMapPin size={16} />} label="Donor's Location" value={selected.address} />
                  <DetailRow icon={<IconPhone size={16} />} label="Contact" value={selected.contactPhone} />
                  <DetailRow icon={<IconPackage size={16} />} label="Food & Quantity" value={selected.quantity} />
                  <DetailRow icon={<IconClock size={16} />} label="Prepared At" value={new Date(selected.preparedAt).toLocaleString()} />
                </div>
              </div>

              {/* Logistics */}
              {(selected.volunteer || selected.claimedBy) && (
                <div className={styles.detailCard}>
                  <div className={styles.cardHeader}>
                    <h2>Logistics</h2>
                  </div>
                  <div className={styles.detailRows}>
                    {selected.volunteer && (
                      <DetailRow icon={<IconTruck size={16} />} label="Volunteer" value={selected.volunteer} />
                    )}
                    {selected.claimedBy && (
                      <DetailRow icon={<IconFlag size={16} />} label="Recipient" value={selected.claimedBy} />
                    )}
                    <DetailRow icon={<IconPhone size={16} />} label="Helpline" value="+91 80 1234 5678" />
                  </div>
                </div>
              )}

              {/* Confirm Receipt */}
              {selected.status === 'in_transit' && !isDelivered && (
                <div className={styles.confirmCard}>
                  <h3>Confirm Receipt</h3>
                  <p>Has the food been received at your facility?</p>
                  <confirmFetcher.Form method="post">
                    <input type="hidden" name="intent" value="confirm" />
                    <input type="hidden" name="donationId" value={selected.id} />
                    <button
                      type="submit"
                      className={styles.confirmBtn}
                      disabled={confirmFetcher.state === 'submitting'}
                    >
                      <IconCircleCheck size={18} />
                      {confirmFetcher.state === 'submitting' ? 'Confirming…' : 'Confirm Receipt'}
                    </button>
                  </confirmFetcher.Form>
                </div>
              )}

              {isDelivered && (
                <div className={styles.confirmedCard}>
                  <IconCircleCheck size={36} style={{ color: 'var(--color-success)' }} />
                  <h3>Successfully Delivered</h3>
                  <p>
                    {selected.deliveredAt
                      ? `Confirmed delivered on ${new Date(selected.deliveredAt).toLocaleDateString()}.`
                      : 'This donation has been confirmed delivered.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      <div className={styles.detailIcon}>{icon}</div>
      <div>
        <div className={styles.detailLabel}>{label}</div>
        <div className={styles.detailValue}>{value}</div>
      </div>
    </div>
  );
}

function DeliveryRoute({ stops }: { stops: RouteStop[] }) {
  return (
    <div className={styles.routeList}>
      {stops.map((stop, i) => (
        <div key={i} className={`${styles.routeStop} ${styles['routeStop_' + stop.status]}`}>
          <div className={styles.routeStopLeft}>
            <div className={`${styles.routeDot} ${styles['routeDot_' + stop.status]}`}>
              {stop.status === 'reached' ? <IconCircleCheck size={18} /> : stop.status === 'current' ? <IconPoint size={18} /> : <IconCircle size={18} />}
            </div>
            {i < stops.length - 1 && (
              <div className={`${styles.routeLine} ${stop.status === 'reached' ? styles.routeLineDone : ''}`} />
            )}
          </div>
          <div className={styles.routeStopRight}>
            <div className={styles.routeStopHeader}>
              <span className={`${styles.routeTypeBadge} ${styles['routeType_' + stop.type]}`}>
                {STOP_ICON[stop.type]} {STOP_LABEL[stop.type]}
              </span>
              {stop.status === 'current' && (
                <span className={styles.routeCurrentBadge}>● En Route</span>
              )}
            </div>
            <div className={styles.routeStopName}>{stop.name}</div>
            <div className={styles.routeStopAddress}><IconMapPin size={12} /> {stop.address}</div>
            {stop.arrivedAt && (
              <div className={styles.routeStopTime}><IconClock size={12} /> {new Date(stop.arrivedAt).toLocaleString()}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
