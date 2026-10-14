import { openDB, DBSchema, IDBPDatabase } from "idb";
import { CollectionItem, HunterProfile } from "../models/types";

interface GrimorioDB extends DBSchema {
  collection: {
    key: string;
    value: CollectionItem;
    indexes: {
      "by-category": string;
      "by-status": string;
    };
  };
  profile: {
    key: string;
    value: HunterProfile;
  };
  activity: {
    key: string;
    value: { id: string; type: string; date: number; description: string };
  };
}

const DB_NAME = "grimorio-system-db";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<GrimorioDB>> | null = null;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<GrimorioDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("collection")) {
          const store = db.createObjectStore("collection", { keyPath: "id" });
          store.createIndex("by-category", "category");
          store.createIndex("by-status", "status");
        }
        if (!db.objectStoreNames.contains("profile")) {
          db.createObjectStore("profile");
        }
        if (!db.objectStoreNames.contains("activity")) {
          db.createObjectStore("activity", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
};

// --- OPERACIONES DE COLECCIÓN ---
export const getCollection = async (): Promise<CollectionItem[]> => {
  const db = await initDB();
  return db.getAll("collection");
};

export const saveItem = async (item: CollectionItem): Promise<void> => {
  const db = await initDB();
  await db.put("collection", item);
};

export const deleteItem = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete("collection", id);
};

// --- OPERACIONES DE PERFIL ---
export const getProfile = async (): Promise<HunterProfile | undefined> => {
  const db = await initDB();
  return db.get("profile", "hunter-data");
};

export const saveProfile = async (profile: HunterProfile): Promise<void> => {
  const db = await initDB();
  await db.put("profile", profile, "hunter-data");
};
