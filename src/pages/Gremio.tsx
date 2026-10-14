import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Swords,
  Download,
  Upload,
  Database,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { getCollection, saveItem } from "../services/db";
import { CollectionItem } from "../models/types";
import Layout from "../components/Layout";

export default function Gremio() {
  const [itemsCount, setItemsCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const loadStats = async () => {
    const data = await getCollection();
    setItemsCount(data.length);
  };

  useEffect(() => {
    loadStats();
  }, []);

  // 1. EXPORTAR COLECCIÓN A JSON
  const handleExportJSON = async () => {
    try {
      const data = await getCollection();
      const exportData = {
        version: "1.0",
        system: "Hunter System P5",
        exportDate: new Date().toISOString(),
        totalItems: data.length,
        items: data,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hunters-system-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMessage("Respaldo del Sistema exportado con éxito.");
      setIsError(false);
    } catch (err) {
      setStatusMessage("Error crítico al exportar los datos del sistema.");
      setIsError(true);
    }
  };

  // 2. IMPORTAR COLECCIÓN DESDE JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed.items || !Array.isArray(parsed.items)) {
          throw new Error("Estructura de archivo inválida.");
        }

        let importedCount = 0;
        for (const item of parsed.items) {
          if (item.id && item.title && item.category) {
            await saveItem(item as CollectionItem);
            importedCount++;
          }
        }

        await loadStats();
        setStatusMessage(
          `Sincronización completada. Se han integrado ${importedCount} registros al sistema.`,
        );
        setIsError(false);
      } catch (err) {
        setStatusMessage(
          "Error de sintaxis: El archivo JSON está corrupto o no es compatible.",
        );
        setIsError(true);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 flex-grow flex flex-col max-w-5xl mx-auto w-full animate-system-open origin-center relative">
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-sl-purple/30 pb-4 gap-4">
          <div className="flex flex-col gap-4">
            <Link
              to="/dashboard"
              className="bg-sl-surface border border-neutral-700 text-gray-300 hover:text-sl-purple hover:border-sl-purple px-3 py-2 text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2 transform -skew-x-6 cursor-pointer w-fit"
            >
              <ArrowLeft size={14} className="skew-x-6" />{" "}
              <span className="skew-x-6">INICIO</span>
            </Link>

            <div>
              <p className="text-[10px] text-sl-purple font-bold tracking-widest uppercase mb-1">
                Red Global de Cazadores
              </p>
              <h2 className="text-3xl text-white font-black tracking-widest uppercase flex items-center gap-3">
                <Swords className="text-sl-purple" size={32} />
                El Gremio
              </h2>
              <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">
                Terminal de Respaldo, Sincronización e Intercambio de Archivos
              </p>
            </div>
          </div>
        </div>

        {/* Mensaje de Estado del Sistema */}
        {statusMessage && (
          <div
            className={`p-4 mb-6 border flex items-center gap-3 ${isError ? "bg-p5-blood/10 border-p5-blood text-p5-blood" : "bg-sl-cyan/10 border-sl-cyan text-sl-cyan"}`}
          >
            {isError ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
            <span className="text-xs font-bold tracking-wider uppercase">
              {statusMessage}
            </span>
          </div>
        )}

        {/* Panel de Control de Datos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tarjeta de Exportación */}
          <div className="bg-sl-surface/80 border border-sl-purple/40 p-6 relative flex flex-col justify-between group hover:border-sl-purple transition-colors">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-sl-purple"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-sl-purple"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-sl-purple font-bold tracking-widest uppercase">
                  Protocolo de Respaldo
                </span>
                <Database size={20} className="text-sl-purple" />
              </div>

              <h3 className="text-xl text-white font-black tracking-wide uppercase mb-2">
                Exportar Base de Datos
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Genera un archivo JSON estructurado con todos los registros
                actuales de tu Grimorio ({itemsCount} archivos almacenados).
              </p>
            </div>

            <button
              onClick={handleExportJSON}
              className="w-full bg-sl-purple border border-sl-purple text-white font-black text-xs py-3 -skew-x-2 hover:bg-transparent hover:text-sl-purple transition-colors group relative overflow-hidden cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
            >
              <Download size={14} className="skew-x-2" />
              <span className="skew-x-2 tracking-widest">
                DESCARGAR RESPALDO JSON
              </span>
            </button>
          </div>

          {/* Tarjeta de Importación */}
          <div className="bg-sl-surface/80 border border-sl-purple/40 p-6 relative flex flex-col justify-between group hover:border-sl-purple transition-colors">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-sl-purple"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-sl-purple"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-sl-purple font-bold tracking-widest uppercase">
                  Protocolo de Ingesta
                </span>
                <Upload size={20} className="text-sl-purple" />
              </div>
              <h3 className="text-xl text-white font-black tracking-wide uppercase mb-2">
                Importar Archivo JSON
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Sincroniza registros externos o recupera una copia de seguridad
                previa seleccionando tu archivo de respaldo.
              </p>
            </div>

            <label className="w-full bg-black border border-sl-purple text-sl-purple hover:bg-sl-purple hover:text-white font-black text-xs py-3 -skew-x-2 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(139,92,246,0.2)] text-center">
              <Upload size={14} className="skew-x-2" />
              <span className="skew-x-2 tracking-widest">
                SELECCIONAR ARCHIVO JSON
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </Layout>
  );
}
