type Emprunt = {
  id: number;
  statut: string;
  materielId: number;
  materielNom: string;
  modeleNom: string;
  demandeurNom: string;
  demandeurPrenom: string;
  dateDemandeEmprunt: string;
  dateDebutEmprunt: string;
  dateRetourEmpruntPrevisionelle: string;
  dateRetourEmpruntReelle: string | null;
};
