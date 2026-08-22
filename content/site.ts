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
      text: "les 13 capsules vidéo et les exercices dans un espace privé, accessible uniquement aux membres, avec les mises à jour.",
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
      title: "Généralités et Panorama des Universités",
      duration: "3 capsules",
      promise: "Choisir l'établissement qui correspond à ton profil et à tes moyens.",
      points: [
        "Vue d'ensemble du paysage universitaire",
        "Universités publiques et réalité du terrain",
        "Les 05 grands critères qui conditionnent ton choix de filière",
      ],
    },
    {
      tag: "Module 2",
      icon: "monitor" as IconName,
      title: "Intégration, Bourses & Plateforme Apremonbac",
      duration: "3 capsules",
      promise: "Naviguer sur la plateforme officielle comme un pro.",
      points: [
        "Les régimes d'intégration : boursiers, secourus, partiellement et entièrement payants",
        "Prise en main complète de la plateforme Apremonbac",
        "Stratégies de classement des choix de filières sur la plateforme",
      ],
    },
    {
      tag: "Module 3",
      icon: "target" as IconName,
      title: "Cas pratique de deux relevés",
      duration: "3 capsules",
      promise: "Savoir chiffrer tes chances avant de choisir.",
      points: [
        "Comprendre comment se fait le choix",
        "Comment se fait le calcul de la moyenne pondérée",
        "Les erreurs fatales à éviter et comment faire son choix",
      ],
    },
    {
      tag: "Module 4",
      icon: "briefcase" as IconName,
      title: "Débouchés, filières et secteurs d'activités",
      duration: "4 capsules",
      promise: "Étudier pour un métier qui existera encore demain.",
      points: [
        "Les branches de filières possibles pour chaque série de BAC",
        "Les débouchés pour chaque filière",
        "Les secteurs d'activités en voie de disparition",
        "Les secteurs d'activités prometteurs à privilégier dans tes choix",
      ],
    },
    {
      tag: "Inclus",
      icon: "lock" as IconName,
      title: "Espace membre à vie",
      points: [
        "Les 13 capsules vidéo en accès sécurisé",
        "Exercices et cas pratiques",
        "Disponible 24h/24, 7j/7 — mises à jour incluses",
      ],
    },
  ] as Module[],

  pricing: {
    badge: "Offre de lancement",
    oldPrice: "30 000",
    price: "10 000",
    currency: "FCFA",
    note: "Paiement unique — accès à vie",
    features: [
      "Les 4 modules complets — 13 capsules vidéo",
      "Cas pratiques sur de vrais relevés de notes",
      "Le guide écran par écran de apresmonbac.bj",
      "Espace membre sécurisé à vie",
      "Mises à jour gratuites",
      "Garantie satisfait ou remboursé 7 jours",
    ],
    paymentNote:
      "Paiement sécurisé via FeexPay (MTN MoMo, Moov Money, Celtiis Cash, carte bancaire) — Après ton achat, tu reçois immédiatement ton code d'accès personnel par email.",
  },

  /** BONUS optionnel — page et tarif à part. */
  bonus: {
    badge: "Bonus exclusif — en option",
    title: "Bourses Extérieures & Accompagnement",
    subtitle:
      "Tu rêves d'étudier à l'étranger ? Ce bonus te montre exactement comment postuler pour les bourses extérieures (bourses de coopération, universités étrangères, organismes) — avec un accompagnement pour monter un dossier qui passe, sans te faire arnaquer par les intermédiaires.",
    points: [
      "Le panorama complet des bourses extérieures accessibles aux bacheliers béninois",
      "Comment monter un dossier qui passe : formulaire officiel, pièces, quittances au Trésor",
      "La candidature directe auprès des universités étrangères, sans intermédiaire",
      "Les 5 signaux d'alerte pour éviter les arnaques « admission garantie »",
      "Un accompagnement pour tes démarches",
    ],
    pitch:
      "Bienvenue dans le bonus ! Étudier à l'étranger, c'est possible — mais uniquement si tu passes par les bonnes portes. Dans ces capsules, je te montre les deux voies légitimes : les bourses de coopération gérées officiellement, et la candidature directe auprès des établissements. Tu vas apprendre à monter un dossier complet, à repérer les arnaques, et tu seras accompagné dans tes démarches.",
    lessons: [
      {
        title: "Bonus 1 — Le panorama des bourses extérieures",
        description: "Bourses de coopération, bourses d'universités, organismes : ce qui existe vraiment.",
      },
      {
        title: "Bonus 2 — Monter un dossier qui passe",
        description: "Formulaire officiel, copies légalisées, certificat médical, quittance au Trésor : la liste complète.",
      },
      {
        title: "Bonus 3 — La candidature directe à l'étranger",
        description: "Comment postuler toi-même auprès d'une université étrangère, sans intermédiaire.",
      },
      {
        title: "Bonus 4 — Éviter les arnaques + accompagnement",
        description: "Les 5 signaux d'alerte, et comment se déroule ton accompagnement personnalisé.",
      },
    ] as Lesson[],
    pricing: {
      oldPrice: "10 000",
      price: "5 000",
      currency: "FCFA",
      note: "Paiement unique — accès à vie · indépendant du programme principal",
    },
  },

  paymentMethods: [
    { id: "mtn", label: "MTN Mobile Money", icon: "smartphone" as IconName },
    { id: "moov", label: "Moov Money", icon: "wallet" as IconName },
    { id: "celtiis", label: "Celtiis Cash", icon: "wave" as IconName },
    { id: "card", label: "Carte bancaire", icon: "credit-card" as IconName },
  ],

  /** Espace membre : les 4 modules avec pitchs et capsules. */
  memberModules: [
    {
      tag: "Module 1",
      icon: "landmark" as IconName,
      title: "Généralités et Panorama des Universités",
      pitch:
        "Bienvenue dans ce premier module ! Choisir son université, c'est comme choisir le terrain sur lequel tu vas bâtir ton avenir. Entre le secteur public et le privé, les réalités sont totalement différentes : coûts, reconnaissance des diplômes, encadrement et opportunités. Dans ce module, nous allons décortiquer les avantages et inconvénients de chaque option pour que tu puisses choisir l'établissement qui correspond exactement à ton profil et à tes moyens.",
      lessons: [
        {
          title: "Leçon 1.1 — Vue d'ensemble du paysage universitaire",
          description: "Le panorama complet des établissements pour partir sur de bonnes bases.",
        },
        {
          title: "Leçon 1.2 — Universités publiques et réalité du terrain",
          description: "Coûts, encadrement, reconnaissance des diplômes : ce qui t'attend vraiment.",
        },
        {
          title: "Leçon 1.3 — Les 05 grands critères qui conditionnent ton choix de filière",
          description: "La grille de décision pour choisir selon ton profil et tes moyens.",
        },
      ],
    },
    {
      tag: "Module 2",
      icon: "monitor" as IconName,
      title: "Systèmes d'Intégration, Bourses & Plateforme Apremonbac",
      pitch:
        "Dans ce deuxième module, on entre dans le cœur du système. Avoir de bonnes notes ne suffit pas si tu ne sais pas naviguer sur les plateformes officielles. Je te montre exactement comment fonctionne le classement des choix, quelles sont les conditions pour obtenir une bourse ou un statut partiellement payant, et la stratégie exacte à adopter pour ne pas te retrouver sans filière à la rentrée.",
      lessons: [
        {
          title: "Leçon 2.1 — Les régimes d'intégration",
          description: "Boursiers, secourus, partiellement payants, entièrement payants.",
        },
        {
          title: "Leçon 2.2 — Prise en main complète de la plateforme Apremonbac",
          description: "La plateforme officielle expliquée écran par écran.",
        },
        {
          title: "Leçon 2.3 — Stratégies de classement des choix de filières",
          description: "Comment ordonner tes filières sur la plateforme pour maximiser tes chances.",
        },
      ],
    },
    {
      tag: "Module 3",
      icon: "target" as IconName,
      title: "Cas pratique de deux relevés",
      pitch:
        "Place à la pratique ! Dans ce module, on prend deux vrais relevés de notes et on déroule tout le processus sous tes yeux : comment se fait le choix, comment se calcule la moyenne pondérée, et surtout les erreurs fatales qui éliminent des candidats chaque année. À la fin, tu sauras faire exactement le même travail avec ton propre relevé.",
      lessons: [
        {
          title: "Leçon 3.1 — Comprendre comment se fait le choix",
          description: "Le processus de sélection déroulé pas à pas sur deux cas réels.",
        },
        {
          title: "Leçon 3.2 — Le calcul de la moyenne pondérée",
          description: "La méthode de calcul appliquée en direct sur les deux relevés.",
        },
        {
          title: "Leçon 3.3 — Les erreurs fatales à éviter et comment faire son choix",
          description: "Les pièges qui éliminent des candidats chaque année, et la bonne méthode.",
        },
      ],
    },
    {
      tag: "Module 4",
      icon: "briefcase" as IconName,
      title: "Débouchés, filières et secteurs d'activités",
      pitch:
        "Félicitations d'être arrivé jusqu'ici ! Étudier c'est bien, mais étudier pour un métier qui existera encore demain, c'est mieux. Dans ce dernier module, nous passons en revue les branches de filières possibles pour chaque série de BAC, leurs débouchés réels, les secteurs en voie de disparition à éviter et les secteurs prometteurs à privilégier dans tes choix.",
      lessons: [
        {
          title: "Leçon 4.1 — Les branches de filières possibles pour chaque série de BAC",
          description: "Série par série : ce qui s'ouvre à toi.",
        },
        {
          title: "Leçon 4.2 — Les débouchés pour chaque filière",
          description: "Les métiers concrets derrière chaque filière.",
        },
        {
          title: "Leçon 4.3 — Les secteurs d'activités en voie de disparition",
          description: "Les pièges : secteurs à éviter dans tes choix.",
        },
        {
          title: "Leçon 4.4 — Les secteurs d'activités prometteurs à privilégier",
          description: "Où se trouvent les vraies opportunités de demain.",
        },
      ],
    },
  ] as MemberModule[],
};
