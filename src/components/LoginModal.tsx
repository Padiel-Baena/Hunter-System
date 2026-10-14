import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState(""); // 👈 Campo para el apodo del cazador
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isRegistering) {
        if (!nickname.trim()) {
          setError("El apodo de cazador es obligatorio.");
          setIsLoading(false);
          return;
        }

        // 1. Creamos la cuenta en Firebase Auth (Correo y Contraseña)
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;

        // 2. Guardamos el apodo asociado a su UID en la colección "profiles" de Firestore
        await setDoc(doc(db, "profiles", user.uid), {
          userId: user.uid,
          name: nickname.trim(),
          equippedTitle: "Novato del Sistema",
          selectedMascotId: "default",
          activeCategories: ["BOOKS", "MANGA", "GAMES", "SERIES", "MOVIES"],
        });
      } else {
        // Inicio de sesión normal
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;

        // Verificamos si ya tiene perfil, si no, le creamos uno por defecto con el email
        const profileRef = doc(db, "profiles", user.uid);
        const profileSnap = await getDoc(profileRef);
        if (!profileSnap.exists()) {
          await setDoc(profileRef, {
            userId: user.uid,
            name: email.split("@")[0],
            equippedTitle: "Novato del Sistema",
            selectedMascotId: "default",
            activeCategories: ["BOOKS", "MANGA", "GAMES", "SERIES", "MOVIES"],
          });
        }
      }

      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      setError(
        isRegistering
          ? "Error al registrar la cuenta. Comprueba los datos."
          : "Credenciales incorrectas. Verifica tu acceso.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-sl-surface border-2 border-p5-blood p-8 max-w-md w-full transform -skew-x-2 shadow-[0_0_30px_rgba(230,0,18,0.3)]">
        <div className="skew-x-2">
          <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-1 text-center">
            {isRegistering ? "REGISTRO DE CAZADOR" : "ACCESO AL GRIMORIO"}
          </h2>
          <p className="text-[10px] text-p5-blood font-bold tracking-widest uppercase text-center mb-6">
            {isRegistering
              ? "Nuevo Agente del Sistema"
              : "Identificación Requerida"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">
                  Apodo de Cazador
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="ej: Joker"
                  required={isRegistering}
                  className="w-full bg-black border border-neutral-700 p-3 text-white text-sm focus:border-p5-blood focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ej: usuario@grimorio.local"
                required
                className="w-full bg-black border border-neutral-700 p-3 text-white text-sm focus:border-p5-blood focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-black border border-neutral-700 p-3 text-white text-sm focus:border-p5-blood focus:outline-none"
              />
            </div>

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
                ? "PROCESANDO..."
                : isRegistering
                  ? "SINTETIZAR NUEVA CUENTA"
                  : "ENTRAR AL SISTEMA"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError("");
                }}
                className="text-[10px] text-gray-400 hover:text-white uppercase tracking-wider underline cursor-pointer"
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
