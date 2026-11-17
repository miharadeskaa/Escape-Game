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
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
    });
  }

  async generateNewMystery(theme = 'Manoir Victorien'): Promise<GeneratedCase> {
    const prompt = `Tu es un auteur expert de romans policiers et de jeux d'enquête (style Agatha Christie, Sherlock Holmes).
Génère une enquête policière complète, logique, captivante et 100% solvable sur le thème: "${theme}".

Règles impératives :
1. Il y a 3 suspects (suspect-1, suspect-2, suspect-3). L'un d'eux est le vrai coupable.
2. Il y a 2 pièces à fouiller, contenant chacune 2 à 3 points d'intérêt (hotspots) avec coordonnées x et y en pourcentage (entre 20 et 80).
3. Exactement 3 indices au total sont disséminés dans les hotspots.
4. Un des indices est la "preuve reine" (keyClueId) qui contredit formellement l'alibi du coupable.
5. La réponse DOIT être un JSON valide sans texte avant ni après.

Format JSON attendu :
{
  "title": "Titre du meurtre",
  "synopsis": "Court résumé de la scène de crime initiale",
  "culpritId": "suspect-1",
  "keyClueId": "clue-2",
  "solutionExplanation": "Explication claire reliant le coupable à l'indice clé",
  "rooms": [
    {
      "id": "room-1",
      "name": "Nom du lieu",
      "description": "Ambiance visuelle sombre",
      "themeColor": "from-stone-900 to-neutral-950",
      "hotspots": [
        {
          "id": "spot-1",
          "name": "Nom de l'objet ou meuble",
          "x": 35,
          "y": 60,
          "inspectedMessage": "Ce que voit le détective en observant",
          "clue": {
            "id": "clue-1",
            "name": "Nom de l'indice",
            "description": "Description matérielle de la preuve",
            "icon": "📜"
          }
        }
      ]
    }
  ],
  "suspects": [
    {
      "id": "suspect-1",
      "name": "Nom complet",
      "role": "Sa fonction",
      "alibi": "Ce qu'il prétend avoir fait",
      "avatar": "🎩",
      "dialogue": "Sa réplique initiale sous le choc",
      "secretMotif": "Ce qu'il cache réellement"
    }
  ]
}`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const parsed: GeneratedCase = JSON.parse(completion.choices[0].message.content || '{}');
    return parsed;
  }
}