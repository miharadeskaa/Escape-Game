<template>
  <div class="h-screen w-screen overflow-hidden bg-[#ecdcc4] text-[#342417] font-serif flex flex-col p-3 gap-2.5 select-none relative">
    
    <!-- Liseré supérieur ornemental aux reflets dorés -->
    <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8b5a2b] via-[#d4af37] to-[#8b5a2b] shadow-xs"></div>

    <!-- ================= 1. BARRE DE COMMANDE SUPÉRIEURE ================= -->
    <nav class="bg-[#faebd7]/95 border border-[#bfa07a] rounded-md px-4 py-1.5 flex items-center justify-between shadow-xs shrink-0 backdrop-blur-xs">
      <div class="flex items-center gap-2.5">
        <span class="text-xl text-[#852c1e] leading-none">𓂀</span>
        <div class="flex items-center gap-2">
          <span class="font-mono text-sm font-extrabold uppercase tracking-[0.2em] text-[#852c1e]">
            Tribunal d'Osiris
          </span>
          <span class="text-stone-400 font-mono text-xs">/</span>
          
          <!-- Sélecteur de Difficulté -->
          <div class="flex items-center gap-1 bg-[#eedfcb] p-0.5 rounded border border-[#cfb594]">
            <button
              v-for="diff in (['easy', 'medium', 'hard'] as const)"
              :key="diff"
              @click="setDifficulty(diff)"
              :class="[
                'px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded transition cursor-pointer',
                game.difficulty === diff
                  ? 'bg-[#852c1e] text-[#faebd7] shadow-xs'
                  : 'text-[#734b26] hover:bg-[#faebd7]'
              ]"
            >
              {{ diff === 'easy' ? 'Facile' : diff === 'medium' ? 'Moyen' : 'Difficile' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Actions de barre -->
      <div class="flex items-center gap-2">
        <button
          @click="currentTab = currentTab === 'rules' ? 'investigation' : 'rules'"
          class="px-3.5 py-1.5 text-xs font-mono uppercase font-bold tracking-wider rounded border border-[#bfa07a] bg-[#f7ede0] hover:bg-[#ebd7bc] transition shadow-xs cursor-pointer flex items-center gap-1.5 text-[#342417]"
        >
          <span class="text-base leading-none">{{ currentTab === 'rules' ? '𓉐' : '📜' }}</span>
          <span>{{ currentTab === 'rules' ? 'Sanctuaire' : 'Règles' }}</span>
        </button>

        <div class="h-4 w-px bg-[#bfa07a]/40 mx-1"></div>

        <button
          @click="handleSave"
          class="px-3.5 py-1.5 text-xs font-mono uppercase font-bold tracking-wider rounded border border-[#bfa07a] bg-[#f7ede0] hover:bg-[#ebd7bc] transition shadow-xs cursor-pointer flex items-center gap-1.5 text-[#342417]"
        >
          <span class="text-base leading-none">💾</span>
          <span>Sauver</span>
        </button>

        <button
          @click="openLoadModal"
          class="px-3.5 py-1.5 text-xs font-mono uppercase font-bold tracking-wider rounded border border-[#bfa07a] bg-[#f7ede0] hover:bg-[#ebd7bc] transition shadow-xs cursor-pointer flex items-center gap-1.5 text-[#342417] relative"
        >
          <span class="text-base leading-none">📂</span>
          <span>Archives</span>
          <span
            v-if="game.savedSlots.length > 0"
            class="px-1.5 py-0.2 bg-[#852c1e] text-[#faebd7] text-[10px] rounded-full font-mono font-bold leading-none"
          >
            {{ game.savedSlots.length }}
          </span>
        </button>

        <button
          @click="promptNewGame"
          class="px-4 py-1.5 text-xs font-mono uppercase font-bold tracking-wider rounded border border-[#53160e] bg-gradient-to-b from-[#963424] to-[#782316] text-[#faebd7] hover:brightness-110 transition shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <span class="text-base leading-none">𓇳</span>
          <span>Nouvelle Affaire</span>
        </button>
      </div>
    </nav>

    <!-- NOTIFICATION SAUVEGARDE -->
    <div v-if="saveNotice" class="bg-[#dcead4] border border-[#2b5921] text-[#2b5921] px-4 py-1.5 text-xs font-mono rounded flex justify-between items-center shrink-0 shadow-xs">
      <div class="flex items-center gap-2">
        <span class="text-sm font-bold">✓</span>
        <span>L'état actuel des fouilles a été consigné dans les archives du scribe royal.</span>
      </div>
      <button @click="saveNotice = false" class="font-bold cursor-pointer text-sm">×</button>
    </div>

    <!-- ================= 2. BANDEAU DE TITRE CENTRÉ ================= -->
    <header class="bg-[#faebd7] border-2 border-[#bfa07a] rounded-md px-6 py-3 shadow-xs shrink-0 grid grid-cols-12 items-center gap-4 relative overflow-hidden">
      <div class="absolute right-4 -bottom-4 text-8xl opacity-5 pointer-events-none select-none font-mono">𓃭</div>

      <!-- Sceau gauche -->
      <div class="col-span-2 hidden sm:flex items-center gap-3">
        <div class="w-11 h-11 rounded-full bg-gradient-to-br from-[#852c1e] to-[#5a1a11] text-[#ffd97d] flex items-center justify-center font-bold text-xl shadow-[0_2px_8px_rgba(133,44,30,0.35)] border border-[#d4af37] shrink-0">
          ⚖️
        </div>
        <div>
          <span class="text-[10px] font-mono uppercase tracking-widest text-[#852c1e] font-extrabold block leading-none">Scellé</span>
          <span class="text-xs font-mono text-[#734b26] font-bold">#2026-X</span>
        </div>
      </div>

      <!-- Titre et sous-titre parfaitement centrés -->
      <div class="col-span-12 sm:col-span-8 flex flex-col items-center justify-center text-center space-y-1 min-w-0">
        <div class="flex items-center justify-center gap-2 font-mono text-xs font-extrabold uppercase tracking-[0.3em] text-[#852c1e]">
          <span>𓇯</span>
          <span>10 Suspects // 15 Indices Thématiques Répartis</span>
          <span>𓇯</span>
        </div>
        
        <h1 class="text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#2b1b11] truncate max-w-full drop-shadow-xs">
          {{ game.caseInfo.title }}
        </h1>
        
        <p class="text-xs sm:text-sm text-[#523d2b] italic leading-snug whitespace-normal max-w-3xl font-serif px-2">
          « {{ game.caseInfo.synopsis }} »
        </p>
      </div>

      <!-- Compteur droit -->
      <div class="col-span-2 hidden sm:flex items-center justify-end border-l border-[#bfa07a]/40 pl-4">
        <div class="text-right">
          <span class="block text-[10px] font-mono uppercase font-bold text-[#8c673d] tracking-wider">Avancement</span>
          <span class="font-mono font-extrabold text-base text-[#852c1e] tracking-tight">
            {{ game.discoveredClues.length }} / 15 indice(s)
          </span>
        </div>
      </div>
    </header>

    <!-- ================= VUE RÈGLES ================= -->
    <section v-if="currentTab === 'rules'" class="flex-1 bg-[#faebd7]/95 border-2 border-[#bfa07a] rounded-md p-6 overflow-y-auto space-y-4 shadow-md backdrop-blur-xs">
      <div class="border-b border-[#bfa07a]/40 pb-3 flex items-center justify-between">
        <div>
          <span class="text-xs font-mono font-extrabold tracking-widest text-[#852c1e] uppercase">Cour de Justice d'Osiris</span>
          <h2 class="text-xl font-bold uppercase text-[#2b1b11]">Règles & Niveaux de Difficulté</h2>
        </div>
        <button
          @click="currentTab = 'investigation'"
          class="px-4 py-1.5 bg-[#852c1e] text-[#faebd7] font-mono text-xs uppercase font-bold rounded shadow-xs hover:bg-[#6e2317] cursor-pointer"
        >
          Retourner au Sanctuaire →
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div class="bg-[#f5ede0] border border-[#cfb594] p-5 rounded-md space-y-3 shadow-xs">
          <div class="w-8 h-8 rounded-full bg-[#2b5921] text-[#faebd7] flex items-center justify-center font-mono font-bold text-sm shadow-xs">1</div>
          <h3 class="font-bold text-base uppercase text-[#2b1b11]">Niveau Facile</h3>
          <p class="text-sm text-[#523d2b] leading-relaxed">
            Parmi les 15 éléments déterrés, un <strong class="text-[#852c1e]">indice décisif évident</strong> est garanti d'apparaître, désignant sans équivoque le suspect coupable.
          </p>
        </div>

        <div class="bg-[#f5ede0] border border-[#cfb594] p-5 rounded-md space-y-3 shadow-xs">
          <div class="w-8 h-8 rounded-full bg-[#7a4b22] text-[#faebd7] flex items-center justify-center font-mono font-bold text-sm shadow-xs">2</div>
          <h3 class="font-bold text-base uppercase text-[#2b1b11]">Niveau Moyen</h3>
          <p class="text-sm text-[#523d2b] leading-relaxed">
            L'indice évident n'a que <strong>50% de chances</strong> d'apparaître sur les fouilles. Si vous ne le trouvez pas, basez votre verdict sur la contradiction entre les déclarations et les objets.
          </p>
        </div>

        <div class="bg-[#f5ede0] border border-[#cfb594] p-5 rounded-md space-y-3 shadow-xs">
          <div class="w-8 h-8 rounded-full bg-[#852c1e] text-[#faebd7] flex items-center justify-center font-mono font-bold text-sm shadow-xs">3</div>
          <h3 class="font-bold text-base uppercase text-[#2b1b11]">Niveau Difficile</h3>
          <p class="text-sm text-[#523d2b] leading-relaxed">
            Aucun indice évident n'est présent. Vous devez identifier le mensonge dans l'alibi du coupable et le confronter directement à l'arme réelle du crime.
          </p>
        </div>
      </div>
    </section>

    <!-- ================= 3. SCÈNE PRINCIPALE ================= -->
    <main v-else class="flex-1 grid grid-cols-12 gap-3 min-h-0">
      
      <!-- ================= COLONNE GAUCHE (SALLES & 10 SUSPECTS) ================= -->
      <aside class="col-span-3 flex flex-col gap-2.5 min-h-0">
        
        <!-- Sélecteur des 6 Salles -->
        <div class="bg-[#faebd7] border border-[#bfa07a] rounded-md p-2.5 shadow-xs shrink-0">
          <div class="flex items-center justify-between mb-1.5 font-mono">
            <span class="text-xs font-extrabold uppercase tracking-wider text-[#8c673d]">Périmètre de Fouille</span>
            <span class="text-[11px] text-stone-500 font-bold uppercase">{{ game.rooms.length }} secteurs</span>
          </div>
          <div class="grid grid-cols-3 gap-1">
            <button
              v-for="room in game.rooms"
              :key="room.id"
              @click="game.activeRoomId = room.id"
              :class="[
                'py-1.5 px-1.5 text-xs font-mono uppercase font-bold tracking-wider rounded border transition cursor-pointer text-center truncate',
                game.activeRoomId === room.id
                  ? 'bg-[#322316] border-[#1d140b] text-[#faebd7] shadow-xs'
                  : 'bg-[#f7ede0] border-[#cfb594] text-[#523d2b] hover:bg-[#eedfcb]'
              ]"
            >
              {{ room.name.split(' ')[0] }}
            </button>
          </div>
        </div>

        <!-- Fiches des 10 Suspects (Mélangés à chaque nouvelle partie) -->
        <div class="bg-[#faebd7] border border-[#bfa07a] rounded-md p-3 flex-1 flex flex-col min-h-0 shadow-xs">
          <div class="h-7 border-b border-[#bfa07a]/40 pb-1.5 mb-2 flex items-center justify-between font-mono shrink-0">
            <span class="text-xs font-extrabold uppercase tracking-wider text-[#734b26] flex items-center gap-1.5">
              <span class="text-sm">👥</span>
              <span>10 Suspects</span>
            </span>
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
              :class="game.selectedSuspectId ? 'bg-[#1b3d54] text-[#faebd7]' : 'bg-[#eedfcb] text-[#734b26]'"
            >
              {{ selectedSuspect ? selectedSuspect.name.split(' ')[0] : '1 à désigner' }}
            </span>
          </div>

          <div class="flex-1 overflow-y-auto space-y-2.5 pr-1">
            <div
              v-for="suspect in game.suspects"
              :key="suspect.id"
              @click="game.selectedSuspectId = suspect.id"
              :class="[
                'p-3 border rounded-md cursor-pointer transition relative',
                game.selectedSuspectId === suspect.id
                  ? 'border-[#1b3d54] bg-[#dbe8f0] shadow-xs ring-2 ring-[#1b3d54]/50'
                  : 'border-[#cfb594]/60 bg-[#f7ede0]/70 hover:bg-[#f7ede0]'
              ]"
            >
              <div class="flex items-center justify-between gap-1.5">
                <span class="font-bold text-[#2b1b11] text-sm flex items-center gap-2 truncate">
                  <span class="text-lg leading-none shrink-0">{{ suspect.avatar }}</span>
                  <span class="truncate">{{ suspect.name }}</span>
                </span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-[#faebd7] border border-[#cfb594] text-[#734b26] uppercase font-extrabold shrink-0">
                  {{ suspect.role }}
                </span>
              </div>
              <p class="text-xs text-[#523d2b] italic mt-1.5 leading-relaxed border-l-2 border-[#bfa07a] pl-2 line-clamp-2">
                « {{ suspect.dialogue }} »
              </p>
            </div>
          </div>
        </div>

      </aside>

      <!-- ================= COLONNE CENTRALE : PLATEAU (OBJECT-CONTAIN SANS DÉFORMATION) ================= -->
      <section class="col-span-6 flex flex-col gap-2.5 min-h-0">
        
        <div class="relative flex-1 rounded-lg border-2 border-[#a6865c] overflow-hidden shadow-[inset_0_0_80px_rgba(60,35,15,0.4)] flex items-center justify-center min-h-0 bg-[#21150c] p-2">
          
          <div class="relative w-full h-full max-w-full max-h-full aspect-video flex items-center justify-center">
            
            <!-- Image du lieu intacte, sans distorsion -->
            <img
              v-if="activeRoom?.image"
              :src="activeRoom.image"
              :alt="activeRoom.name"
              class="w-full h-full object-contain pointer-events-none select-none brightness-95 contrast-105 rounded"
            />

            <!-- Ornements d'angle -->
            <div class="absolute top-2 right-2 text-xs text-[#ffd97d]/70 font-mono tracking-widest select-none pointer-events-none drop-shadow z-10">𓃭 𓃮 𓃯</div>
            <div class="absolute bottom-2 left-2 text-xs text-[#ffd97d]/70 font-mono tracking-widest select-none pointer-events-none drop-shadow z-10">𓄿 𓅀 𓅁</div>

            <!-- Badge du lieu -->
            <div class="absolute top-2.5 left-2.5 bg-[#faebd7]/95 border border-[#a6865c] px-3.5 py-1 rounded text-xs font-mono text-[#2b1b11] uppercase tracking-wider font-extrabold shadow-md z-10 flex items-center gap-2 backdrop-blur-xs">
              <span class="text-base text-[#852c1e] leading-none">📍</span>
              <span>Lieu : {{ activeRoom ? activeRoom.name : 'Manoir' }}</span>
            </div>

            <!-- Glyphes dorés collés aux éléments cliquables -->
            <template v-if="activeRoom && activeRoom.hotspots">
              <button
                v-for="spot in activeRoom.hotspots"
                :key="spot.id"
                @click="game.inspectSpot(spot, activeRoom.name)"
                :style="{ left: `${spot.x}%`, top: `${spot.y}%`, position: 'absolute' }"
                class="group -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none z-10"
              >
                <div
                  class="w-11 h-11 rounded-full border-2 flex items-center justify-center font-mono text-base font-bold transition-all duration-300 shadow-xl group-hover:scale-125"
                  :class="game.searchedSpots.has(spot.id)
                    ? 'border-[#7a644c] bg-[#faebd7]/85 text-[#54412f]'
                    : 'border-[#d4af37] bg-gradient-to-br from-[#852c1e] to-[#5a1a11] text-[#ffd97d] shadow-[0_0_22px_rgba(212,175,55,0.85)] animate-bounce'"
                >
                  {{ game.searchedSpots.has(spot.id) ? '✓' : '𓂀' }}
                </div>

                <span class="absolute top-13 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#2b1b11] text-[#faebd7] border border-[#d4af37] px-3 py-1.5 text-xs font-mono whitespace-nowrap shadow-2xl z-20 rounded">
                  Examiner : {{ spot.name }}
                </span>
              </button>
            </template>
          </div>
        </div>

        <!-- Note de fouille -->
        <div class="bg-[#faebd7] border-l-4 border-[#852c1e] border-y border-r border-[#bfa07a] px-4 py-2.5 rounded-sm shadow-xs shrink-0 flex items-center gap-2.5">
          <span class="text-xs font-mono font-extrabold uppercase text-[#852c1e] tracking-widest shrink-0 flex items-center gap-1.5">
            <span class="text-sm">🖋️</span>
            <span>Rapport :</span>
          </span>
          <p class="text-sm text-[#2b1b11] font-serif italic truncate">
            « {{ game.inspectionLog }} »
          </p>
        </div>
      </section>

      <!-- ================= COLONNE DROITE (15 INDICES & VERDICT) ================= -->
      <aside class="col-span-3 flex flex-col gap-2.5 min-h-0">
        
        <!-- Fiches des 15 Indices (Avec nom de salle d'origine) -->
        <div class="bg-[#faebd7] border border-[#bfa07a] rounded-md p-3 flex-1 flex flex-col min-h-0 shadow-xs">
          <div class="h-7 border-b border-[#bfa07a]/40 pb-1.5 mb-2 flex items-center justify-between font-mono shrink-0">
            <span class="text-xs font-extrabold uppercase tracking-wider text-[#734b26] flex items-center gap-1.5">
              <span class="text-sm">🏺</span>
              <span>Indices Répertoriés</span>
            </span>
            <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#eedfcb] text-[#734b26]">
              {{ game.discoveredClues.length }} / 15
            </span>
          </div>

          <div v-if="game.discoveredClues.length === 0" class="flex-1 flex flex-col items-center justify-center text-center p-4 text-xs text-[#8c673d] italic border border-dashed border-[#bfa07a]/60 rounded-md">
            <span class="text-3xl mb-2 opacity-70">📜</span>
            <p>Fouillez les 6 secteurs pour déterrer les 15 preuves de l’enquête.</p>
          </div>

          <div v-else class="flex-1 overflow-y-auto space-y-2.5 pr-1">
            <div
              v-for="(clue, idx) in game.discoveredClues"
              :key="idx"
              @click="game.selectedClueId = clue.id"
              :class="[
                'p-3 border rounded-md cursor-pointer transition relative',
                game.selectedClueId === clue.id
                  ? 'border-[#852c1e] bg-[#f2dfca] shadow-xs ring-2 ring-[#852c1e]/40'
                  : 'border-[#cfb594]/60 bg-[#f7ede0]/70 hover:bg-[#f7ede0]'
              ]"
            >
              <div class="flex items-center justify-between gap-1.5">
                <span class="font-bold text-[#2b1b11] text-sm flex items-center gap-2 truncate">
                  <span class="text-lg leading-none shrink-0">{{ clue.icon }}</span>
                  <span class="truncate">{{ clue.name }}</span>
                </span>
                <span class="text-[10px] font-mono text-[#852c1e] font-extrabold shrink-0">
                  #AR-{{ String(idx + 1).padStart(2, '0') }}
                </span>
              </div>
              
              <!-- Badge de provenance du lieu -->
              <div class="mt-1 flex items-center gap-1 text-[10px] font-mono text-[#8c673d]">
                <span>📍</span>
                <span class="uppercase tracking-wider font-semibold">{{ clue.roomName }}</span>
              </div>

              <p class="text-xs text-[#523d2b] mt-1 leading-relaxed italic line-clamp-2">
                {{ clue.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bouton d'Accusation Principal -->
        <button
          @click="game.submitAccusation"
          :disabled="!game.selectedSuspectId || !game.selectedClueId"
          class="w-full py-3 rounded-md font-mono text-xs uppercase font-extrabold tracking-widest border transition cursor-pointer disabled:cursor-not-allowed shrink-0 text-center shadow-md flex items-center justify-center gap-2"
          :class="game.selectedSuspectId && game.selectedClueId
            ? 'bg-gradient-to-r from-[#943122] via-[#b33d2b] to-[#943122] text-[#faebd7] border-[#53160e] hover:brightness-110 shadow-[0_4px_15px_rgba(148,49,34,0.4)] animate-pulse'
            : 'bg-[#ebd9be] border-[#cfb594] text-[#8c745f] opacity-60'"
        >
          <span class="text-base leading-none">⚖️</span>
          <span>Désigner le Coupable</span>
        </button>

      </aside>

    </main>

    <!-- ================= MODALE : CHARGER UNE PARTIE ================= -->
    <div
      v-if="isLoadModalOpen"
      class="fixed inset-0 bg-[#1d140b]/80 backdrop-blur-xs flex items-center justify-center p-4 z-50"
    >
      <div class="border-4 border-[#bfa07a] max-w-md w-full p-5 space-y-4 shadow-2xl bg-[#faebd7] rounded-lg">
        <div class="flex items-center justify-between border-b-2 border-[#bfa07a]/40 pb-2">
          <div class="flex items-center gap-2">
            <span class="text-xl">📂</span>
            <div>
              <span class="text-[10px] font-mono font-bold tracking-widest text-[#852c1e] uppercase block leading-none">Archives Royales</span>
              <h3 class="text-base font-bold text-[#2b1b11] uppercase mt-0.5">Charger une Enquête</h3>
            </div>
          </div>
          <button
            @click="isLoadModalOpen = false"
            class="w-7 h-7 rounded-full border border-[#bfa07a] text-[#852c1e] hover:bg-[#ebd9c1] font-mono font-bold cursor-pointer"
          >
            ×
          </button>
        </div>

        <div v-if="game.savedSlots.length === 0" class="py-6 text-center text-xs text-[#8c673d] italic">
          Aucun parchemin archivé dans la mémoire locale.
        </div>

        <div v-else class="space-y-2 max-h-60 overflow-y-auto pr-1">
          <div
            v-for="slot in game.savedSlots"
            :key="slot.id"
            class="p-2.5 border border-[#bfa07a] bg-[#f7ede0] hover:border-[#852c1e] transition rounded-md flex items-center justify-between gap-2 shadow-xs"
          >
            <div class="space-y-0.5 min-w-0 flex-1">
              <div class="font-bold text-xs text-[#2b1b11] truncate">{{ slot.title }}</div>
              <div class="text-[10px] font-mono text-[#8c673d]">
                {{ slot.date }} • {{ slot.cluesCount }} artefact(s)
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <button
                @click="handleLoadSlot(slot.id)"
                class="px-2.5 py-1 bg-[#2b1b11] text-[#faebd7] text-xs font-mono font-bold uppercase rounded cursor-pointer hover:bg-black"
              >
                Reprendre
              </button>
              <button
                @click="game.deleteSlot(slot.id)"
                class="p-1 border border-[#bfa07a] text-[#852c1e] text-xs rounded cursor-pointer hover:bg-red-100"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <div class="pt-2 border-t border-[#bfa07a]/40 flex justify-end">
          <button
            @click="isLoadModalOpen = false"
            class="px-3 py-1 border border-[#bfa07a] text-xs font-mono font-bold uppercase hover:bg-[#ebd9c1] cursor-pointer rounded"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODALE : VERDICT ================= -->
    <div
      v-if="game.verdict"
      class="fixed inset-0 bg-[#1d140b]/80 backdrop-blur-xs flex items-center justify-center p-4 z-50"
    >
      <div class="border-4 max-w-sm w-full p-5 space-y-3 shadow-2xl bg-[#faebd7] rounded-lg text-center" :class="game.verdict.solved ? 'border-[#2b5921]' : 'border-[#852c1e]'">
        <span class="text-xs font-mono font-bold tracking-widest uppercase block" :class="game.verdict.solved ? 'text-[#2b5921]' : 'text-[#852c1e]'">
          {{ game.verdict.solved ? '𓉐 Vérité Révélée // Décret d’Osiris' : '𓉚 Fausse Piste // Accusation Rejetée' }}
        </span>

        <p class="text-sm text-[#2b1b11] font-serif leading-relaxed italic">
          {{ game.verdict.message }}
        </p>

        <button
          @click="game.resetVerdict"
          class="w-full py-2 border-2 font-mono text-xs uppercase tracking-wider transition cursor-pointer font-bold rounded shadow-sm"
          :class="game.verdict.solved
            ? 'border-[#2b5921] bg-[#dcead4] text-[#2b5921] hover:bg-[#c9e0be]'
            : 'border-[#852c1e] bg-[#f8dad5] text-[#852c1e] hover:bg-[#f2c7c0]'"
        >
          Poursuivre les Recherches
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';

const currentTab = ref<'investigation' | 'rules'>('investigation');
const isLoadModalOpen = ref(false);
const saveNotice = ref(false);

// Répertoire des 10 suspects avec leurs preuves directes potentielles
const BASE_SUSPECTS = [
  { id: 'suspect-1', name: 'Victor Vance', role: 'Le Majordome', alibi: '« J’étais au sous-sol à inventorier l’argenterie de 16h à 18h. »', avatar: '🍷', dialogue: 'Lord Blackwood était intraitable, mais c’était mon bienfaiteur depuis trente ans.', smokingGun: 'Un passe-partout frappé aux initiales V.V. maculé de curare' },
  { id: 'suspect-2', name: 'Éléonore Blackwood', role: 'L’Héritière', alibi: '« Je consultais les archives familiales dans la bibliothèque. »', avatar: '💍', dialogue: 'Mon père voulait léguer sa collection au musée plutôt qu’à ses propres enfants.', smokingGun: 'Une broche en perles signée de la fille du Lord tombée près du poison' },
  { id: 'suspect-3', name: 'Dr. Arthur Sterling', role: 'Le Médecin', alibi: '« Je préparais une infusion calmante dans la serre botanique. »', avatar: '🩺', dialogue: 'Son cœur était fatigué, mais je n’aurais jamais prescrit une dose léthale.', smokingGun: 'Une ordonnance manuscrite du Dr. Sterling prescrivant une dose foudroyante' },
  { id: 'suspect-4', name: 'Madeleine Croft', role: 'La Gouvernante', alibi: '« Aux cuisines avec le personnel de service toute l’après-midi. »', avatar: '🗝️', dialogue: 'J’ai vu des ombres suspectes rôder près du fumoir quelques minutes avant le dîner.', smokingGun: 'Le trousseau numéroté de Madeleine taché de résidus de digitale' },
  { id: 'suspect-5', name: 'Prof. Alistair Finch', role: 'L’Archéologue rival', alibi: '« J’admirais les sarcophages du hall d’entrée sans bouger d’un pouce. »', avatar: '📜', dialogue: 'Lord Blackwood m’avait volé la paternité des découvertes du tombeau royal d’Abydos !', smokingGun: 'Le carnet de fouilles du Prof. Finch contenant la recette exacte de la toxine' },
  { id: 'suspect-6', name: 'Clara Delacroix', role: 'L’Antiquaire parisienne', alibi: '« J’examinais le mobilier de la crypte avec ma loupe d’expertise. »', avatar: '💎', dialogue: 'Je suis venue négocier des statuettes royales, pas assister à une tragédie.', smokingGun: 'Une carte de visite parisienne de Clara Delacroix imprégnée d’amande amère' },
  { id: 'suspect-7', name: 'Capitaine Thomas Reed', role: 'Le Mercenaire', alibi: '« Je nettoyais mes fusils de chasse à la sellerie du domaine. »', avatar: '🎖️', dialogue: 'Lord Blackwood me devait ma part sur l’escorte de son expédition en Haute-Égypte.', smokingGun: 'Un étui de poignard régimentaire gravé au nom du Capitaine Reed' },
  { id: 'suspect-8', name: 'Evelyn Carter', role: 'La Traductrice', alibi: '« Retranscrivant des papyrus hiératiques dans le fumoir. »', avatar: '🖋️', dialogue: 'Lord Blackwood s’était disputé violemment avant le thé au sujet de la traduction.', smokingGun: 'Le buvard monogrammé d’Evelyn Carter séchant une menace de mort' },
  { id: 'suspect-9', name: 'Barnabé Finch', role: 'Le Jardinier', alibi: '« Je taillais les rosiers sous la pluie près de la serre. »', avatar: '🌿', dialogue: 'On m’a volé des outils hier matin, quelqu’un a forcé la remise.', smokingGun: 'Un sécateur de greffe professionnel appartenant à Barnabé' },
  { id: 'suspect-10', name: 'Sébastien Vane', role: 'Le Notaire', alibi: '« Je rédigeais un codicille dans le bureau annexe du rez-de-chaussée. »', avatar: '⚖️', dialogue: 'Lord Blackwood devait signer le désaveu total de ses associés ce soir même.', smokingGun: 'Le sceau en cire rouge officiel du notaire Vane scellant l’accusation' }
];

// Catalogue des variantes contextuelles par point de fouille (100% cohérent avec chaque meuble)
const SPOT_CLUE_VARIANTS: Record<string, Array<{ id: string; name: string; description: string; icon: string; log: string; isWeapon?: boolean }>> = {
  // Bureau du Lord
  'spot-1': [
    { id: 'clue-desk-1', name: 'Sous-main et lettre inachevée', description: 'Une lettre dénonçant un vol de reliques royales.', icon: '✉️', log: 'Sur le sous-main, Lord Blackwood dénonçait un complot avant de mourir.' },
    { id: 'clue-desk-2', name: 'Montre à gousset brisée', description: 'Arrêtée net à 16h42 lors d’un choc violent sur le bois.', icon: '⏱️', log: 'Sur le sous-main, la montre brisée fige l’heure exacte de l’agression.' },
    { id: 'clue-desk-3', name: 'Buvard taché d’encre violette', description: 'Traces d’une signature forcée sous la contrainte.', icon: '🖋️', log: 'Le buvard garde l’empreinte d’un document signé dans la panique.' }
  ],
  'spot-2': [
    { id: 'clue-safe-1', name: 'Coffre derrière le tableau forcé', description: 'Vidé de ses obligations et de ses diamants bruts.', icon: '🖼️', log: 'Derrière la toile, le compartiment blindé a été vidé sans fracturation.' },
    { id: 'clue-safe-2', name: 'Double fond entrouvert', description: 'Un registre secret répertoriant les dettes des convives.', icon: '📓', log: 'Dans le panneau secret du tableau, un carnet intime compromettant.' }
  ],
  'spot-3': [
    { id: 'clue-ashes-1', name: 'Cendres de testament juridique', description: 'Fragments d’un acte d’héritage noircis par le feu.', icon: '📜', log: 'Au fond de l’âtre, des morceaux de parchemin notarié ont réchappé aux flammes.' },
    { id: 'clue-ashes-2', name: 'Gant en cuir partiellement calciné', description: 'Gant fin abandonné à la hâte dans le foyer.', icon: '🧤', log: 'Dans les braises froides, un gant de soirée à moitié consumé.' }
  ],

  // Office & Réserves
  'spot-4': [
    { id: 'clue-linen-1', name: 'Armoire et mouchoir taché', description: 'Un linge de service imprégné de traces jaunâtres suspectes.', icon: '🧣', log: 'Dans l’armoire à linge, un mouchoir a été dissimulé à la hâte parmi les draps.' },
    { id: 'clue-linen-2', name: 'Tablier souillé de poudre blanche', description: 'Résidus d’alcaloïde dissimulés sous les serviettes propres.', icon: '🥼', log: 'Caché au fond de l’armoire, un tablier imprégné de produit chimique.' }
  ],
  'spot-5': [
    { id: 'clue-pot-1', name: 'Théière en argent du banquet', description: 'Le bec verseur dégage une forte odeur d’amande amère.', icon: '🫖', log: 'La théière du banquet présente un résidu visqueux toxique !', isWeapon: true },
    { id: 'clue-pot-2', name: 'Tasse de porcelaine fêlée', description: 'Fond de tisane amère contenant une concentration anormale.', icon: '☕', log: 'Sur le plateau d’argent, une tasse abandonnée dégage une odeur âcre.', isWeapon: true }
  ],

  // Bibliothèque
  'spot-6': [
    { id: 'clue-book-1', name: 'Traité de toxicologie nubienne', description: 'Ouvrage ouvert au chapitre des poisons paralysants.', icon: '📖', log: 'Sur le rayonnage, ce manuel ancien a été feuilleté avec des mains poussiéreuses.' },
    { id: 'clue-book-2', name: 'Livre évidé de contrebande', description: 'Un faux dictionnaire servant de cachette pour flacons.', icon: '📕', log: 'Entre deux reliures, un livre creux portant la marque circulaire d’une fiole.' }
  ],
  'spot-7': [
    { id: 'clue-cufflink-1', name: 'Bouton de manchette scarabée', description: 'Bijou en or massif égaré entre deux coussins capitonnés.', icon: '🪲', log: 'Glissé entre les plis du fauteuil en cuir, ce bijou appartient à un invité.' },
    { id: 'clue-cufflink-2', name: 'Éventail en soie déchiré', description: 'Soie fine ornée de perles arrachée lors d’une querelle.', icon: '🪭', log: 'Coincé contre le dossier du fauteuil, un éventail abandonné sous le coup de l’émotion.' }
  ],
  'spot-8': [
    { id: 'clue-chalk-1', name: 'Marques de craie sur l’échelle', description: 'Craie blanche utilisée par les traducteurs d’hiéroglyphes.', icon: '🖍️', log: 'Des traces de craie fraîche souillent les montants en bois de l’échelle.' },
    { id: 'clue-chalk-2', name: 'Papyrus déchiré au pied de l’échelle', description: 'Feuille antique froissée lors d’une précipitation.', icon: '📜', log: 'Au pied des marches de l’échelle, un extrait de papyrus piétiné.' }
  ],

  // Serre Botanique
  'spot-9': [
    { id: 'clue-digitalis-1', name: 'Pieds de digitale fraîchement coupés', description: 'Tiges de fleurs toxiques sectionnées aujourd’hui même.', icon: '🌿', log: 'Une coupe fraîche de digitale pourpre dont le suc provoque l’arrêt cardiaque.', isWeapon: true },
    { id: 'clue-digitalis-2', name: 'Baies de belladone écrasées', description: 'Graines hautement vénéneuses pillées dans les bacs.', icon: '🫐', log: 'Des baies de belladone fraîchement broyées sur les dalles de pierre.', isWeapon: true }
  ],
  'spot-10': [
    { id: 'clue-secateur-1', name: 'Sécateur maculé de sève', description: 'Outil de coupe portant un suc laiteux irritant.', icon: '🧤', log: 'Sur la table de rempotage, le sécateur est encore poisseux d’extrait végétal.', isWeapon: true },
    { id: 'clue-secateur-2', name: 'Mortier de botaniste pilé', description: 'Bol de broyage en pierre contenant une pâte d’herbes amères.', icon: '🥣', log: 'Sur l’établi de la serre, un pilon encore humide de sève toxique.', isWeapon: true }
  ],

  // Fumoir Privé
  'spot-11': [
    { id: 'clue-hair-1', name: 'Mèche de cheveux blonds', description: 'Fibres capillaires arrachées lors d’une querelle sur le sofa.', icon: '💇', log: 'Sur les coussins du divan, quelques mèches attestent d’une lutte discrète.' },
    { id: 'clue-hair-2', name: 'Mouchoir en soie parfumé', description: 'Tissu imprégné d’une eau de Cologne d’importation.', icon: '🧣', log: 'Glissé sous un coussin, un mouchoir imprégné d’un parfum identifiable.' }
  ],
  'spot-12': [
    { id: 'clue-pipe-1', name: 'Cendrier et pipe encore tiède', description: 'Tabac oriental mélangé à des graines somnifères.', icon: '🪵', log: 'Sur la table basse, la pipe dégage une odeur anormale de pavot et d’épices.' },
    { id: 'clue-pipe-2', name: 'Étui à cigarettes monogrammé', description: 'Étui en argent gravé oublié près du verre de digestif.', icon: '🚬', log: 'Sur la table basse, cet étui luxueux appartient à l’un des convives.' }
  ],
  'spot-13': [
    { id: 'clue-curtain-1', name: 'Tenture froissée et traces de cire', description: 'La draperie porte l’empreinte d’un témoin caché.', icon: '🗝️', log: 'Derrière le rideau lourd, des gouttes de cire de bougie fraîche au sol.' },
    { id: 'clue-curtain-2', name: 'Bouton de veste arraché', description: 'Bouton en corne noire tombé derrière la draperie.', icon: '🔘', log: 'Au pied du rideau, ce bouton a sauté lors d’une altercation précipitée.' }
  ],

  // Cave à Vin & Crypte
  'spot-14': [
    { id: 'clue-curare-1', name: 'Fiole de curare dissimulée', description: 'Flacon médical en verre ambré presque vidé de sa dose mortelle.', icon: '🧪', log: 'Cachée derrière un fût de chêne, une fiole de curare foudroyant !', isWeapon: true },
    { id: 'clue-curare-2', name: 'Bouteille de grand cru frelatée', description: 'Le goulot en cire a été percé à la seringue.', icon: '🍾', log: 'Parmi les fûts, une bouteille dont le bouchon a été discrètement altéré.', isWeapon: true }
  ],
  'spot-15': [
    { id: 'clue-crate-1', name: 'Statuette d’Anubis emballée', description: 'Antiquité nubienne enfouie sous de la paille d’expédition.', icon: '🏺', log: 'Dans les caisses d’expédition, la statuette dorée attendait son receleur.' },
    { id: 'clue-crate-2', name: 'Pied-de-biche d’archéologue', description: 'Barre de fer ayant servi à desceller les sarcophages.', icon: '⛏️', log: 'Posé sur une caisse de transport, un outil de cambriolage encore poussiéreux.' }
  ]
};

const game = reactive({
  caseInfo: {
    title: 'Le Meurtre du Manoir Blackwood',
    synopsis: 'Lord Blackwood a été empoisonné pendant un banquet archéologique. Dix invités et employés étaient présents dans l’enceinte du domaine.'
  },
  difficulty: 'easy' as 'easy' | 'medium' | 'hard',
  rooms: [
    {
      id: 'room-office',
      name: 'Bureau du Lord',
      image: '/rooms/office.jpg',
      description: 'Lieu du crime. Papiers d’affaires et pièces de collection.',
      hotspots: [
        { id: 'spot-1', name: 'Sous-main du bureau', x: 34, y: 64 },
        { id: 'spot-2', name: 'Tableau au-dessus du foyer', x: 76, y: 24 },
        { id: 'spot-3', name: 'Âtre de la cheminée', x: 76, y: 69 }
      ]
    },
    {
      id: 'room-pantry',
      name: 'Office & Réserves',
      image: '/rooms/pantry.jpg',
      description: 'Argenterie, lingeries et services du banquet.',
      hotspots: [
        { id: 'spot-4', name: 'Armoire à linge entrouverte', x: 54, y: 46 },
        { id: 'spot-5', name: 'Plateau d’argent et théière', x: 84, y: 81 }
      ]
    },
    {
      id: 'room-library',
      name: 'Bibliothèque',
      image: '/rooms/library.jpg',
      description: 'Volumes anciens de toxicologie et d’archéologie nubienne.',
      hotspots: [
        { id: 'spot-6', name: 'Rayonnage supérieur', x: 27, y: 24 },
        { id: 'spot-7', name: 'Fauteuil en cuir capitonné', x: 83, y: 64 },
        { id: 'spot-8', name: 'Échelle d’archiviste', x: 44, y: 48 }
      ]
    },
    {
      id: 'room-botany',
      name: 'Serre Botanique',
      image: '/rooms/botany.jpg',
      description: 'Végétaux exotiques et outillages d’horticulture.',
      hotspots: [
        { id: 'spot-9', name: 'Massif de digitales pourpres', x: 88, y: 56 },
        { id: 'spot-10', name: 'Table de rempotage et sécateur', x: 68, y: 83 }
      ]
    },
    {
      id: 'room-smoking',
      name: 'Fumoir Privé',
      image: '/rooms/smoking.jpg',
      description: 'Sièges en cuir, cendriers orientaux et reliques de voyage.',
      hotspots: [
        { id: 'spot-11', name: 'Coussins du divan', x: 39, y: 55 },
        { id: 'spot-12', name: 'Table basse et cendrier', x: 61, y: 69 },
        { id: 'spot-13', name: 'Tenture en velours', x: 19, y: 36 }
      ]
    },
    {
      id: 'room-cellar',
      name: 'Cave à Vin & Crypte',
      image: '/rooms/cellar.jpg',
      description: 'Fûts de garde et sous-sols médiévaux humides.',
      hotspots: [
        { id: 'spot-14', name: 'Fûts de vieillissement', x: 22, y: 57 },
        { id: 'spot-15', name: 'Caisses d’expédition en paille', x: 74, y: 77 }
      ]
    }
  ],
  suspects: [] as any[],
  activeRoomId: 'room-office',
  discoveredClues: [] as any[],
  searchedSpots: new Set<string>(),
  inspectionLog: 'Explorez méthodiquement les 6 salles pour déterrer les 15 indices de l’affaire.',
  selectedSuspectId: null as string | null,
  selectedClueId: null as string | null,
  verdict: null as any,
  savedSlots: [] as any[],
  culpritId: '',
  murderWeaponId: '',
  spotClueMapping: {} as Record<string, any>,

  generateRandomMystery() {
    // 1. Mélange aléatoire des 10 suspects
    this.suspects = [...BASE_SUSPECTS].sort(() => Math.random() - 0.5);

    // 2. Tirage d'un nouveau coupable
    const culprit = this.suspects[Math.floor(Math.random() * this.suspects.length)];
    this.culpritId = culprit.id;

    // 3. Tirage contextuel d'un indice par spot parmi ses variantes dédiées
    this.spotClueMapping = {};
    const weaponCandidates: string[] = [];

    Object.keys(SPOT_CLUE_VARIANTS).forEach(spotId => {
      const variants = SPOT_CLUE_VARIANTS[spotId];
      const chosenClue = variants[Math.floor(Math.random() * variants.length)];
      this.spotClueMapping[spotId] = { ...chosenClue };

      if (chosenClue.isWeapon) {
        weaponCandidates.push(chosenClue.id);
      }
    });

    // 4. Choix de l'arme du crime parmi les armes actives
    this.murderWeaponId = weaponCandidates[Math.floor(Math.random() * weaponCandidates.length)];

    // 5. Gestion de l'indice évident (Smoking Gun) selon le niveau de difficulté
    let placeSmokingGun = false;
    if (this.difficulty === 'easy') {
      placeSmokingGun = true; // Garanti en facile
    } else if (this.difficulty === 'medium') {
      placeSmokingGun = Math.random() > 0.5; // 50% de chances en moyen
    } else {
      placeSmokingGun = false; // Exclu en difficile
    }

    if (placeSmokingGun) {
      // On place l'élément évident sur un spot secondaire sans écraser l'arme du crime
      const candidateSpots = ['spot-1', 'spot-7', 'spot-11', 'spot-13'];
      const chosenSpot = candidateSpots[Math.floor(Math.random() * candidateSpots.length)];
      
      this.spotClueMapping[chosenSpot] = {
        id: 'smoking-gun',
        name: `Preuve accablante (${culprit.name.split(' ')[0]})`,
        description: `${culprit.smokingGun}.`,
        icon: '🔎',
        log: `Élément décisif : vous découvrez ${culprit.smokingGun.toLowerCase()} !`
      };
    }
  },

  init() {
    this.refreshSaveSlots();
    if (!this.culpritId || this.suspects.length === 0) {
      this.generateRandomMystery();
    }
  },

  inspectSpot(spot: { id: string; name: string }, roomName: string) {
    this.searchedSpots.add(spot.id);
    const data = this.spotClueMapping[spot.id];
    
    if (data) {
      this.inspectionLog = data.log;
      if (!this.discoveredClues.some(c => c.id === data.id)) {
        this.discoveredClues.push({
          id: data.id,
          name: data.name,
          description: data.description,
          icon: data.icon,
          roomName: roomName
        });
        this.selectedClueId = data.id;
      }
    }
  },

  submitAccusation() {
    if (!this.selectedSuspectId || !this.selectedClueId) return;

    const isRightCulprit = this.selectedSuspectId === this.culpritId;
    const isRightWeapon = this.selectedClueId === this.murderWeaponId || this.selectedClueId === 'smoking-gun';
    const suspectObj = this.suspects.find(s => s.id === this.selectedSuspectId);
    const clueObj = this.discoveredClues.find(c => c.id === this.selectedClueId);

    if (isRightCulprit && isRightWeapon) {
      this.verdict = {
        solved: true,
        message: `Arrêt d'Osiris rendu ! Confronté(e) à l'élément décisif (« ${clueObj?.name} »), ${suspectObj?.name} s'effondre et avoue l'intégralité du meurtre !`
      };
    } else if (isRightCulprit) {
      this.verdict = {
        solved: false,
        message: `Vous tenez le bon suspect en la personne de ${suspectObj?.name}, mais l'élément présenté ne constitue pas la preuve matérielle du crime !`
      };
    } else {
      this.verdict = {
        solved: false,
        message: `Accusation rejetée ! Les constatations de l'enquête innocentent totalement ${suspectObj?.name}.`
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
      title: `${this.caseInfo.title} (${this.difficulty.toUpperCase()})`,
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
        suspects: this.suspects,
        difficulty: this.difficulty,
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
    this.suspects = d.suspects || [...BASE_SUSPECTS];
    this.difficulty = d.difficulty || 'easy';
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
});

const activeRoom = computed(() => {
  return game.rooms.find(r => r.id === game.activeRoomId) || game.rooms[0];
});

const selectedSuspect = computed(() => {
  return game.suspects.find(s => s.id === game.selectedSuspectId) || null;
});

const setDifficulty = (diff: 'easy' | 'medium' | 'hard') => {
  game.difficulty = diff;
  game.startNewGame();
};

const handleSave = () => {
  game.saveGame();
  saveNotice.value = true;
  setTimeout(() => { saveNotice.value = false; }, 4000);
};

const openLoadModal = () => {
  game.refreshSaveSlots();
  isLoadModalOpen.value = true;
};

const handleLoadSlot = (slotId: string) => {
  const ok = game.loadSlot(slotId);
  if (ok) {
    isLoadModalOpen.value = false;
    currentTab.value = 'investigation';
  }
};

const promptNewGame = () => {
  if (confirm('Générer une nouvelle enquête ? La disposition des indices et les suspects seront réinitialisés.')) {
    game.startNewGame();
    currentTab.value = 'investigation';
  }
};

onMounted(() => {
  game.init();
});
</script>