export type ItemStatus = "WISHLIST" | "PENDING" | "COMPLETED";
export type ItemCategory = "BOOKS" | "MANGA" | "GAMES" | "SERIES" | "MOVIES";

export interface BaseItem {
  id: string;
  title: string;
  status: ItemStatus;
  isFavorite: boolean;
  isSpecialEdition: boolean;
  coverImage?: string; // Base64 o URL para la previsualización de la portada
  rating?: number;
  dateCompleted?: string;
  createdAt: number;
}

export interface BookItem extends BaseItem {
  category: "BOOKS";
  author: string;
  pages?: number;
  universe?: string;
  universeOrder?: number;
  saga?: string;
  sagaOrder?: number;
  format: "Tapa blanda" | "Tapa dura" | "Ebook" | "Audiolibro";
}

export interface MangaItem extends BaseItem {
  category: "MANGA";
  volumeNumber: number;
  pages?: number;
}

export interface GameItem extends BaseItem {
  category: "GAMES";
  format: "Físico" | "Digital";
  platform: "PlayStation" | "Nintendo" | "Xbox" | "PC" | "Móvil";
}

export interface Season {
  seasonNumber: number;
  episodes?: number;
}

export interface SeriesItem extends BaseItem {
  category: "SERIES";
  seasons: Season[];
}

export interface MovieItem extends BaseItem {
  category: "MOVIES";
  saga?: string;
  sagaOrder?: number;
  durationMinutes?: number;
}

export type CollectionItem =
  | BookItem
  | MangaItem
  | GameItem
  | SeriesItem
  | MovieItem;

// Interfaz del perfil del cazador para IndexedDB
export interface HunterProfile {
  name: string;
  avatar?: string;
  equippedTitle: string;
  selectedMascotId: string;
  activeCategories: ItemCategory[];
}
