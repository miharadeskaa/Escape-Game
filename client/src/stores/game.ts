import { defineStore } from 'pinia';

export interface Hotspot {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface Room {
  id: string;
  name: string;
  image: string;
  description: string;
  themeColor: string;
  hotspots: Hotspot[];
}

export interface Clue {
  id: string;
  name: string;
  description: string;
  icon: string;
  log: string;
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  alibi: string;
  avatar: string;
  dialogue: string;
}

const ALL_15_CLUES: Clue[] = [
  { id: 'clue-tea', name: 'Tasse de thé troublée', description: 'Traces suspectes d’un alcaloïde concentré au fond de la porcelaine.', icon: '☕', log: 'Une tasse contenant un fond de thé froid à l’odeur particulièrement âcre.' },
  { id: 'clue-will', name: 'Testament scellé', description: 'Document juridique officiel déshéritant plusieurs proches au profit d’œuvres.', icon: '📜', log: 'Le testament officiel de Lord Blackwood signé quelques heures avant sa mort.' },
  { id: 'clue-burn', name: 'Lettre académique brûlée', description: 'Fragments de papier calciné accusant un rival de plagiat et de faux.', icon: '✉️', log: 'Des résidus noircis mentionnant des accusations formelles de contrefaçon.' },
  { id: 'clue-linen', name: 'Mouchoir en lin taché', description: 'Tissu fin brodé portant des résidus de poudre végétale et de cendres.', icon: '🧣', log: 'Un mouchoir en lin souillé dissimulé à la hâte dans ce recoin.' },
  { id: 'clue-pot', name: 'Théière en argent', description: 'Le bec verseur dégage une légère odeur d’amande amère caractéristique.', icon: '🫖', log: 'La théière d’argent ayant servi au banquet royal de l’après-midi.' },
  { id: 'clue-book', name: 'Traité de toxicologie', description: 'Ouvrage ancien ouvert aux pages décrivant les poisons foudroyants.', icon: '📖', log: 'Un manuel savant de botanique vénéneuse annoté de marques récentes.' },
  { id: 'clue-cufflink', name: 'Bouton de manchette scarabée', description: 'Bijou en or gravé d’un scarabée égyptien égaré lors d’une altercation.', icon: '🪲', log: 'Un luxueux bouton de manchette retrouvé coincé dans les interstices.' },
  { id: 'clue-chalk', name: 'Bâton de craie effrité', description: 'Craie blanche utilisée par les traducteurs pour frotter les inscriptions.', icon: '🖍️', log: 'De la craie d’archéologue émiettée sur le sol.' },
  { id: 'clue-digitalis', name: 'Tiges de digitale coupées', description: 'Plante hautement toxique prélevée fraîchement dans les massifs.', icon: '🌿', log: 'Des tiges fraîchement cisaillées dégageant une sève irritante.' },
  { id: 'clue-gloves', name: 'Gants de cuir tachés', description: 'Gants de protection épais imprégnés d’extraits liquides concentrés.', icon: '🧤', log: 'Une paire de gants de cuir portant des macules sombres et odorantes.' },
  { id: 'clue-pipe', name: 'Pipe en bruyère tiède', description: 'Fourneau de pipe contenant du tabac oriental réservé aux convives de marque.', icon: '🪵', log: 'Une pipe abandonnée dégageant encore un faible fumet de tabac turc.' },
  { id: 'clue-curare', name: 'Fiole de curare purifié', description: 'Flacon de verre ambré contenant une dose léthale de poison paralysant.', icon: '🧪', log: 'Une fiole médicale d’époque contenant un extrait foudroyant !' },
  { id: 'clue-hair', name: 'Mèche de cheveux blonds', description: 'Fibres capillaires arrachées attestant d’un passage clandestin.', icon: '💇', log: 'Quelques mèches blondes restées accrochées dans ce secteur.' },
  { id: 'clue-broken', name: 'Verre de laboratoire brisé', description: 'Éclats d’éprouvette détruite pour faire disparaître un résidu toxique.', icon: '🍶', log: 'Des débris de verre fin marqués de gouttes grasses non identifiées.' },
  { id: 'clue-crate', name: 'Statuette d’Anubis cachée', description: 'Relique inestimable dérobée de sa vitrine officielle d’exposition.', icon: '🏺', log: 'Une précieuse antiquité nubienne enveloppée dans un chiffon de fortune.' }
];

export const useGameStore = defineStore('game', {
  state: () => ({
    caseInfo: {
      title: 'Le Meurtre du Manoir Blackwood',
      synopsis: 'Lord Blackwood a été empoisonné pendant un banquet archéologique. Dix invités et employés étaient présents dans l’enceinte du domaine.'
    },
    rooms: [
    {
      id: 'room-office',
      name: 'Bureau du Lord',
      image: '/rooms/office.jpg',
      description: 'Lieu du crime. Papiers d’affaires et pièces de collection.',
      hotspots: [
        { id: 'spot-1', name: 'Sous-main du bureau', x: 34, y: 64 }, // Plein milieu du grand bureau
        { id: 'spot-2', name: 'Tableau au-dessus du foyer', x: 76, y: 24 }, // Sur le cadre doré
        { id: 'spot-3', name: 'Âtre de la cheminée', x: 76, y: 69 } // Dans le foyer de pierre
      ]
    },
    {
      id: 'room-pantry',
      name: 'Office & Réserves',
      image: '/rooms/pantry.jpg',
      description: 'Argenterie, lingeries et services du banquet.',
      hotspots: [
        { id: 'spot-4', name: 'Armoire à linge entrouverte', x: 54, y: 46 }, // Dans la penderie ouverte
        { id: 'spot-5', name: 'Plateau d’argent et théière', x: 84, y: 81 } // Sur la table au 1er plan
      ]
    },
    {
      id: 'room-library',
      name: 'Bibliothèque',
      image: '/rooms/library.jpg',
      description: 'Volumes anciens de toxicologie et d’archéologie nubienne.',
      hotspots: [
        { id: 'spot-6', name: 'Rayonnage supérieur', x: 27, y: 24 }, // En haut à gauche
        { id: 'spot-7', name: 'Fauteuil en cuir capitonné', x: 83, y: 64 }, // Sur le fauteuil
        { id: 'spot-8', name: 'Échelle d’archiviste', x: 44, y: 48 } // Sur l'échelle
      ]
    },
    {
      id: 'room-botany',
      name: 'Serre Botanique',
      image: '/rooms/botany.jpg',
      description: 'Végétaux exotiques et outillages d’horticulture.',
      hotspots: [
        { id: 'spot-9', name: 'Massif de digitales pourpres', x: 88, y: 56 }, // Sur les fleurs violettes
        { id: 'spot-10', name: 'Table de rempotage et sécateur', x: 68, y: 83 } // Sur la table en fer forgé
      ]
    },
    {
      id: 'room-smoking',
      name: 'Fumoir Privé',
      image: '/rooms/smoking.jpg',
      description: 'Sièges en cuir, cendriers orientaux et reliques de voyage.',
      hotspots: [
        { id: 'spot-11', name: 'Coussins du divan', x: 39, y: 55 }, // Sur le canapé
        { id: 'spot-12', name: 'Table basse et cendrier', x: 61, y: 69 }, // Sur la table basse
        { id: 'spot-13', name: 'Tenture en velours', x: 19, y: 36 } // Sur le rideau
      ]
    },
    {
      id: 'room-cellar',
      name: 'Cave à Vin & Crypte',
      image: '/rooms/cellar.jpg',
      description: 'Fûts de garde et sous-sols médiévaux humides.',
      hotspots: [
        { id: 'spot-14', name: 'Fûts de vieillissement', x: 22, y: 57 }, // Sur les tonneaux à gauche
        { id: 'spot-15', name: 'Caisses d’expédition en paille', x: 74, y: 77 } // Sur les caisses en bois
      ]
    }
  ] as Room[],
    suspects: [
      { id: 'suspect-1', name: 'Victor Vance', role: 'Le Majordome', alibi: '« J’étais au sous-sol à inventorier l’argenterie de 16h à 18h. »', avatar: '🍷', dialogue: 'Lord Blackwood était intraitable, mais c’était mon bienfaiteur depuis trente ans.' },
      { id: 'suspect-2', name: 'Éléonore Blackwood', role: 'L’Héritière', alibi: '« Je consultais les archives familiales dans la bibliothèque. »', avatar: '💍', dialogue: 'Mon père voulait léguer sa collection au musée plutôt qu’à ses propres enfants.' },
      { id: 'suspect-3', name: 'Dr. Arthur Sterling', role: 'Le Médecin', alibi: '« Je préparais une infusion calmante dans la serre botanique. »', avatar: '🩺', dialogue: 'Son cœur était fatigué, mais je n’aurais jamais prescrit une dose léthale.' },
      { id: 'suspect-4', name: 'Madeleine Croft', role: 'La Gouvernante', alibi: '« Aux cuisines avec le personnel de service toute l’après-midi. »', avatar: '🗝️', dialogue: 'J’ai vu des ombres suspectes rôder près du fumoir quelques minutes avant le dîner.' },
      { id: 'suspect-5', name: 'Prof. Alistair Finch', role: 'L’Archéologue rival', alibi: '« J’admirais les sarcophages du hall d’entrée sans bouger d’un pouce. »', avatar: '📜', dialogue: 'Lord Blackwood m’avait volé la paternité des découvertes du tombeau royal d’Abydos !' },
      { id: 'suspect-6', name: 'Clara Delacroix', role: 'L’Antiquaire parisienne', alibi: '« J’examinais le mobilier de la crypte avec ma loupe d’expertise. »', avatar: '💎', dialogue: 'Je suis venue négocier des statuettes royales, pas assister à une tragédie.' },
      { id: 'suspect-7', name: 'Capitaine Thomas Reed', role: 'Le Mercenaire', alibi: '« Je nettoyais mes fusils de chasse à la sellerie du domaine. »', avatar: '🎖️', dialogue: 'Lord Blackwood me devait ma part sur l’escorte de son expédition en Haute-Égypte.' },
      { id: 'suspect-8', name: 'Evelyn Carter', role: 'La Traductrice', alibi: '« Retranscrivant des papyrus hiératiques dans le fumoir. »', avatar: '🖋️', dialogue: 'Lord Blackwood s’était disputé violemment avant le thé au sujet de la traduction.' },
      { id: 'suspect-9', name: 'Barnabé Finch', role: 'Le Jardinier', alibi: '« Je taillais les rosiers sous la pluie près de la serre. »', avatar: '🌿', dialogue: 'On m’a volé des outils hier matin, quelqu’un a forcé la remise.' },
      { id: 'suspect-10', name: 'Sébastien Vane', role: 'Le Notaire', alibi: '« Je rédigeais un codicille dans le bureau annexe du rez-de-chaussée. »', avatar: '⚖️', dialogue: 'Lord Blackwood devait signer le désaveu total de ses associés ce soir même.' }
    ] as Suspect[],
    activeRoomId: 'room-office' as string,
    discoveredClues: [] as Clue[],
    searchedSpots: new Set<string>(),
    inspectionLog: 'Explorez méthodiquement les 6 salles pour déterrer les 15 indices de l’affaire.' as string,
    selectedSuspectId: null as string | null,
    selectedClueId: null as string | null,
    verdict: null as { solved: boolean; message: string } | null,
    savedSlots: [] as any[],
    culpritId: '' as string,
    murderWeaponId: '' as string,
    spotClueMapping: {} as Record<string, Clue>,
  }),

  getters: {
    activeRoom: (state) => state.rooms.find(r => r.id === state.activeRoomId) || state.rooms[0],
    selectedSuspect: (state) => state.suspects.find(s => s.id === state.selectedSuspectId) || null,
    selectedClue: (state) => state.discoveredClues.find(c => c.id === state.selectedClueId) || null
  },

  actions: {
    generateRandomMystery() {
      const randomSuspectIndex = Math.floor(Math.random() * this.suspects.length);
      this.culpritId = this.suspects[randomSuspectIndex].id;

      const shuffledClues = [...ALL_15_CLUES].sort(() => Math.random() - 0.5);
      const allSpotIds: string[] = [];
      this.rooms.forEach(r => r.hotspots.forEach(h => allSpotIds.push(h.id)));

      this.spotClueMapping = {};
      allSpotIds.forEach((spotId, idx) => {
        this.spotClueMapping[spotId] = shuffledClues[idx];
      });

      const lethalClues = ['clue-curare', 'clue-tea', 'clue-digitalis', 'clue-pot', 'clue-broken', 'clue-gloves', 'clue-cufflink'];
      this.murderWeaponId = lethalClues[Math.floor(Math.random() * lethalClues.length)];
    },

    init() {
      this.refreshSaveSlots();
      if (!this.culpritId) {
        this.generateRandomMystery();
      }
    },

    inspectSpot(spot: Hotspot) {
      this.searchedSpots.add(spot.id);
      const clueFound = this.spotClueMapping[spot.id];
      if (clueFound) {
        this.inspectionLog = clueFound.log;
        if (!this.discoveredClues.some(c => c.id === clueFound.id)) {
          this.discoveredClues.push(clueFound);
          this.selectedClueId = clueFound.id;
        }
      } else {
        this.inspectionLog = 'Rien d’autre à relever dans ce recoin.';
      }
    },

    submitAccusation() {
      if (!this.selectedSuspectId || !this.selectedClueId) return;
      const isRightCulprit = this.selectedSuspectId === this.culpritId;
      const isRightWeapon = this.selectedClueId === this.murderWeaponId;
      const suspectObj = this.suspects.find(s => s.id === this.selectedSuspectId);
      const weaponObj = this.discoveredClues.find(c => c.id === this.murderWeaponId);

      if (isRightCulprit && isRightWeapon) {
        this.verdict = {
          solved: true,
          message: `Brillante déduction ! Confronté(e) à ${weaponObj ? weaponObj.name : 'l\'arme du crime'}, ${suspectObj?.name} s'effondre et avoue l'intégralité du meurtre !`
        };
      } else if (isRightCulprit && !isRightWeapon) {
        this.verdict = {
          solved: false,
          message: `Votre intuition est exacte concernant ${suspectObj?.name}, mais l'indice présenté n'est pas suffisant pour briser son alibi !`
        };
      } else {
        this.verdict = {
          solved: false,
          message: `Fausse route ! Les éléments du dossier prouvent que ${suspectObj?.name} est innocent(e).`
        };
      }
    },

    resetVerdict() {
      this.verdict = null;
    },

    refreshSaveSlots() {
      const raw = localStorage.getItem('detective_save_slots');
      this.savedSlots = raw ? JSON.parse(raw) : [];
    },

    saveGame() {
      this.refreshSaveSlots();
      const now = new Date();
      const newSlot = {
        id: `save_${Date.now()}`,
        date: `${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        title: this.caseInfo.title,
        cluesCount: this.discoveredClues.length,
        data: {
          activeRoomId: this.activeRoomId,
          discoveredClues: this.discoveredClues,
          searchedSpots: Array.from(this.searchedSpots),
          inspectionLog: this.inspectionLog,
          selectedSuspectId: this.selectedSuspectId,
          selectedClueId: this.selectedClueId,
          culpritId: this.culpritId,
          murderWeaponId: this.murderWeaponId,
          spotClueMapping: this.spotClueMapping
        }
      };
      this.savedSlots.unshift(newSlot);
      localStorage.setItem('detective_save_slots', JSON.stringify(this.savedSlots));
      this.inspectionLog = 'Parchemin consigné dans les archives royales.';
    },

    loadSlot(slotId: string): boolean {
      this.refreshSaveSlots();
      const slot = this.savedSlots.find((s: any) => s.id === slotId);
      if (!slot) return false;
      const d = slot.data;
      this.activeRoomId = d.activeRoomId;
      this.discoveredClues = d.discoveredClues;
      this.searchedSpots = new Set(d.searchedSpots);
      this.inspectionLog = d.inspectionLog;
      this.selectedSuspectId = d.selectedSuspectId;
      this.selectedClueId = d.selectedClueId;
      this.culpritId = d.culpritId;
      this.murderWeaponId = d.murderWeaponId;
      this.spotClueMapping = d.spotClueMapping || {};
      this.verdict = null;
      return true;
    },

    deleteSlot(slotId: string) {
      this.refreshSaveSlots();
      this.savedSlots = this.savedSlots.filter((s: any) => s.id !== slotId);
      localStorage.setItem('detective_save_slots', JSON.stringify(this.savedSlots));
    },

    startNewGame() {
      this.discoveredClues = [];
      this.searchedSpots.clear();
      this.selectedSuspectId = null;
      this.selectedClueId = null;
      this.verdict = null;
      this.inspectionLog = 'Un nouveau papyrus se déploie. Fouillez les 6 salles.';
      this.generateRandomMystery();
    }
  }
});