import fs from 'node:fs';
import path from 'node:path';
import { donations as seedDonations, recipients as seedRecipients } from '~/data/donations';
import type { Donation, Recipient, DonationStatus, FoodType } from '~/data/donations';

export type { Donation, Recipient, DonationStatus, FoodType };

const DB_PATH = path.resolve(process.cwd(), 'data', 'db.json');

interface DB {
  donations: Donation[];
  recipients: Recipient[];
}

function ensureDb(): DB {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(DB_PATH)) {
    const seed: DB = { donations: [...seedDonations], recipients: [...seedRecipients] };
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }

  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as DB;
  } catch {
    const seed: DB = { donations: [...seedDonations], recipients: [...seedRecipients] };
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

function saveDb(db: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

// ── Donations ────────────────────────────────────────────────────────────────

export function getAllDonations(): Donation[] {
  return ensureDb().donations.map(donation => ({
    ...donation,
    coordinates: donation.coordinates ?? { lat: 13.0827, lng: 80.2707 },
  }));
}

export function getDonationById(id: string): Donation | undefined {
  const donation = ensureDb().donations.find(d => d.id === id);
  if (!donation) return undefined;
  return {
    ...donation,
    coordinates: donation.coordinates ?? { lat: 13.0827, lng: 80.2707 },
  };
}

export function searchDonationsByName(query: string): Donation[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ensureDb().donations.filter(
    d =>
      d.donorName.toLowerCase().includes(q) ||
      (d.claimedBy ?? '').toLowerCase().includes(q)
  );
}

export interface CreateDonationInput {
  donorName: string;
  contactPhone: string;
  address: string;
  foodType: FoodType;
  quantity: string;
  preparedAt: string;
  description: string;
  coordinates?: { lat: number; lng: number };
}

export function createDonation(input: CreateDonationInput): Donation {
  const db = ensureDb();
  const id = 'D' + String(Date.now()).slice(-6);
  
  // Default coordinates to Chennai center if not provided
  const defaultCoordinates = { lat: 13.0827, lng: 80.2707 };
  const coordinates = input.coordinates || defaultCoordinates;
  
  const donation: Donation = {
    id,
    ...input,
    coordinates,
    status: 'pending',
    distance: 'N/A',
    submittedAt: new Date().toISOString(),
  };
  db.donations.unshift(donation);
  saveDb(db);
  return donation;
}

export function confirmDelivery(donationId: string): void {
  const db = ensureDb();
  const donation = db.donations.find(d => d.id === donationId);
  if (donation && donation.status === 'in_transit') {
    donation.status = 'delivered';
    donation.deliveredAt = new Date().toISOString();
    saveDb(db);
  }
}

// ── Recipients ───────────────────────────────────────────────────────────────

export function getAllRecipients(): Recipient[] {
  return ensureDb().recipients;
}

export function getRecipientById(id: string): Recipient | undefined {
  return ensureDb().recipients.find(r => r.id === id);
}

export interface ClaimResult {
  ok: boolean;
  error?: string;
}

export function claimDonation(donationId: string, recipientId: string): ClaimResult {
  const db = ensureDb();
  const donation = db.donations.find(d => d.id === donationId);
  const recipient = db.recipients.find(r => r.id === recipientId);

  if (!donation) return { ok: false, error: 'Donation not found.' };
  if (!recipient) return { ok: false, error: 'Recipient not found.' };
  if (donation.status !== 'pending') return { ok: false, error: 'Donation is no longer available.' };

  donation.status = 'picked_up';
  donation.claimedBy = recipient.name;
  donation.pickedUpAt = new Date().toISOString();

  if (!recipient.claimedDonations.includes(donationId)) {
    recipient.claimedDonations.push(donationId);
  }

  saveDb(db);
  return { ok: true };
}
