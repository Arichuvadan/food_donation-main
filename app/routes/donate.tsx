import { useState } from 'react';
import { Link, useFetcher } from 'react-router';
import {
  IconLeaf,
  IconUser,
  IconMapPin,
  IconPhone,
  IconPackage,
  IconClock,
  IconUpload,
  IconCircleCheck,
  IconArrowLeft,
  IconCamera,
} from '@tabler/icons-react';
import { createDonation } from '~/server/db.server';
import type { Route } from './+types/donate';
import type { FoodType } from '~/data/donations';
import styles from './donate.module.css';

// ── Server action ─────────────────────────────────────────────────────────────

export async function action({ request }: Route.ActionArgs) {
  const fd = await request.formData();

  const donorName = String(fd.get('name') ?? '').trim();
  const contactPhone = String(fd.get('phone') ?? '').trim();
  const address = String(fd.get('address') ?? '').trim();
  const foodType = String(fd.get('foodType') ?? '') as FoodType;
  const quantity = String(fd.get('quantity') ?? '').trim();
  const preparedRaw = String(fd.get('preparedTime') ?? '');
  const description = String(fd.get('description') ?? '').trim();

  const errors: Record<string, string> = {};
  if (!donorName) errors.name = 'Contact name is required.';
  if (!contactPhone) errors.phone = 'Phone number is required.';
  if (!address) errors.address = 'Pickup address is required.';
  if (!foodType) errors.foodType = 'Please select food type.';
  if (!quantity) errors.quantity = 'Quantity is required.';
  if (!preparedRaw) errors.preparedTime = 'Preparation time is required.';

  if (Object.keys(errors).length > 0) {
    return { donationId: null as string | null, errors };
  }

  const donation = createDonation({
    donorName,
    contactPhone,
    address,
    foodType,
    quantity,
    preparedAt: new Date(preparedRaw).toISOString(),
    description,
  });

  return { donationId: donation.id, errors: null as Record<string, string> | null };
}

// ── Client component ──────────────────────────────────────────────────────────

interface FormState {
  name: string;
  phone: string;
  address: string;
  foodType: string;
  quantity: string;
  preparedTime: string;
  description: string;
}

export default function Donate() {
  const fetcher = useFetcher<typeof action>();
  const serverErrors = fetcher.data?.errors ?? {};

  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    address: '',
    foodType: '',
    quantity: '',
    preparedTime: '',
    description: '',
  });
  const [clientErrors, setClientErrors] = useState<Partial<FormState>>({});
  const [photoName, setPhotoName] = useState<string | null>(null);

  const errors = { ...clientErrors, ...serverErrors };

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Contact name is required.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    if (!form.address.trim()) e.address = 'Pickup address is required.';
    if (!form.foodType) e.foodType = 'Please select food type.';
    if (!form.quantity.trim()) e.quantity = 'Quantity is required.';
    if (!form.preparedTime) e.preparedTime = 'Preparation time is required.';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setClientErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoName(file.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setClientErrors(errs);
      return;
    }
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('phone', form.phone);
    fd.append('address', form.address);
    fd.append('foodType', form.foodType);
    fd.append('quantity', form.quantity);
    fd.append('preparedTime', form.preparedTime);
    fd.append('description', form.description);
    fetcher.submit(fd, { method: 'post' });
  };

  const donationId = fetcher.data?.donationId;

  if (donationId) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <IconCircleCheck size={64} />
          </div>
          <h1>Donation Submitted!</h1>
          <p>
            Thank you, <strong>{form.name}</strong>! Your donation has been registered.
            A FoodEx volunteer will reach out shortly to coordinate pickup.
          </p>
          <div className={styles.successId}>
            Donation ID: <strong>{donationId}</strong>
          </div>
          <div className={styles.successActions}>
            <Link to={`/track?id=${donationId}`} className={styles.primaryBtn}>
              Track Your Donation
            </Link>
            <Link to="/" className={styles.ghostBtn}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.backLink}>
            <IconArrowLeft size={16} /> Back
          </Link>
          <div className={styles.badge}>
            <IconLeaf size={13} /> Donate Food
          </div>
          <h1>Share Your Surplus Food</h1>
          <p>Fill in the details below and we'll arrange a pickup. It takes less than 3 minutes.</p>
        </div>
      </div>

      <div className={styles.formWrapper}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Donor Information */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <IconUser size={20} className={styles.sectionIcon} />
              <h2>Donor Information</h2>
            </div>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label htmlFor="name">Contact Name *</label>
                <div className={styles.inputWrapper}>
                  <IconUser size={16} className={styles.fieldIcon} />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    className={errors.name ? styles.inputError : ''}
                  />
                </div>
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="phone">Phone Number *</label>
                <div className={styles.inputWrapper}>
                  <IconPhone size={16} className={styles.fieldIcon} />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={handleChange}
                    className={errors.phone ? styles.inputError : ''}
                  />
                </div>
                {errors.phone && <span className={styles.error}>{errors.phone}</span>}
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label htmlFor="address">Pickup Address *</label>
                <div className={styles.inputWrapper}>
                  <IconMapPin size={16} className={styles.fieldIcon} />
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Full address with landmark"
                    value={form.address}
                    onChange={handleChange}
                    className={errors.address ? styles.inputError : ''}
                  />
                </div>
                {errors.address && <span className={styles.error}>{errors.address}</span>}
              </div>
            </div>
          </div>

          {/* Food Details */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <IconPackage size={20} className={styles.sectionIcon} />
              <h2>Food Details</h2>
            </div>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label htmlFor="foodType">Food Type *</label>
                <div className={styles.inputWrapper}>
                  <IconLeaf size={16} className={styles.fieldIcon} />
                  <select
                    id="foodType"
                    name="foodType"
                    value={form.foodType}
                    onChange={handleChange}
                    className={errors.foodType ? styles.inputError : ''}
                  >
                    <option value="">Select food type</option>
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="both">Both (Mixed)</option>
                    <option value="animal-feed">Animal Feed</option>
                  </select>
                </div>
                {errors.foodType && <span className={styles.error}>{errors.foodType}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="quantity">Quantity / Servings *</label>
                <div className={styles.inputWrapper}>
                  <IconPackage size={16} className={styles.fieldIcon} />
                  <input
                    id="quantity"
                    name="quantity"
                    type="text"
                    placeholder="e.g. 10 kg (about 35 servings)"
                    value={form.quantity}
                    onChange={handleChange}
                    className={errors.quantity ? styles.inputError : ''}
                  />
                </div>
                {errors.quantity && <span className={styles.error}>{errors.quantity}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="preparedTime">Time of Preparation *</label>
                <div className={styles.inputWrapper}>
                  <IconClock size={16} className={styles.fieldIcon} />
                  <input
                    id="preparedTime"
                    name="preparedTime"
                    type="datetime-local"
                    value={form.preparedTime}
                    onChange={handleChange}
                    className={errors.preparedTime ? styles.inputError : ''}
                  />
                </div>
                {errors.preparedTime && <span className={styles.error}>{errors.preparedTime}</span>}
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label htmlFor="description">Description (optional)</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Briefly describe what food is available and any packaging details..."
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <IconCamera size={20} className={styles.sectionIcon} />
              <h2>Food Photo (optional)</h2>
            </div>
            <label className={styles.uploadArea} htmlFor="photo">
              <input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className={styles.hiddenInput} />
              {photoName ? (
                <div className={styles.uploadedFile}>
                  <IconCircleCheck size={24} style={{ color: 'var(--color-success)' }} />
                  <span>{photoName}</span>
                </div>
              ) : (
                <>
                  <IconUpload size={32} className={styles.uploadIcon} />
                  <span className={styles.uploadTitle}>Click to upload a photo</span>
                  <span className={styles.uploadHint}>PNG, JPG up to 10MB</span>
                </>
              )}
            </label>
          </div>

          <div className={styles.submitRow}>
            <button type="submit" className={styles.submitBtn} disabled={fetcher.state === 'submitting'}>
              {fetcher.state === 'submitting' ? 'Submitting…' : 'Submit Donation'}
            </button>
            <p className={styles.submitNote}>
              Our team will contact you within 30 minutes to confirm pickup.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
