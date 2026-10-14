import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AVAILABLE_CATEGORIES = [
  { id: "BOOKS", label: "Libros" },
  { id: "MANGA", label: "Manga" },
  { id: "GAMES", label: "Videojuegos" },
  { id: "SERIES", label: "Series" },
  { id: "MOVIES", label: "Películas" },
];

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCreature, setSelectedCreature] = useState("basilisco");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "BOOKS",
    "MANGA",
    "GAMES",
    "SERIES",
    "MOVIES",
  ]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryToggle = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      // Evitamos que desmarque todas
      if (selectedCategories.length === 1) return;
      setSelectedCategories(selectedCategories.filter((id) => id !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const internalEmail = `${nickname.trim().toLowerCase()}@grimorio.local`;

      if (isRegistering) {
        if (!nickname.trim()) {
          setError("El apodo de cazador es obligatorio.");
          setIsLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          internalEmail,
          password,
        );
        const user = userCredential.user;

        // Guardamos el perfil completo con el apodo, la criatura y las listas seleccionadas
        await setDoc(doc(db, "profiles", user.uid), {
          userId: user.uid,
          name: nickname.trim(),
          equippedTitle: "Novato del Sistema",
          selectedMascotId: selectedCreature,
          mascotStage: "huevo",
          activeCategories: selectedCategories,
        });
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          internalEmail,
          password,
        );
        const user = userCredential.user;

        const profileRef = doc(db, "profiles", user.uid);
        const profileSnap = await getDoc(profileRef);
        if (!profileSnap.exists()) {
          await setDoc(profileRef, {
            userId: user.uid,
            name: nickname.trim(),
            equippedTitle: "Novato del Sistema",
            selectedMascotId: selectedCreature,
            mascotStage: "huevo",
            activeCategories: selectedCategories,
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      setError("Credenciales incorrectas o error en el sistema.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-sl-surface border-2 border-sl-cyan p-8 max-w-md w-full relative shadow-[0_0_30px_rgba(0,229,255,0.3)] my-8">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-sl-cyan"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-sl-cyan"></div>

        <div>
          <h2 className="text-xl font-black text-white tracking-widest uppercase mb-1 text-center">
            {isRegistering ? "REGISTRO DE NUEVO CAZADOR" : "AVISO DEL SISTEMA"}
          </h2>
          <p className="text-[10px] text-sl-cyan font-bold tracking-widest uppercase text-center mb-6">
            {isRegistering
              ? "Configura tu identidad, criatura y listas iniciales"
              : "Introduce tus credenciales de acceso al portal"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">
                CAZADOR :
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Tu apodo..."
                required
                className="w-full bg-black border border-neutral-700 p-3 text-white text-sm focus:border-sl-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">
                CONTRASEÑA :
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                className="w-full bg-black border border-neutral-700 p-3 text-white text-sm focus:border-sl-cyan focus:outline-none"
              />
            </div>

            {isRegistering && (
              <>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-sl-purple mb-1">
                    SELECCIONA TU HUEVO INICIAL :
                  </label>
                  <select
                    value={selectedCreature}
                    onChange={(e) => setSelectedCreature(e.target.value)}
                    className="w-full bg-black border border-neutral-700 p-3 text-white text-sm focus:border-sl-cyan focus:outline-none"
                  >
                    <option value="basilisco">Huevo de Basilisco</option>
                    <option value="demonio">Huevo de Demonio</option>
                    <option value="dragon">Huevo de Dragón</option>
                    <option value="fenix">Huevo de Fénix</option>
                    <option value="golem">Huevo de Golem</option>
                    <option value="grifo">Huevo de Grifo</option>
                    <option value="hidra">Huevo de Hidra</option>
                    <option value="kitsune">Huevo de Kitsune</option>
                    <option value="quimera">Huevo de Quimera</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
                    LISTAS / CATEGORÍAS ACTIVAS :
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-black border border-neutral-700 p-3">
                    {AVAILABLE_CATEGORIES.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center space-x-2 cursor-pointer text-xs text-gray-300"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.id)}
                          onChange={() => handleCategoryToggle(cat.id)}
                          className="accent-sl-cyan"
                        />
                        <span>{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {error && (
              <p className="text-xs text-p5-blood font-bold tracking-wide text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-p5-blood border border-p5-blood text-white font-bold text-xs py-3 tracking-widest uppercase hover:bg-transparent hover:text-p5-blood transition-all cursor-pointer mt-4"
            >
              {isLoading
                ? "CONECTANDO..."
                : isRegistering
                  ? "REGISTRAR Y ENTRAR"
                  : "ENTRAR AL PORTAL"}
            </button>

            <div className="text-center pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError("");
                }}
                className="text-[10px] text-gray-400 hover:text-sl-cyan uppercase tracking-wider underline cursor-pointer"
              >
                {isRegistering
                  ? "¿Ya tienes cuenta? Inicia sesión"
                  : "¿No tienes cuenta? Regístrate aquí"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
