import { defineStore } from 'pinia';

export interface Clue {
  id: string;
  name: string;
  description: string;
  icon: string;
  log: string;
  isWeapon?: boolean;
}

export interface Hotspot {
  id: string;
  name: string;
  x: number;
  y: number;
  clue?: Clue;
}

export interface Room {
  id: string;
  name: string;
  image: string;
  description: string;
  themeColor?: string;
  hotspots: Hotspot[];
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  alibi: string;
  avatar: string;
  dialogue: string;
}

export interface SaveSlot {
  id: string;
  date: string;
  title: string;
  cluesCount: number;
  data: {
    activeRoomId: string;
    discoveredClues: Clue[];
    searchedSpots: string[];
    inspectionLog: string;
    selectedSuspectId: string | null;
    selectedClueId: string | null;
    culpritId: string;
    murderWeaponId: string;
    spotClueMapping: Record<string, Clue>;
  };
}

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
          {
            id: 'spot-1',
            name: 'Sous-main du bureau',
            x: 34,
            y: 64,
            clue: { id: 'clue-desk', name: 'Sous-main et correspondances', description: 'Une lettre d’accusation inachevée dénonçant un vol de reliques royales.', icon: '✉️', log: 'Sur le sous-main en cuir, Lord Blackwood dénonçait un complot avant de mourir.' }
          },
          {
            id: 'spot-2',
            name: 'Tableau au-dessus du foyer',
            x: 84,
            y: 24,
            clue: { id: 'clue-safe', name: 'Coffre derrière le tableau', description: 'Le compartiment secret a été vidé de son testament le plus récent.', icon: '🖼️', log: 'Derrière la peinture du foyer, le compartiment a été ouvert sans trace d’effraction.' }
          },
          {
            id: 'spot-3',
            name: 'Âtre de la cheminée',
            x: 88,
            y: 69,
            clue: { id: 'clue-ashes', name: 'Cendres et résidus calcinés', description: 'Fragments d’un document d’héritage partiellement détruit par les flammes.', icon: '📜', log: 'Au fond de l’âtre éteint, des fragments de papier juridique portent le sceau du notaire.' }
          },
          {
            id: 'spot-16',
            name: 'Horloge à balancier',
            x: 82,
            y: 42,
            clue: { id: 'clue-clock', name: 'Horloge à balancier déréglée', description: 'Le mécanisme interne a été forcé pour dissimuler l’heure réelle du crime.', icon: '🕰️', log: 'Les aiguilles ont été déplacées manuellement pour fausser l’emploi du temps.' }
          }
        ]
      },
      {
        id: 'room-pantry',
        name: 'Office & Réserves',
        image: '/rooms/pantry.jpg',
        description: 'Argenterie, lingeries et services du banquet.',
        hotspots: [
          {
            id: 'spot-4',
            name: 'Armoire à linge entrouverte',
            x: 54,
            y: 46,
            clue: { id: 'clue-linen', name: 'Armoire et mouchoir taché', description: 'Un linge de service imprégné de traces jaunâtres et d’une odeur végétale suspecte.', icon: '🧣', log: 'Dans l’armoire à linge, un mouchoir a été dissimulé à la hâte parmi les draps.' }
          },
          {
            id: 'spot-5',
            name: 'Plateau d’argent et théière',
            x: 84,
            y: 81,
            clue: { id: 'clue-pot', name: 'Théière en argent du banquet', description: 'Le fond de la verseuse dégage une forte odeur d’amande amère.', icon: '🫖', log: 'La théière du banquet présente un résidu visqueux toxique autour du bec verseur !', isWeapon: true }
          },
          {
            id: 'spot-17',
            name: 'Étagère des épices & poudres',
            x: 28,
            y: 38,
            clue: { id: 'clue-spices', name: 'Bocal d’amandes pillé', description: 'Un flacon d’ingrédients culinaires dont le couvercle a été forcé.', icon: '🧂', log: 'Un bocal de graines d’amandes amères a été vidé de moitié pour en extraire l’acide.' }
          }
        ]
      },
      {
        id: 'room-library',
        name: 'Bibliothèque',
        image: '/rooms/library.jpg',
        description: 'Volumes anciens de toxicologie et d’archéologie nubienne.',
        hotspots: [
          {
            id: 'spot-6',
            name: 'Rayonnage supérieur',
            x: 27,
            y: 24,
            clue: { id: 'clue-book', name: 'Traité de toxicologie nubienne', description: 'Un ouvrage ancien ouvert à la section des poisons paralysants.', icon: '📖', log: 'Sur le rayonnage, ce manuel médical a été manipulé récemment avec des mains poussiéreuses.' }
          },
          {
            id: 'spot-7',
            name: 'Fauteuil en cuir capitonné',
            x: 83,
            y: 64,
            clue: { id: 'clue-cufflink', name: 'Bouton de manchette scarabée', description: 'Un bijou luxueux en lapis-lazuli et or égaré entre deux coussins.', icon: '🪲', log: 'Glissé entre les plis du cuir du fauteuil, ce bijou rare appartient à l’un des invités.' }
          },
          {
            id: 'spot-8',
            name: 'Échelle d’archiviste',
            x: 44,
            y: 48,
            clue: { id: 'clue-chalk', name: 'Marques de craie sur l’échelle', description: 'De la craie blanche fine employée par les traducteurs pour frotter les stèles.', icon: '🖍️', log: 'Des empreintes de craie fraîche sont visibles sur les barreaux de l’échelle.' }
          },
          {
            id: 'spot-18',
            name: 'Secrétaire en acajou',
            x: 62,
            y: 78,
            clue: { id: 'clue-drawer', name: 'Tiroir secret déverrouillé', description: 'Un compartiment dissimulé contenant une reconnaissance de dette signée.', icon: '📂', log: 'Au fond du tiroir, un contrat d’emprunt prouve un mobile financier majeur.' }
          }
        ]
      },
      {
        id: 'room-botany',
        name: 'Serre Botanique',
        image: '/rooms/botany.jpg',
        description: 'Végétaux exotiques et outillages d’horticulture.',
        hotspots: [
          {
            id: 'spot-9',
            name: 'Massif de digitales pourpres',
            x: 88,
            y: 56,
            clue: { id: 'clue-digitalis', name: 'Pieds de digitale fraîchement coupés', description: 'Des tiges dont les fleurs vénéneuses ont été cueillies aujourd’hui.', icon: '🌿', log: 'Les tiges nettes indiquent qu’une dose concentrée de toxine végétale a été extraite ici.', isWeapon: true }
          },
          {
            id: 'spot-10',
            name: 'Table de rempotage et sécateur',
            x: 68,
            y: 83,
            clue: { id: 'clue-secateur', name: 'Sécateur et gants maculés', description: 'Outil de taille portant des sécrétions de sève laiteuse irritante.', icon: '🧤', log: 'Sur la table de rempotage, le sécateur est encore humide de sève toxique fraîche.', isWeapon: true }
          },
          {
            id: 'spot-19',
            name: 'Bassin d’arrosage en cuivre',
            x: 32,
            y: 72,
            clue: { id: 'clue-water', name: 'Résidus huileux dans l’eau', description: 'Une pellicule trouble flottant à la surface de la cuve d’arrosage.', icon: '💧', log: 'Quelqu’un a rincé un récipient souillé de poison dans l’eau du bassin.' }
          }
        ]
      },
      {
        id: 'room-smoking',
        name: 'Fumoir Privé',
        image: '/rooms/smoking.jpg',
        description: 'Sièges en cuir, cendriers orientaux et reliques de voyage.',
        hotspots: [
          {
            id: 'spot-11',
            name: 'Coussins du divan',
            x: 39,
            y: 55,
            clue: { id: 'clue-hair', name: 'Mèche de cheveux coincée', description: 'Quelques cheveux blonds arrachés lors d’une vive altercation sur le divan.', icon: '💇', log: 'Sur le dossier capitonné du sofa, vous décelez des fibres laissées lors d’une lutte.' }
          },
          {
            id: 'spot-12',
            name: 'Table basse et cendrier',
            x: 61,
            y: 69,
            clue: { id: 'clue-pipe', name: 'Cendrier et pipe encore tiède', description: 'Fourneau contenant du tabac oriental mélangé à une substance somnifère.', icon: '🪵', log: 'Sur la table basse, la pipe dégage une odeur anormale de pavot et d’épices.' }
          },
          {
            id: 'spot-13',
            name: 'Tenture en velours',
            x: 19,
            y: 36,
            clue: { id: 'clue-curtain', name: 'Tenture en velours froissée', description: 'L’épaisse draperie porte la trace d’une personne restée cachée pour écouter.', icon: '🗝️', log: 'Derrière le rideau lourd, le parquet porte des traces de pas tournées vers le bureau.' }
          }
        ]
      },
      {
        id: 'room-cellar',
        name: 'Cave à Vin & Crypte',
        image: '/rooms/cellar.jpg',
        description: 'Fûts de garde et sous-sols médiévaux humides.',
        hotspots: [
          {
            id: 'spot-14',
            name: 'Fûts de vieillissement',
            x: 22,
            y: 57,
            clue: { id: 'clue-curare', name: 'Fiole de curare dissimulée', description: 'Flacon médical scellé contenant un extrait concentré de poison foudroyant.', icon: '🧪', log: 'Cachée derrière un tonneau de garde, une fiole médicale de curare presque vide !', isWeapon: true }
          },
          {
            id: 'spot-15',
            name: 'Caisses d’expédition en paille',
            x: 74,
            y: 77,
            clue: { id: 'clue-crate', name: 'Statuette d’Anubis cachée', description: 'L’antiquité officielle du Lord enfouie sous de la paille d’emballage.', icon: '🏺', log: 'Dans les caisses d’expédition, la statuette dorée attendait son exportateur clandestin.' }
          },
          {
            id: 'spot-20',
            name: 'Grille d’aération basse',
            x: 50,
            y: 88,
            clue: { id: 'clue-vent', name: 'Seringue en verre abandonnée', description: 'Une seringue d’injection fine jetée dans le conduit d’aération.', icon: '💉', log: 'Au fond de la grille, une seringue avec une aiguille biseautée encore intacte !', isWeapon: true }
          }
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

    activeRoomId: 'room-office',
    discoveredClues: [] as Clue[],
    searchedSpots: [] as string[], // Utilise un array string[] pour une réactivité optimale
    inspectionLog: 'Explorez méthodiquement les 6 salles pour déterrer les 20 indices de l’affaire.',
    selectedSuspectId: null as string | null,
    selectedClueId: null as string | null,
    verdict: null as { solved: boolean; message: string } | null,
    savedSlots: [] as SaveSlot[],
    culpritId: '',
    murderWeaponId: '',
    spotClueMapping: {} as Record<string, Clue>,
  }),

  getters: {
    activeRoom: (state) => state.rooms.find(r => r.id === state.activeRoomId) || state.rooms[0],
    selectedSuspect: (state) => state.suspects.find(s => s.id === state.selectedSuspectId) || null,
    selectedClue: (state) => state.discoveredClues.find(c => c.id === state.selectedClueId) || null,
    murderWeapon: (state): Clue | null => {
      // Retrouve l'arme du crime même si non découverte
      for (const clue of Object.values(state.spotClueMapping)) {
        if (clue.id === state.murderWeaponId) return clue;
      }
      return null;
    }
  },

  actions: {
    generateRandomMystery() {
      const randomSuspectIndex = Math.floor(Math.random() * this.suspects.length);
      this.culpritId = this.suspects[randomSuspectIndex].id;

      this.spotClueMapping = {};
      const weaponIds: string[] = [];

      this.rooms.forEach(room => {
        room.hotspots.forEach(hotspot => {
          if (hotspot.clue) {
            this.spotClueMapping[hotspot.id] = hotspot.clue;
            if (hotspot.clue.isWeapon) {
              weaponIds.push(hotspot.clue.id);
            }
          }
        });
      });

      this.murderWeaponId = weaponIds[Math.floor(Math.random() * weaponIds.length)] || '';
    },

    init() {
      this.refreshSaveSlots();
      if (!this.culpritId || Object.keys(this.spotClueMapping).length === 0) {
        this.generateRandomMystery();
      }
    },

    inspectSpot(spot: Hotspot) {
      if (!this.searchedSpots.includes(spot.id)) {
        this.searchedSpots.push(spot.id);
      }

      const clueFound = this.spotClueMapping[spot.id] || spot.clue;

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
      const suspectObj = this.selectedSuspect;
      const weaponObj = this.murderWeapon;

      if (isRightCulprit && isRightWeapon) {
        this.verdict = {
          solved: true,
          message: `Brillante déduction ! Confronté(e) à ${weaponObj ? weaponObj.name : 'l\'arme du crime'}, ${suspectObj?.name} s'effondre et avoue l'intégralité du meurtre !`
        };
      } else if (isRightCulprit && !isRightWeapon) {
        this.verdict = {
          solved: false,
          message: `Votre intuition est exacte concernant ${suspectObj?.name}, mais l'élément présenté ne constitue pas l'arme létale !`
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
      if (typeof window === 'undefined') return;
      try {
        const raw = localStorage.getItem('detective_save_slots');
        this.savedSlots = raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error('Erreur de lecture du localStorage', e);
        this.savedSlots = [];
      }
    },

    saveGame() {
      if (typeof window === 'undefined') return;
      this.refreshSaveSlots();
      const now = new Date();
      const newSlot: SaveSlot = {
        id: `save_${Date.now()}`,
        date: `${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        title: this.caseInfo.title,
        cluesCount: this.discoveredClues.length,
        data: {
          activeRoomId: this.activeRoomId,
          discoveredClues: [...this.discoveredClues],
          searchedSpots: [...this.searchedSpots],
          inspectionLog: this.inspectionLog,
          selectedSuspectId: this.selectedSuspectId,
          selectedClueId: this.selectedClueId,
          culpritId: this.culpritId,
          murderWeaponId: this.murderWeaponId,
          spotClueMapping: { ...this.spotClueMapping }
        }
      };

      this.savedSlots.unshift(newSlot);
      localStorage.setItem('detective_save_slots', JSON.stringify(this.savedSlots));
      this.inspectionLog = 'Parchemin consigné dans les archives royales.';
    },

    loadSlot(slotId: string): boolean {
      this.refreshSaveSlots();
      const slot = this.savedSlots.find(s => s.id === slotId);
      if (!slot) return false;

      const d = slot.data;
      this.activeRoomId = d.activeRoomId;
      this.discoveredClues = [...d.discoveredClues];
      this.searchedSpots = [...d.searchedSpots];
      this.inspectionLog = d.inspectionLog;
      this.selectedSuspectId = d.selectedSuspectId;
      this.selectedClueId = d.selectedClueId;
      this.culpritId = d.culpritId;
      this.murderWeaponId = d.murderWeaponId;
      this.spotClueMapping = { ...d.spotClueMapping };
      this.verdict = null;
      return true;
    },

    deleteSlot(slotId: string) {
      if (typeof window === 'undefined') return;
      this.refreshSaveSlots();
      this.savedSlots = this.savedSlots.filter(s => s.id !== slotId);
      localStorage.setItem('detective_save_slots', JSON.stringify(this.savedSlots));
    },

    startNewGame() {
      this.discoveredClues = [];
      this.searchedSpots = [];
      this.selectedSuspectId = null;
      this.selectedClueId = null;
      this.verdict = null;
      this.inspectionLog = 'Un nouveau papyrus se déploie. Fouillez les 6 salles.';
      this.generateRandomMystery();
    }
  }
});