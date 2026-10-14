import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsClosing(true);
    // Esperamos 500ms para que se complete la animación CSS antes de cambiar de ruta
    setTimeout(() => {
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 min-h-screen">
      <section
        className={`bg-sl-surface border border-sl-cyan/30 shadow-glow-cyan p-8 max-w-md w-full relative overflow-hidden transition-all duration-500 ease-in-out origin-center ${
          isClosing ? "scale-y-0 scale-x-50 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Esquinas decorativas */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-sl-cyan"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-sl-cyan"></div>

        <header className="mb-8 border-b border-sl-purple/30 pb-4 text-center">
          <h1 className="text-2xl flex items-center justify-center text-sl-cyan uppercase tracking-widest font-black drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] mb-4">
            <div className="w-3 h-3 bg-sl-cyan rounded-full animate-pulse mr-3 shadow-glow-cyan"></div>
            Aviso del Sistema
          </h1>
          <p className="text-sm text-sl-cyan/80">
            Si no tienes cuenta, contacta con el administrador del gremio. Hasta
            que se implemente la función de registro.
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest text-sl-purple mb-2 font-bold">
              Cazador :
            </label>
            <input
              type="text"
              placeholder="Tu nombre"
              className="bg-black/50 border border-sl-cyan/40 text-sl-cyan p-3 outline-none focus:border-sl-cyan focus:shadow-glow-cyan transition-all placeholder:text-sl-cyan/20"
              defaultValue="Cazador"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest text-sl-purple mb-2 font-bold">
              Contraseña :
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="bg-black/50 border border-sl-cyan/40 text-sl-cyan p-3 outline-none focus:border-sl-cyan focus:shadow-glow-cyan transition-all placeholder:text-sl-cyan/20 font-sans"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-p5-blood border-2 border-p5-blood text-white font-black text-lg py-3 -skew-x-6 hover:bg-transparent hover:text-p5-blood transition-colors group relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
            <span className="skew-x-6 block relative z-10 tracking-widest">
              ENTRAR AL PORTAL
            </span>
          </button>
        </form>
      </section>
    </div>
  );
}
