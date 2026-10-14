import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { CollectionItem, HunterProfile } from "../models/types";

// Claves para el almacenamiento local (IndexedDB / LocalStorage optimizado)
const LOCAL_STORAGE_KEY_COLLECTION = "hunter_system_collection_cache";
const LOCAL_STORAGE_KEY_PROFILE = "hunter_system_profile_cache";

// --- OPERACIONES DE COLECCIÓN (HÍBRIDAS: LOCAL-FIRST) ---
export const getCollection = async (): Promise<CollectionItem[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    // 1. VELOCIDAD MÁXIMA: Devolvemos primero los datos locales si existen (0ms de retardo)
    const cachedData = localStorage.getItem(
      `${LOCAL_STORAGE_KEY_COLLECTION}_${user.uid}`,
    );
    let localItems: CollectionItem[] = cachedData ? JSON.parse(cachedData) : [];

    // 2. SINCRONIZACIÓN EN SEGUNDO PLANO: Consultamos Firestore para actualizar la caché
    const q = query(
      collection(db, "collection"),
      where("userId", "==", user.uid),
    );
    const querySnapshot = await getDocs(q);

    const remoteItems: CollectionItem[] = [];
    querySnapshot.forEach((docSnap) => {
      remoteItems.push(docSnap.data() as CollectionItem);
    });

    // Actualizamos la caché local con lo que hay en la nube
    localStorage.setItem(
      `${LOCAL_STORAGE_KEY_COLLECTION}_${user.uid}`,
      JSON.stringify(remoteItems),
    );

    // Devolvemos los datos remotos frescos (o locales si fallara la red)
    return remoteItems.length > 0 ? remoteItems : localItems;
  } catch (error) {
    console.warn(
      "Modo offline o error al sincronizar con Firestore. Usando caché local:",
      error,
    );
    const user = auth.currentUser;
    const cachedData = user
      ? localStorage.getItem(`${LOCAL_STORAGE_KEY_COLLECTION}_${user.uid}`)
      : null;
    return cachedData ? JSON.parse(cachedData) : [];
  }
};

export const saveItem = async (item: CollectionItem): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Debes iniciar sesión para guardar elementos.");

  try {
    const itemWithUser = { ...item, userId: user.uid };

    // 1. Guardado inmediato en la caché local para que la UI responda al instante
    const cachedData = localStorage.getItem(
      `${LOCAL_STORAGE_KEY_COLLECTION}_${user.uid}`,
    );
    let items: CollectionItem[] = cachedData ? JSON.parse(cachedData) : [];

    const index = items.findIndex((i) => i.id === item.id);
    if (index >= 0) {
      items[index] = itemWithUser;
    } else {
      items.push(itemWithUser);
    }
    localStorage.setItem(
      `${LOCAL_STORAGE_KEY_COLLECTION}_${user.uid}`,
      JSON.stringify(items),
    );

    // 2. Guardado en Firestore en segundo plano
    await setDoc(doc(db, "collection", item.id), itemWithUser);
  } catch (error) {
    console.error("Error al guardar el elemento:", error);
    throw error;
  }
};

export const deleteItem = async (id: string): Promise<void> => {
  const user = auth.currentUser;

  try {
    // 1. Borrado inmediato en caché local
    if (user) {
      const cachedData = localStorage.getItem(
        `${LOCAL_STORAGE_KEY_COLLECTION}_${user.uid}`,
      );
      if (cachedData) {
        let items: CollectionItem[] = JSON.parse(cachedData);
        items = items.filter((i) => i.id !== id);
        localStorage.setItem(
          `${LOCAL_STORAGE_KEY_COLLECTION}_${user.uid}`,
          JSON.stringify(items),
        );
      }
    }

    // 2. Borrado en Firestore
    await deleteDoc(doc(db, "collection", id));
  } catch (error) {
    console.error("Error al eliminar el elemento:", error);
    throw error;
  }
};

// --- OPERACIONES DE PERFIL (HÍBRIDAS) ---
export const getProfile = async (): Promise<HunterProfile | undefined> => {
  const user = auth.currentUser;
  if (!user) return undefined;

  try {
    // 1. Lectura rápida local
    const cachedProfile = localStorage.getItem(
      `${LOCAL_STORAGE_KEY_PROFILE}_${user.uid}`,
    );
    let localProfile: HunterProfile | undefined = cachedProfile
      ? JSON.parse(cachedProfile)
      : undefined;

    // 2. Consulta a Firestore
    const docRef = doc(db, "profiles", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const remoteProfile = docSnap.data() as HunterProfile;
      localStorage.setItem(
        `${LOCAL_STORAGE_KEY_PROFILE}_${user.uid}`,
        JSON.stringify(remoteProfile),
      );
      return remoteProfile;
    }

    return localProfile;
  } catch (error) {
    console.warn("Error al obtener perfil online, usando local:", error);
    const cachedProfile = localStorage.getItem(
      `${LOCAL_STORAGE_KEY_PROFILE}_${user.uid}`,
    );
    return cachedProfile ? JSON.parse(cachedProfile) : undefined;
  }
};

export const saveProfile = async (profile: HunterProfile): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Debes iniciar sesión para guardar el perfil.");

  try {
    const profileWithUser = { ...profile, userId: user.uid };

    // 1. Guardado local inmediato
    localStorage.setItem(
      `${LOCAL_STORAGE_KEY_PROFILE}_${user.uid}`,
      JSON.stringify(profileWithUser),
    );

    // 2. Guardado en Firestore
    await setDoc(doc(db, "profiles", user.uid), profileWithUser);
  } catch (error) {
    console.error("Error al guardar el perfil:", error);
    throw error;
  }
};
