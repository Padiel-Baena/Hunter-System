export type PetId =
  | "basilisco"
  | "demonio"
  | "dragon"
  | "fenix"
  | "golem"
  | "grifo"
  | "hidra"
  | "kitsune"
  | "quimera";
export type PetStage = "huevo" | "bebe" | "juvenil" | "adulto";

export interface PetInfo {
  id: PetId;
  name: string;
}

export const AVAILABLE_PETS: PetInfo[] = [
  { id: "basilisco", name: "Basilisco" },
  { id: "demonio", name: "Demonio" },
  { id: "dragon", name: "Dragón" },
  { id: "fenix", name: "Fénix" },
  { id: "golem", name: "Golem" },
  { id: "grifo", name: "Grifo" },
  { id: "hidra", name: "Hidra" },
  { id: "kitsune", name: "Kitsune" },
  { id: "quimera", name: "Quimera" },
];

export const getPetStageAndImage = (
  completedCount: number,
  petId: PetId = "fenix",
) => {
  let stage: PetStage = "huevo";
  let stageName = "Etapa I - Huevo Abisal";

  if (completedCount >= 80) {
    stage = "adulto";
    stageName = "Etapa IV - Forma Suprema (Adulto)";
  } else if (completedCount >= 15) {
    stage = "juvenil";
    stageName = "Etapa III - Ascensión (Juvenil)";
  } else if (completedCount >= 5) {
    stage = "bebe";
    stageName = "Etapa II - Despertar (Bebé)";
  }

  // Ruta basada en la estructura: /assets/pets/[id]-[stage].png
  const imagePath = `/assets/pets/${petId}-${stage}.png`;

  return { stage, stageName, imagePath };
};
