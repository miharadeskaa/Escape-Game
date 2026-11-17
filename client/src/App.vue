<template>
  <div class="h-screen w-screen overflow-hidden bg-[#ecdcc4] text-[#342417] font-serif flex flex-col p-3 gap-2.5 select-none relative">
    
    <!-- Liseré supérieur ornemental aux reflets dorés -->
    <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8b5a2b] via-[#d4af37] to-[#8b5a2b] shadow-sm"></div>

    <!-- ================= 1. BARRE DE COMMANDE SUPÉRIEURE ================= -->
    <nav class="bg-[#faebd7]/95 border border-[#bfa07a] rounded-md px-4 py-1.5 flex items-center justify-between shadow-sm shrink-0 backdrop-blur-sm">
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
                difficulty === diff
                  ? 'bg-[#852c1e] text-[#faebd7] shadow-sm'
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
          class="px-3.5 py-1.5 text-xs font-mono uppercase font-bold tracking-wider rounded border border-[#bfa07a] bg-[#f7ede0] hover:bg-[#ebd7bc] transition shadow-sm cursor-pointer flex items-center gap-1.5 text-[#342417]"
        >
          <span class="text-base leading-none">{{ currentTab === 'rules' ? '𓉐' : '📜' }}</span>
          <span>{{ currentTab === 'rules' ? 'Sanctuaire' : 'Règles' }}</span>
        </button>

        <div class="h-4 w-px bg-[#bfa07a]/40 mx-1"></div>

        <button
          @click="handleSave"
          class="px-3.5 py-1.5 text-xs font-mono uppercase font-bold tracking-wider rounded border border-[#bfa07a] bg-[#f7ede0] hover:bg-[#ebd7bc] transition shadow-sm cursor-pointer flex items-center gap-1.5 text-[#342417]"
        >
          <span class="text-base leading-none">💾</span>
          <span>Sauver</span>
        </button>

        <button
          @click="openLoadModal"
          class="px-3.5 py-1.5 text-xs font-mono uppercase font-bold tracking-wider rounded border border-[#bfa07a] bg-[#f7ede0] hover:bg-[#ebd7bc] transition shadow-sm cursor-pointer flex items-center gap-1.5 text-[#342417] relative"
        >
          <span class="text-base leading-none">📂</span>
          <span>Archives</span>
          <span
            v-if="game.savedSlots.length > 0"
            class="px-1.5 py-0.5 bg-[#852c1e] text-[#faebd7] text-[10px] rounded-full font-mono font-bold leading-none"
          >
            {{ game.savedSlots.length }}
          </span>
        </button>

        <button
          @click="promptNewGame"
          class="px-4 py-1.5 text-xs font-mono uppercase font-bold tracking-wider rounded border border-[#53160e] bg-gradient-to-b from-[#963424] to-[#782316] text-[#faebd7] hover:brightness-110 transition shadow-sm cursor-pointer flex items-center gap-1.5"
        >
          <span class="text-base leading-none">𓇳</span>
          <span>Nouvelle Affaire</span>
        </button>
      </div>
    </nav>

    <!-- NOTIFICATION SAUVEGARDE -->
    <div v-if="saveNotice" class="bg-[#dcead4] border border-[#2b5921] text-[#2b5921] px-4 py-1.5 text-xs font-mono rounded flex justify-between items-center shrink-0 shadow-sm">
      <div class="flex items-center gap-2">
        <span class="text-sm font-bold">✓</span>
        <span>L'état actuel des fouilles a été consigné dans les archives du scribe royal.</span>
      </div>
      <button @click="saveNotice = false" class="font-bold cursor-pointer text-sm">×</button>
    </div>

    <!-- ================= 2. BANDEAU DE TITRE CENTRÉ ================= -->
    <header class="bg-[#faebd7] border-2 border-[#bfa07a] rounded-md px-6 py-3 shadow-sm shrink-0 grid grid-cols-12 items-center gap-4 relative overflow-hidden">
      <div class="absolute right-4 -bottom-4 text-8xl opacity-5 pointer-events-none select-none font-mono">𓃭</div>

      <div class="col-span-2 hidden sm:flex items-center gap-3">
        <div class="w-11 h-11 rounded-full bg-gradient-to-br from-[#852c1e] to-[#5a1a11] text-[#ffd97d] flex items-center justify-center font-bold text-xl shadow-[0_2px_8px_rgba(133,44,30,0.35)] border border-[#d4af37] shrink-0">
          ⚖️
        </div>
        <div>
          <span class="text-[10px] font-mono uppercase tracking-widest text-[#852c1e] font-extrabold block leading-none">Scellé</span>
          <span class="text-xs font-mono text-[#734b26] font-bold">#2026-X</span>
        </div>
      </div>

      <div class="col-span-12 sm:col-span-8 flex flex-col items-center justify-center text-center space-y-1 min-w-0">
        <div class="flex items-center justify-center gap-2 font-mono text-xs font-extrabold uppercase tracking-[0.3em] text-[#852c1e]">
          <span>𓇯</span>
          <span>{{ game.suspects.length }} Suspects // {{ totalSpotsCount }} Indices Potentiels</span>
          <span>𓇯</span>
        </div>
        
        <h1 class="text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#2b1b11] truncate max-w-full">
          {{ game.caseInfo.title }}
        </h1>
        
        <p class="text-xs sm:text-sm text-[#523d2b] italic leading-snug whitespace-normal max-w-3xl font-serif px-2">
          « {{ game.caseInfo.synopsis }} »
        </p>
      </div>

      <div class="col-span-2 hidden sm:flex items-center justify-end border-l border-[#bfa07a]/40 pl-4">
        <div class="text-right">
          <span class="block text-[10px] font-mono uppercase font-bold text-[#8c673d] tracking-wider">Avancement</span>
          <span class="font-mono font-extrabold text-base text-[#852c1e] tracking-tight">
            {{ game.discoveredClues.length }} / {{ totalSpotsCount }} indice(s)
          </span>
        </div>
      </div>
    </header>

    <!-- ================= VUE RÈGLES ================= -->
    <section v-if="currentTab === 'rules'" class="flex-1 bg-[#faebd7]/95 border-2 border-[#bfa07a] rounded-md p-6 overflow-y-auto space-y-4 shadow-md backdrop-blur-sm">
      <div class="border-b border-[#bfa07a]/40 pb-3 flex items-center justify-between">
        <div>
          <span class="text-xs font-mono font-extrabold tracking-widest text-[#852c1e] uppercase">Cour de Justice d'Osiris</span>
          <h2 class="text-xl font-bold uppercase text-[#2b1b11]">Règles & Niveaux de Difficulté</h2>
        </div>
        <button
          @click="currentTab = 'investigation'"
          class="px-4 py-1.5 bg-[#852c1e] text-[#faebd7] font-mono text-xs uppercase font-bold rounded shadow-sm hover:bg-[#6e2317] cursor-pointer"
        >
          Retourner au Sanctuaire →
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div class="bg-[#f5ede0] border border-[#cfb594] p-5 rounded-md space-y-3 shadow-sm">
          <div class="w-8 h-8 rounded-full bg-[#2b5921] text-[#faebd7] flex items-center justify-center font-mono font-bold text-sm shadow-sm">1</div>
          <h3 class="font-bold text-base uppercase text-[#2b1b11]">Niveau Facile</h3>
          <p class="text-sm text-[#523d2b] leading-relaxed">
            Un <strong class="text-[#852c1e]">indice décisif évident</strong> est garanti d'apparaître, désignant sans équivoque le suspect coupable.
          </p>
        </div>

        <div class="bg-[#f5ede0] border border-[#cfb594] p-5 rounded-md space-y-3 shadow-sm">
          <div class="w-8 h-8 rounded-full bg-[#7a4b22] text-[#faebd7] flex items-center justify-center font-mono font-bold text-sm shadow-sm">2</div>
          <h3 class="font-bold text-base uppercase text-[#2b1b11]">Niveau Moyen</h3>
          <p class="text-sm text-[#523d2b] leading-relaxed">
            L'indice évident n'a que <strong>50% de chances</strong> d'apparaître. Si absent, basez votre déduction sur la contradiction entre les déclarations et les objets découverts.
          </p>
        </div>

        <div class="bg-[#f5ede0] border border-[#cfb594] p-5 rounded-md space-y-3 shadow-sm">
          <div class="w-8 h-8 rounded-full bg-[#852c1e] text-[#faebd7] flex items-center justify-center font-mono font-bold text-sm shadow-sm">3</div>
          <h3 class="font-bold text-base uppercase text-[#2b1b11]">Niveau Difficile</h3>
          <p class="text-sm text-[#523d2b] leading-relaxed">
            Aucun indice évident n'est présent. Vous devez identifier le mensonge dans l'alibi du coupable et le confronter directement à l'arme réelle du crime.
          </p>
        </div>
      </div>
    </section>

    <!-- ================= 3. SCÈNE PRINCIPALE ================= -->
    <main v-else class="flex-1 grid grid-cols-12 gap-3 min-h-0">
      
      <!-- ================= COLONNE GAUCHE (SALLES & SUSPECTS) ================= -->
      <aside class="col-span-3 flex flex-col gap-2.5 min-h-0">
        
        <!-- Sélecteur des Salles -->
        <div class="bg-[#faebd7] border border-[#bfa07a] rounded-md p-2.5 shadow-sm shrink-0">
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
                  ? 'bg-[#322316] border-[#1d140b] text-[#faebd7] shadow-sm'
                  : 'bg-[#f7ede0] border-[#cfb594] text-[#523d2b] hover:bg-[#eedfcb]'
              ]"
            >
              {{ room.name.split(' ')[0] }}
            </button>
          </div>
        </div>

        <!-- Fiches des Suspects -->
        <div class="bg-[#faebd7] border border-[#bfa07a] rounded-md p-3 flex-1 flex flex-col min-h-0 shadow-sm">
          <div class="h-7 border-b border-[#bfa07a]/40 pb-1.5 mb-2 flex items-center justify-between font-mono shrink-0">
            <span class="text-xs font-extrabold uppercase tracking-wider text-[#734b26] flex items-center gap-1.5">
              <span class="text-sm">👥</span>
              <span>{{ game.suspects.length }} Suspects</span>
            </span>
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
              :class="game.selectedSuspectId ? 'bg-[#1b3d54] text-[#faebd7]' : 'bg-[#eedfcb] text-[#734b26]'"
            >
              {{ game.selectedSuspect ? game.selectedSuspect.name.split(' ')[0] : '1 à désigner' }}
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
                  ? 'border-[#1b3d54] bg-[#dbe8f0] shadow-sm ring-2 ring-[#1b3d54]/50'
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

      <!-- ================= COLONNE CENTRALE : PLATEAU CALIBRÉ ================= -->
      <section class="col-span-6 flex flex-col gap-2.5 min-h-0">
        
        <div class="relative flex-1 rounded-lg border-2 border-[#a6865c] overflow-hidden shadow-[inset_0_0_80px_rgba(60,35,15,0.4)] flex items-center justify-center min-h-0 bg-[#21150c] p-2">
          
          <!-- Conteneur 16:9 ajusté aux pixels réels pour empêcher tout décalage en % -->
          <div class="relative w-full h-full max-w-full max-h-full aspect-video select-none rounded overflow-hidden">
            
            <img
              v-if="game.activeRoom?.image"
              :src="game.activeRoom.image"
              :alt="game.activeRoom.name"
              class="w-full h-full object-cover brightness-95 contrast-105"
            />

            <!-- Ornements d'angle dorés -->
            <div class="absolute top-2 right-2 text-xs text-[#ffd97d]/70 font-mono tracking-widest select-none pointer-events-none drop-shadow z-10">𓃭 𓃮 𓃯</div>
            <div class="absolute bottom-2 left-2 text-xs text-[#ffd97d]/70 font-mono tracking-widest select-none pointer-events-none drop-shadow z-10">𓄿 𓅀 𓅁</div>

            <!-- Badge du lieu actif -->
            <div class="absolute top-2.5 left-2.5 bg-[#faebd7]/95 border border-[#a6865c] px-3.5 py-1 rounded text-xs font-mono text-[#2b1b11] uppercase tracking-wider font-extrabold shadow-md z-10 flex items-center gap-2 backdrop-blur-sm pointer-events-none">
              <span class="text-base text-[#852c1e] leading-none">📍</span>
              <span>Lieu : {{ game.activeRoom?.name || 'Manoir' }}</span>
            </div>

            <!-- Glyphes dorés collés aux points de fouille -->
            <template v-if="game.activeRoom?.hotspots">
              <button
                v-for="spot in game.activeRoom.hotspots"
                :key="spot.id"
                @click="game.inspectSpot(spot)"
                :style="{ left: `${spot.x}%`, top: `${spot.y}%` }"
                class="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none z-10"
              >
                <div
                  class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-mono text-sm sm:text-base font-bold transition-all duration-300 shadow-xl group-hover:scale-125"
                  :class="game.searchedSpots.includes(spot.id)
                    ? 'border-[#7a644c] bg-[#faebd7]/90 text-[#54412f]'
                    : 'border-[#d4af37] bg-gradient-to-br from-[#852c1e] to-[#5a1a11] text-[#ffd97d] shadow-[0_0_20px_rgba(212,175,55,0.85)] animate-bounce'"
                >
                  {{ game.searchedSpots.includes(spot.id) ? '✓' : '𓂀' }}
                </div>

                <span class="absolute top-12 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#2b1b11] text-[#faebd7] border border-[#d4af37] px-2.5 py-1 text-[11px] font-mono whitespace-nowrap shadow-2xl z-20 rounded pointer-events-none">
                  Examiner : {{ spot.name }}
                </span>
              </button>
            </template>
          </div>
        </div>

        <!-- Note de fouille -->
        <div class="bg-[#faebd7] border-l-4 border-[#852c1e] border-y border-r border-[#bfa07a] px-4 py-2.5 rounded-sm shadow-sm shrink-0 flex items-center gap-2.5">
          <span class="text-xs font-mono font-extrabold uppercase text-[#852c1e] tracking-widest shrink-0 flex items-center gap-1.5">
            <span class="text-sm">🖋️</span>
            <span>Rapport :</span>
          </span>
          <p class="text-sm text-[#2b1b11] font-serif italic truncate">
            « {{ game.inspectionLog }} »
          </p>
        </div>
      </section>

      <!-- ================= COLONNE DROITE (INDICES & VERDICT) ================= -->
      <aside class="col-span-3 flex flex-col gap-2.5 min-h-0">
        
        <div class="bg-[#faebd7] border border-[#bfa07a] rounded-md p-3 flex-1 flex flex-col min-h-0 shadow-sm">
          <div class="h-7 border-b border-[#bfa07a]/40 pb-1.5 mb-2 flex items-center justify-between font-mono shrink-0">
            <span class="text-xs font-extrabold uppercase tracking-wider text-[#734b26] flex items-center gap-1.5">
              <span class="text-sm">🏺</span>
              <span>Indices Répertoriés</span>
            </span>
            <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#eedfcb] text-[#734b26]">
              {{ game.discoveredClues.length }} / {{ totalSpotsCount }}
            </span>
          </div>

          <div v-if="game.discoveredClues.length === 0" class="flex-1 flex flex-col items-center justify-center text-center p-4 text-xs text-[#8c673d] italic border border-dashed border-[#bfa07a]/60 rounded-md">
            <span class="text-3xl mb-2 opacity-70">📜</span>
            <p>Fouillez les secteurs pour déterrer les preuves de l’enquête.</p>
          </div>

          <div v-else class="flex-1 overflow-y-auto space-y-2.5 pr-1">
            <div
              v-for="(clue, idx) in game.discoveredClues"
              :key="idx"
              @click="game.selectedClueId = clue.id"
              :class="[
                'p-3 border rounded-md cursor-pointer transition relative',
                game.selectedClueId === clue.id
                  ? 'border-[#852c1e] bg-[#f2dfca] shadow-sm ring-2 ring-[#852c1e]/40'
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
              
              <div v-if="getClueRoomName(clue.id)" class="mt-1 flex items-center gap-1 text-[10px] font-mono text-[#8c673d]">
                <span>📍</span>
                <span class="uppercase tracking-wider font-semibold">{{ getClueRoomName(clue.id) }}</span>
              </div>

              <p class="text-xs text-[#523d2b] mt-1 leading-relaxed italic line-clamp-2">
                {{ clue.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bouton d'Accusation Principal -->
        <button
          @click="game.submitAccusation()"
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
      class="fixed inset-0 bg-[#1d140b]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
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
            class="p-2.5 border border-[#bfa07a] bg-[#f7ede0] hover:border-[#852c1e] transition rounded-md flex items-center justify-between gap-2 shadow-sm"
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
      class="fixed inset-0 bg-[#1d140b]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div class="border-4 max-w-sm w-full p-5 space-y-3 shadow-2xl bg-[#faebd7] rounded-lg text-center" :class="game.verdict.solved ? 'border-[#2b5921]' : 'border-[#852c1e]'">
        <span class="text-xs font-mono font-bold tracking-widest uppercase block" :class="game.verdict.solved ? 'text-[#2b5921]' : 'text-[#852c1e]'">
          {{ game.verdict.solved ? '𓉐 Vérité Révélée // Décret d’Osiris' : '𓉚 Fausse Piste // Accusation Rejetée' }}
        </span>

        <p class="text-sm text-[#2b1b11] font-serif leading-relaxed italic">
          {{ game.verdict.message }}
        </p>

        <button
          @click="game.resetVerdict()"
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
import { ref, computed, onMounted } from 'vue';
import { useGameStore } from './stores/game';

const game = useGameStore();

const currentTab = ref<'investigation' | 'rules'>('investigation');
const isLoadModalOpen = ref(false);
const saveNotice = ref(false);
const difficulty = ref<'easy' | 'medium' | 'hard'>('easy');

const totalSpotsCount = computed(() => {
  return game.rooms.reduce((acc, room) => acc + room.hotspots.length, 0);
});

// Résolution réactive du nom de la pièce sans casser le typage Clue
const getClueRoomName = (clueId: string): string => {
  for (const room of game.rooms) {
    const hasSpot = room.hotspots.some(h => {
      const mapped = game.spotClueMapping[h.id];
      return (mapped && mapped.id === clueId) || (h.clue && h.clue.id === clueId);
    });
    if (hasSpot) return room.name;
  }
  return '';
};

const setDifficulty = (diff: 'easy' | 'medium' | 'hard') => {
  difficulty.value = diff;
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