import type { IconName } from "@/components/Icon";

/**
 * ============================================================
 * CONTENU DU SITE — FICHIER UNIQUE À MODIFIER
 *
 * Thème : Orientation et accompagnement des nouveaux bacheliers
 * Titre : Cap sur monAvenir — Réussir Son Post-BAC
 * Contexte : Bénin, rentrée 2026-2027 — plateforme apresmonbac.bj
 * ============================================================
 */

export interface Module {
  tag: string;
  icon: IconName;
  title: string;
  duration?: string;
  promise?: string;
  points: string[];
}

export interface Lesson {
  title: string;
  description: string;
  /** URL de la vidéo (mp4 ou embed Vimeo : https://player.vimeo.com/video/ID). Vide = "à venir". */
  url?: string;
}

export interface MemberModule {
  tag: string;
  icon: IconName;
  title: string;
  /** Pitch vidéo du module, affiché en introduction dans l'espace membre. */
  pitch: string;
  lessons: Lesson[];
}

export interface Testimonial {
  name: string;
  caption: string;
  type: "vimeo" | "image";
  /** URL embed Vimeo ou chemin d'image (/avis/xxx.jpg). Vide = emplacement à remplir. */
  src?: string;
}

export const site = {
  brand: "Cap sur monAvenir",
  topbar: "Le programme d'orientation n°1 des nouveaux bacheliers — Bénin · Rentrée 2026-2027",

  hero: {
    badge: "Spécial nouveaux bacheliers — Bénin 2026",
    title: "Réussir Son Post-BAC",
    subtitle:
      "Tu viens d'avoir ton BAC ? Félicitations. Maintenant, tout se joue : classement, choix de filières sur apresmonbac.bj, bourses, budget de l'année. Ce programme t'accompagne capsule par capsule pour la rentrée 2026-2027, avec un accès membre sécurisé à vie.",
    videoLabel: "Regarde la vidéo ci-dessous",
    videoUrl: "",
  },

  trust: ["Accès immédiat", "Garantie 7 jours", "Places limitées"],

  benefits: [
    {
      icon: "compass" as IconName,
      title: "Une méthode 100 % Bénin",
      text: "basée sur la procédure officielle de classement et la plateforme apresmonbac.bj — pas sur la rumeur du quartier.",
    },
    {
      icon: "monitor" as IconName,
      title: "La plateforme maîtrisée écran par écran",
      text: "création du compte, lecture des 7 indicateurs sous chaque filière, classement des choix, modification avant la clôture.",
    },
    {
      icon: "lock" as IconName,
      title: "Un espace membre sécurisé à vie",
      text: "les 21 capsules vidéo et les exercices dans un espace privé, accessible uniquement aux membres, avec les mises à jour.",
    },
  ],

  forWho: {
    title: "Pour qui est ce programme ?",
    items: [
      {
        icon: "graduation-cap" as IconName,
        highlight: "nouveaux bacheliers",
        text: "qui préparent la rentrée 2026-2027 et veulent faire les bons choix dès la première fois.",
      },
      {
        icon: "users" as IconName,
        highlight: "parents",
        text: "qui veulent accompagner leur enfant avec des chiffres et un budget clair, pas de l'émotion.",
      },
      {
        icon: "book-open" as IconName,
        highlight: "titulaires du DEAT / DT et bacs techniques",
        text: "dont la fenêtre et les matières prises en compte sont spécifiques.",
      },
      {
        icon: "target" as IconName,
        highlight: "étudiants en réorientation",
        text: "qui veulent repartir sur de bonnes bases sans perdre une année de plus.",
      },
    ],
    note: "Tu n'as pas besoin d'être le premier de ta promo. Tu as juste besoin de connaître les règles — et de chiffrer tes chances avant de choisir.",
  },

  mistakes: {
    title: "Les erreurs qui coûtent une année aux bacheliers",
    intro: "Chaque année au Bénin, des milliers de bacheliers se plantent… parce que :",
    items: [
      "Ils croient qu'avoir le BAC = avoir la filière qu'on veut. Or tout se joue sur un classement, filière par filière.",
      "Ils raisonnent sur leur moyenne générale — alors que le classement se calcule sur 3 matières fondamentales et leurs coefficients.",
      "Ils choisissent une filière sans vérifier que leur série y est admise… ou que l'entrée se fait par concours.",
      "Ils alignent trois choix ultra-demandés sans aucun choix de sécurité — et se retrouvent sans filière.",
      "Ils attendent le dernier jour pour saisir leurs choix : site saturé, coupure d'électricité, fenêtre refermée.",
    ],
    conclusion: "Résultat ? Une année perdue.",
  },

  promise: {
    title: "La promesse de Cap sur monAvenir",
    items: [
      {
        icon: "compass" as IconName,
        title: "Comprends les règles du jeu",
        text: "— les 4 facteurs qui décident de ton affectation, classement ou concours, et le calendrier exact de ta catégorie.",
      },
      {
        icon: "award" as IconName,
        title: "Calcule ta vraie moyenne de classement",
        text: "— la formule officielle appliquée filière par filière, pour chiffrer tes chances avant de choisir.",
      },
      {
        icon: "shield" as IconName,
        title: "Sécurise ton année",
        text: "— liste de vœux ambition / réaliste / sécurité, financement (bourse, FPP, FEP), dossier prêt et plan B écrit.",
      },
    ],
    note: "Une méthode pensée pour les réalités du terrain béninois. Simple. Efficace. Accessible.",
  },

  method: {
    title: "La Méthode Cap sur monAvenir",
    intro:
      "La stratégie la plus simple pour réussir ton entrée dans le supérieur au Bénin. Le programme repose sur 3 piliers essentiels :",
    pillars: [
      {
        icon: "compass" as IconName,
        title: "L'Orientation",
        text: "comprendre le système : les 4 universités publiques, concours ou classement, le calendrier officiel de ta catégorie.",
      },
      {
        icon: "monitor" as IconName,
        title: "La Stratégie",
        text: "calculer ta moyenne de classement et construire une liste de vœux ambition / réaliste / sécurité sur apresmonbac.bj.",
      },
      {
        icon: "trending-up" as IconName,
        title: "L'Avenir",
        text: "financer tes études (bourse, FPP, FEP), réussir ton inscription et toujours avoir un plan B écrit.",
      },
    ],
  },

  coach: {
    heading: "Qui est ton formateur ?",
    name: "[Nom du formateur]",
    intro:
      "est reconnu pour son accompagnement des nouveaux bacheliers béninois vers les bonnes filières et les bonnes universités.",
    points: [
      "À travers ses accompagnements sur WhatsApp, il a déjà aidé de nombreux bacheliers à décrocher leur place et leur bourse.",
      "Il connaît les réalités du terrain : les 4 universités publiques, la plateforme apresmonbac.bj, les régimes de financement (bourse, FPP, FEP).",
    ],
    missionTitle: "Avec son programme",
    missionProgram: "Cap sur monAvenir",
    mission:
      "Sa mission : qu'aucun bachelier ne se retrouve sans filière à la rentrée, et que chacun construise un avenir à la hauteur de son potentiel.",
    photos: ["", ""] as string[],
  },

  gallery: {
    title: "Une communauté qui avance ensemble",
    images: ["", "", "", ""] as string[],
  },

  results: {
    title: "Quelques résultats d'élèves",
    intro:
      "Ils ont suivi l'accompagnement (d'abord sur WhatsApp) et ont décroché leur filière. Voici leurs retours :",
    items: [
      {
        name: "Élève 1",
        caption: "Classé dans la filière de son premier choix avec une bourse",
        type: "vimeo",
        src: "",
      },
      {
        name: "Élève 2",
        caption: "A évité une erreur éliminatoire grâce à la stratégie de classement",
        type: "vimeo",
        src: "",
      },
      {
        name: "Avis WhatsApp",
        caption: "Retour reçu après l'accompagnement",
        type: "image",
        src: "",
      },
      {
        name: "Avis WhatsApp",
        caption: "Retour reçu après l'accompagnement",
        type: "image",
        src: "",
      },
    ] as Testimonial[],
  },

  modules: [
    {
      tag: "Module 1",
      icon: "landmark" as IconName,
      title: "Comprendre les règles du jeu",
      duration: "~35 min · 5 capsules",
      promise: "Savoir comment on est réellement sélectionné au Bénin.",
      points: [
        "Les 4 facteurs qui décident vraiment de ton orientation",
        "Le paysage : UAC, UP, UNSTIM, UNA — où peux-tu réellement aller ?",
        "Concours ou classement : deux portes différentes",
        "Le calendrier officiel 2026 et la création sécurisée de ton compte",
      ],
    },
    {
      tag: "Module 2",
      icon: "target" as IconName,
      title: "Connaître son profil et calculer sa moyenne",
      duration: "~35 min · 4 capsules",
      promise: "Savoir chiffrer tes chances avant de choisir.",
      points: [
        "Ta série commande tes portes",
        "La vraie moyenne : celle du classement (formule officielle)",
        "Trouver les matières retenues pour chaque filière",
        "Aptitudes, projet et réalité du marché",
      ],
    },
    {
      tag: "Module 3",
      icon: "list" as IconName,
      title: "Choisir et hiérarchiser ses choix",
      duration: "~40 min · 4 capsules",
      promise: "Construire une liste de vœux qui ne se sabote pas.",
      points: [
        "Lire les 7 indicateurs affichés sous chaque filière",
        "La grille ambition / réaliste / sécurité",
        "Les filières à petit effectif que personne ne regarde",
        "Changer d'université sans changer de rêve",
      ],
    },
    {
      tag: "Module 4",
      icon: "wallet" as IconName,
      title: "Financer ses études : bourse, FPP, FEP",
      duration: "~30 min · 4 capsules",
      promise: "Anticiper le coût réel de l'année.",
      points: [
        "Les trois statuts et comment ils s'attribuent",
        "Le même diplôme, trois façons de le payer",
        "La demande d'allocation auprès de la DBAU",
        "Ton budget annuel réel, poste par poste, avec sources",
      ],
    },
    {
      tag: "Module 5",
      icon: "map" as IconName,
      title: "Après le résultat : inscription, plan B, étranger",
      duration: "~35 min · 4 capsules",
      promise: "Ne jamais rester bloqué, quel que soit le résultat.",
      points: [
        "Le dossier physique prêt avant la publication",
        "Pas classé ? Les quatre voies du plan B",
        "Étudier à l'étranger sans se faire arnaquer (5 signaux d'alerte)",
        "Réussir ses trois premières semaines en LMD",
      ],
    },
    {
      tag: "Inclus",
      icon: "lock" as IconName,
      title: "Espace membre à vie",
      points: [
        "Les 21 capsules vidéo en accès sécurisé",
        "Exercices et tableaux de suivi à chaque module",
        "Disponible 24h/24, 7j/7 — mises à jour incluses",
      ],
    },
  ] as Module[],

  pricing: {
    badge: "Offre de lancement",
    oldPrice: "30 000",
    price: "15 000",
    currency: "FCFA",
    note: "Paiement unique — accès à vie",
    features: [
      "Les 5 modules complets — 21 capsules vidéo",
      "Exercices pratiques et fiches à chaque capsule",
      "Le guide écran par écran de apresmonbac.bj",
      "Espace membre sécurisé à vie",
      "Mises à jour gratuites",
      "Garantie satisfait ou remboursé 7 jours",
    ],
    paymentNote:
      "Paiement sécurisé (Mobile Money, Orange Money, Wave, carte bancaire) — Après ton achat, tu reçois immédiatement ton code d'accès à l'espace membre.",
  },

  paymentMethods: [
    { id: "orange", label: "Orange Money", icon: "smartphone" as IconName },
    { id: "mtn", label: "MTN Mobile Money", icon: "wallet" as IconName },
    { id: "wave", label: "Wave", icon: "wave" as IconName },
    { id: "card", label: "Carte bancaire", icon: "credit-card" as IconName },
  ],

  /** Espace membre : les 5 modules avec pitchs et capsules. */
  memberModules: [
    {
      tag: "Module 1",
      icon: "landmark" as IconName,
      title: "Comprendre les règles du jeu",
      pitch:
        "Bienvenue dans ce premier module ! L'orientation au Bénin n'est pas un « choix libre » : c'est une procédure de classement et de sélection, en place depuis 2007. Le BAC ouvre la porte de l'université — il ne choisit pas ta salle. Ici, tu découvres les 4 facteurs qui décident réellement de ton affectation, les deux portes d'entrée (classement ou concours), le calendrier officiel de ta catégorie et la création sécurisée de ton compte sur apresmonbac.bj.",
      lessons: [
        {
          title: "Capsule 1.1 — Ce qui décide vraiment de ton orientation (6 min)",
          description:
            "Les 4 facteurs : filières choisies, performances au BAC, capacité d'accueil, places disponibles. Choix + Notes + Capacité = Affectation.",
        },
        {
          title: "Capsule 1.2 — Le paysage : où peux-tu réellement aller ? (8 min)",
          description:
            "UAC, UP, UNSTIM, UNA et leurs établissements, les écoles inter-États, le privé autorisé. La plateforme ne concerne que le public.",
        },
        {
          title: "Capsule 1.3 — Concours ou classement : deux portes différentes (6 min)",
          description:
            "Les filières à concours (INMeS, IFSIO, ENEAM, ENSTIC, INJEPS, ENS, INSPEI…) et celles où le quota partiellement payant est de zéro.",
        },
        {
          title: "Capsule 1.4 — Le calendrier officiel et la plateforme (8 min)",
          description:
            "Boursiers : 14 → 24 août · Non-boursiers : 11 → 22 septembre · DEAT/DT : 30 sept → 6 oct. Rétroplanning J-7 / J-3 / dernier jour.",
        },
        {
          title: "Capsule 1.5 — Créer et sécuriser son compte (5 min)",
          description:
            "Pas à pas sur apresmonbac.bj : numéro de table, vérification d'identité, activation. Mot de passe confidentiel, captures d'écran à chaque étape.",
        },
      ],
    },
    {
      tag: "Module 2",
      icon: "target" as IconName,
      title: "Connaître son profil et calculer sa moyenne de classement",
      pitch:
        "On passe de « j'espère » à « je sais où je me situe ». On ne te classe pas sur ta moyenne générale : on te classe sur trois matières fondamentales affectées de leurs coefficients. Dans ce module, tu apprends la formule officielle M = (m₁×x + m₂×y + m₃×z) / (x + y + z) et tu calcules ta vraie moyenne de classement, filière par filière. La même personne n'a pas la même moyenne selon la filière visée.",
      lessons: [
        {
          title: "Capsule 2.1 — Ta série commande tes portes (7 min)",
          description:
            "C, D, B, A1/A2, G1-G3, E, F1-F4, EA, DT/DEAT : quelles familles de filières s'ouvrent à ta série — et lesquelles sont fermées.",
        },
        {
          title: "Capsule 2.2 — La vraie moyenne : celle du classement (10 min) ⭐",
          description:
            "La formule officielle avec exemples réels : Médecine BAC D = (SVT×5 + Maths×4 + PCT×4)/13. Un même bulletin, deux calculs, deux résultats.",
        },
        {
          title: "Capsule 2.3 — Trouver les matières retenues pour chaque filière (6 min)",
          description:
            "Lire la ligne de sa filière dans le guide officiel : Génie civil, ENEAM, FASEG, FADESP… — pas la rumeur du quartier.",
        },
        {
          title: "Capsule 2.4 — Aptitudes, projet et réalité du marché (7 min)",
          description:
            "Croiser aptitudes réelles, préférences et employabilité. Les 3 questions honnêtes et le projet rédigé en 5 lignes.",
        },
      ],
    },
    {
      tag: "Module 3",
      icon: "list" as IconName,
      title: "Choisir et hiérarchiser ses choix",
      pitch:
        "Dans ce module, on transforme une envie en liste de vœux stratégique. Tu vas apprendre à lire les 7 indicateurs affichés sous chaque filière (bourses, partiellement payant, inscrits par mention, total), à construire ta grille ambition / réaliste / sécurité, et à repérer les filières à petit effectif que personne ne regarde — souvent ton meilleur classement. Ta liste de vœux n'est pas un brouillon : c'est un contrat avec ton année.",
      lessons: [
        {
          title: "Capsule 3.1 — Lire les chiffres affichés sous chaque filière (9 min) ⭐",
          description:
            "Les 7 indicateurs décodés : combien de candidats sont au-dessus de ta mention ? Les chiffres bougent pendant toute la fenêtre — reviens les consulter.",
        },
        {
          title: "Capsule 3.2 — La grille ambition / réaliste / sécurité (8 min)",
          description:
            "Un choix = un rôle. Et la recommandation officielle : au moins une faculté classique dans sa liste. Zéro affectation = erreur de hiérarchisation, pas de niveau.",
        },
        {
          title: "Capsule 3.3 — Les filières que personne ne regarde (7 min)",
          description:
            "Hydrologie, géomatique, biotechnologies, aquaculture… 9 à 30 places, peu de candidats, débouchés listés noir sur blanc dans le guide.",
        },
        {
          title: "Capsule 3.4 — Changer d'université sans changer de rêve (6 min)",
          description:
            "La même famille de filière à Parakou, à l'UNSTIM ou à l'UNA : moins de pression, meilleur rang, meilleur statut de financement. Attention : changer de filière en cours d'année = perte de l'allocation.",
        },
      ],
    },
    {
      tag: "Module 4",
      icon: "wallet" as IconName,
      title: "Financer ses études : bourse, FPP, FEP",
      pitch:
        "Classé ne veut pas dire boursier. Le classement attribue trois statuts : bourse d'État, partiellement payant (FPP), entièrement payant (FEP) — et l'ordre est mécanique. Dans ce module, tu lis ton statut probable à l'avance dans les chiffres de la plateforme, tu anticipes le coût réel de ton année poste par poste, et tu prépares la demande d'allocation auprès de la DBAU. Le bon moment pour découvrir le coût, c'est en août — pas à la scolarité en novembre.",
      lessons: [
        {
          title: "Capsule 4.1 — Les trois statuts : bourse, FPP, FEP (7 min)",
          description:
            "Comment les statuts s'attribuent mécaniquement selon le classement, et comment lire son statut probable avant même de choisir.",
        },
        {
          title: "Capsule 4.2 — Le même diplôme, trois façons de le payer (6 min)",
          description:
            "Boursier, FPP ou FEP : c'est la même formation et le même diplôme. Le statut change ce que la famille paie, pas la valeur du parchemin.",
        },
        {
          title: "Capsule 4.3 — La demande d'allocation auprès de la DBAU (8 min)",
          description:
            "L'allocation n'est pas automatique : demande en ligne, fenêtre distincte de l'orientation, conditions d'éligibilité fixées par décret.",
        },
        {
          title: "Capsule 4.4 — Ton budget annuel réel (9 min)",
          description:
            "Scolarité, logement, transport, alimentation, matériel : chaque montant a une source écrite. Et les 3 phrases chiffrées à dire à tes parents.",
        },
      ],
    },
    {
      tag: "Module 5",
      icon: "map" as IconName,
      title: "Après le résultat : inscription, plan B, étranger",
      pitch:
        "Félicitations d'être arrivé jusqu'ici ! Quel que soit le résultat, tu ne restes jamais bloqué. Dossier physique prêt avant la publication, quatre voies de plan B si tu n'es pas classé (affectation obtenue, privé autorisé, formation professionnelle courte, télé-enseignement), les 5 signaux d'alerte contre les arnaques aux études à l'étranger, et tes trois premières semaines en LMD pour lancer ton année. On ne paie jamais une admission à un intermédiaire.",
      lessons: [
        {
          title: "Capsule 5.1 — Le dossier physique, prêt avant les résultats (7 min)",
          description:
            "Relevé, attestation du BAC, acte de naissance, certificat de nationalité, photos, certificat médical, photocopies légalisées ×3.",
        },
        {
          title: "Capsule 5.2 — Pas classé ? Les quatre voies du plan B (8 min)",
          description:
            "Accepter l'affectation, privé autorisé (vérifier l'autorisation avant de payer), formation courte, télé-enseignement. Le plan B s'écrit AVANT le résultat.",
        },
        {
          title: "Capsule 5.3 — L'étranger sans arnaque : les 5 signaux d'alerte (8 min)",
          description:
            "Bourses de coopération via la DBAU ou candidature directe. Jamais d'espèces sans reçu, jamais de « place garantie », jamais de pression.",
        },
        {
          title: "Capsule 5.4 — Réussir ses trois premières semaines en LMD (7 min)",
          description:
            "On valide des unités d'enseignement, pas une moyenne annuelle. Secrétariat pédagogique, maquette, calendrier des évaluations, groupe de travail.",
        },
      ],
    },
  ] as MemberModule[],
};
