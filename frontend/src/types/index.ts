export type Role = 'USER' | 'MODERATOR' | 'ADMIN';

export type ListingType = 'TRADE' | 'GIVE';
export type ListingStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';

export type ListingCategory =
  | 'FIGURINES'
  | 'DVD_BLURAY'
  | 'COMICS'
  | 'BOARD_GAMES'
  | 'FANZINES'
  | 'POSTERS'
  | 'CLOTHING'
  | 'BOOKS'
  | 'OTHER';

export type ItemCondition = 'MINT' | 'GOOD' | 'FAIR' | 'POOR';

export type ReportReason = 'INAPPROPRIATE' | 'SPAM' | 'SCAM' | 'OFFENSIVE' | 'OTHER';
export type ReportStatus = 'PENDING' | 'REVIEWED' | 'DISMISSED';
export type ReportTargetType = 'LISTING' | 'MESSAGE';

export interface User {
  id: string;
  auth0Sub: string;
  email: string;
  nickname: string | null;
  avatar: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  condition: ItemCondition;
  type: ListingType;
  status: ListingStatus;
  images: string[];
  userId: string;
  user: Pick<User, 'id' | 'nickname' | 'avatar'>;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  id: string;
  title: string;
  category: ListingCategory;
  userId: string;
  createdAt: string;
}

export interface UserInterest {
  id: string;
  userId: string;
  category: ListingCategory;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  listingId: string;
  listing: Pick<Listing, 'id' | 'title' | 'images'>;
  participants: ConversationParticipant[];
  messages?: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  user: Pick<User, 'id' | 'nickname' | 'avatar'>;
  joinedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: Pick<User, 'id' | 'nickname' | 'avatar'>;
  content: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  targetType: ReportTargetType;
  reporterId: string;
  reporter?: Pick<User, 'id' | 'nickname' | 'email'>;
  listingId: string | null;
  listing?: Pick<Listing, 'id' | 'title' | 'status' | 'userId'> | null;
  messageId: string | null;
  message?: Pick<Message, 'id' | 'content' | 'senderId'> | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Labels for UI display
export const CATEGORY_LABELS: Record<ListingCategory, string> = {
  FIGURINES: 'Figurines',
  DVD_BLURAY: 'DVD / Blu-ray',
  COMICS: 'Bandes dessinées',
  BOARD_GAMES: 'Jeux de société',
  FANZINES: 'Fanzines',
  POSTERS: 'Posters',
  CLOTHING: 'Vêtements',
  BOOKS: 'Livres',
  OTHER: 'Autre',
};

export const CONDITION_LABELS: Record<ItemCondition, string> = {
  MINT: 'Neuf',
  GOOD: 'Bon état',
  FAIR: 'État correct',
  POOR: 'Mauvais état',
};

export const TYPE_LABELS: Record<ListingType, string> = {
  TRADE: 'Échange',
  GIVE: 'Don',
};

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  INAPPROPRIATE: 'Contenu inapproprié',
  SPAM: 'Spam',
  SCAM: 'Arnaque',
  OFFENSIVE: 'Offensant',
  OTHER: 'Autre',
};
