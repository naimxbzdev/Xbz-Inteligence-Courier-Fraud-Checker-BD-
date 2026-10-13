import crypto from 'crypto';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  businessName: string;
  role: 'merchant' | 'admin';
  createdAt: string;
  passwordHash: string;
  savedSearches: Array<{
    id: string;
    phone: string;
    maskedPhone: string;
    timestamp: string;
    riskLevel: string;
    verifiedCouriers: number;
  }>;
}

const adminPasskey = process.env.ADMIN_PASSKEY || 'admin123';

// In-memory persistent user repository with pre-seeded demo merchant & admin accounts
const users = new Map<string, UserAccount>();

function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, 'xbz_intelligence_salt_2026', 1000, 64, 'sha512').toString('hex');
}

// Seed default demo merchant and admin accounts
const demoMerchantId = 'usr_merchant_demo';
users.set('merchant@xbz.intelligence', {
  id: demoMerchantId,
  email: 'merchant@xbz.intelligence',
  name: 'Naim Merchant',
  businessName: 'Dhaka Elite Commerce',
  role: 'merchant',
  createdAt: new Date().toISOString(),
  passwordHash: hashPassword('merchant123'),
  savedSearches: [
    {
      id: 'search_1',
      phone: '01711000001',
      maskedPhone: '01711-***001',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      riskLevel: 'low',
      verifiedCouriers: 1,
    },
    {
      id: 'search_2',
      phone: '01711000002',
      maskedPhone: '01711-***002',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      riskLevel: 'high',
      verifiedCouriers: 1,
    },
  ],
});

export function registerUser(email: string, password: string, name: string, businessName: string): UserAccount {
  const normalizedEmail = email.toLowerCase().trim();
  if (users.has(normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }
  const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newUser: UserAccount = {
    id,
    email: normalizedEmail,
    name: name.trim(),
    businessName: businessName.trim(),
    role: 'merchant',
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword(password),
    savedSearches: [],
  };
  users.set(normalizedEmail, newUser);
  return newUser;
}

export function authenticateUser(email: string, password: string): UserAccount {
  const normalizedEmail = email.toLowerCase().trim();
  const user = users.get(normalizedEmail);
  if (!user) {
    throw new Error('Invalid email or password.');
  }
  const hash = hashPassword(password);
  if (user.passwordHash !== hash) {
    throw new Error('Invalid email or password.');
  }
  return user;
}

export function authenticateAdmin(passkey: string): boolean {
  return passkey === adminPasskey;
}

export function getUserById(id: string): UserAccount | undefined {
  for (const user of users.values()) {
    if (user.id === id) return user;
  }
  return undefined;
}

export function saveMerchantSearch(userId: string, searchData: { phone: string; maskedPhone: string; riskLevel: string; verifiedCouriers: number }) {
  const user = getUserById(userId);
  if (user) {
    user.savedSearches.unshift({
      id: `saved_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...searchData,
    });
    if (user.savedSearches.length > 50) {
      user.savedSearches.pop();
    }
  }
}
