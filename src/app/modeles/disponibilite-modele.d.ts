type DisponibiliteModele = {
  reservable: boolean;
  dateDisponibleAPartirDe: string | null;
  nombreExemplaires: number;
  message: string;
  datesIndisponibles: string[];
};
