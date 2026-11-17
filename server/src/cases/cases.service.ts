import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

export interface GeneratedCase {
  title: string;
  synopsis: string;
  culpritId: string;
  keyClueId: string;
  solutionExplanation: string;
  rooms: {
    id: string;
    name: string;
    description: string;
    themeColor: string;
    hotspots: {
      id: string;
      name: string;
      x: number;
      y: number;
      inspectedMessage: string;
      clue?: {
        id: string;
        name: string;
        description: string;
        icon: string;
      };
    }[];
  }[];
  suspects: {
    id: string;
    name: string;
    role: string;
    alibi: string;
    avatar: string;
    dialogue: string;
    secretMotif: string;
  }[];
}

@Injectable()
export class StoryGeneratorService {
  private openai: OpenAI | null = null;

  constructor() {
    const key = process.env.OPENAI_API_KEY;
    if (key && key !== 'dummy_key') {
      this.openai = new OpenAI({ apiKey: key });
    }
  }

  async generateNewMystery(theme = 'Manoir Victorien'): Promise<GeneratedCase> {
    // Si pas de clé OpenAI, on renvoie une affaire mockée instantanément
    if (!this.openai) {
      console.warn('⚠️ Pas de clé API OpenAI : utilisation du scénario de démonstration.');
      return this.getFallbackCase();
    }

    try {
      const prompt = `Génère une enquête policière complète en JSON...`; // votre prompt habituel
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      });
      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (e) {
      console.error('Erreur API OpenAI, bascule sur le scénario de secours', e);
      return this.getFallbackCase();
    }
  }

  private getFallbackCase(): GeneratedCase {
    return {
      title: 'Le Mystère du Manoir Blackwood',
      synopsis: 'Lord Blackwood a été retrouvé empoisonné dans son bureau fermé à clé.',
      culpritId: 'suspect-1',
      keyClueId: 'clue-3',
      solutionExplanation: 'Victor Vance a utilisé la digitaline dissimulée dans les serviettes du personnel pour empoisonner le thé de son maître suite à une dispute d’héritage.',
      rooms: [
        {
          id: 'room-office',
          name: 'Bureau du Lord',
          description: 'Des livres anciens garnissent les étagères sombres. Une odeur amère persiste dans l’air.',
          themeColor: 'from-amber-950/40 to-neutral-900',
          hotspots: [
            {
              id: 'spot-desk',
              name: 'Bureau en acajou',
              x: 45,
              y: 55,
              inspectedMessage: 'Une tasse en porcelaine contient un fond de liquide noirâtre dégageant une odeur d’amande amère.',
              clue: {
                id: 'clue-1',
                name: 'Tasse de thé amère',
                description: 'Traces suspectes d’un composé toxique.',
                icon: '☕'
              }
            },
            {
              id: 'spot-safe',
              name: 'Tableau aux yeux perçants',
              x: 25,
              y: 35,
              inspectedMessage: 'Le coffre mural derrière la peinture est ouvert. Des papiers en ont été arrachés.',
              clue: {
                id: 'clue-2',
                name: 'Testament raturé',
                description: 'Le majordome y était récemment exclu des légataires.',
                icon: '📜'
              }
            }
          ]
        },
        {
          id: 'room-pantry',
          name: 'Office du personnel',
          description: 'Une pièce étroite remplie de linges repassés et de vaisselle étincelante.',
          themeColor: 'from-stone-900 to-neutral-950',
          hotspots: [
            {
              id: 'spot-linen',
              name: 'Pile de serviettes brodées',
              x: 40,
              y: 65,
              inspectedMessage: 'Glissée au fond d’une pile de draps propres, vous heurtez une petite fiole en verre.',
              clue: {
                id: 'clue-3',
                name: 'Fiole de digitaline vide',
                description: 'Le bouchon porte les initiales V.V.',
                icon: '🧪'
              }
            }
          ]
        }
      ],
      suspects: [
        {
          id: 'suspect-1',
          name: 'Victor Vance',
          role: 'Le Majordome',
          alibi: 'Prétend être resté ranger l’argenterie au sous-sol toute la soirée.',
          avatar: '🍷',
          dialogue: 'Lord Blackwood avait ses humeurs, mais le tuer ? Quelle calomnie !',
          secretMotif: 'Il venait d’apprendre qu’il était déshérité après 20 ans de service loyal.'
        },
        {
          id: 'suspect-2',
          name: 'Éléonore Blackwood',
          role: 'L’Héritière',
          alibi: 'Affirme avoir lu tranquillement dans sa chambre au premier étage.',
          avatar: '💍',
          dialogue: 'Mon père était distant, mais je n’avais aucune raison de lui ôter la vie.',
          secretMotif: 'Besoin urgent d’argent pour combler des dettes de jeu.'
        },
        {
          id: 'suspect-3',
          name: 'Dr. Julian Thorne',
          role: 'Le Médecin',
          alibi: 'Vérifiait les ordonnances dans son cabinet médical attenant.',
          avatar: '🩺',
          dialogue: 'Son rythme cardiaque était instable, ce qui est typique de la digitaline.',
          secretMotif: 'Voulait masquer une erreur de diagnostic commise le mois passé.'
        }
      ]
    };
  }
}