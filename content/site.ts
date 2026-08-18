import type { IconName } from "@/components/Icon";

/**
 * ============================================================
 * CONTENU DU SITE — FICHIER UNIQUE À MODIFIER
 *
 * Thème : Orientation et accompagnement des nouveaux bacheliers
 * Titre : Cap sur monAvenir — Réussir Son Post-BAC
 * ============================================================
 */

export interface Module {
  tag: string;
  icon: IconName;
  title: string;
  points: string[];
}

export interface Lesson {
  title: string;
  description: string;
  /** URL de la vidéo (mp4, Vimeo ou YouTube embed). Vide = "à venir". */
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

export const site = {
  brand: "Cap sur monAvenir",
  topbar: "Le programme d'orientation n°1 pour les nouveaux bacheliers — Places limitées",

  hero: {
    badge: "Spécial nouveaux bacheliers",
    title: "Réussir Son Post-BAC",
    subtitle:
      "Tu viens d'avoir ton BAC ? Félicitations. Maintenant, tout se joue : choix de l'université, bourses, classement des filières sur Apremonbac, métiers d'avenir. Cette formation vidéo t'accompagne pas à pas pour faire les bons choix, avec un accès membre sécurisé à vie.",
    videoLabel: "Regarde la vidéo ci-dessous",
    /** URL de la vidéo de vente (embed YouTube/Vimeo). Vide = placeholder. */
    videoUrl: "",
  },

  trust: ["Accès immédiat", "Garantie 7 jours", "Places limitées"],

  benefits: [
    {
      icon: "compass" as IconName,
      title: "Une orientation claire",
      text: "tu choisis ta filière et ton université en connaissance de cause, pas au hasard.",
    },
    {
      icon: "monitor" as IconName,
      title: "La maîtrise d'Apremonbac",
      text: "prise en main complète de la plateforme officielle, stratégie de classement des choix incluse.",
    },
    {
      icon: "lock" as IconName,
      title: "Un espace membre sécurisé à vie",
      text: "toutes les vidéos dans un espace privé, accessible uniquement aux membres, avec les mises à jour.",
    },
  ],

  forWho: {
    title: "Pour qui est ce programme ?",
    items: [
      {
        icon: "graduation-cap" as IconName,
        highlight: "nouveaux bacheliers",
        text: "qui veulent faire le bon choix d'orientation dès la première fois.",
      },
      {
        icon: "users" as IconName,
        highlight: "parents",
        text: "qui veulent accompagner leur enfant vers la bonne filière et la bonne université.",
      },
      {
        icon: "book-open" as IconName,
        highlight: "étudiants en réorientation",
        text: "qui veulent repartir sur de bonnes bases sans perdre une année de plus.",
      },
      {
        icon: "target" as IconName,
        highlight: "ambitieux",
        text: "prêts à construire un plan de carrière solide dès maintenant.",
      },
    ],
    note: "Tu n'as pas besoin d'être le premier de ta promo. Tu as juste besoin d'une méthode claire pour décider.",
  },

  mistakes: {
    title: "Les erreurs qui coûtent cher aux nouveaux bacheliers",
    intro: "Chaque année, des milliers de bacheliers se plantent… parce que :",
    items: [
      "Ils choisissent leur filière au hasard, ou pour suivre les amis.",
      "Ils ne comprennent pas le fonctionnement d'Apremonbac et de son algorithme de sélection.",
      "Ils passent à côté des bourses et des statuts avantageux, faute d'information.",
      "Ils s'engagent dans des filières sans débouchés, ou menacées par l'IA.",
      "Ils font des erreurs éliminatoires et se retrouvent sans filière à la rentrée.",
    ],
    conclusion: "Résultat ? Un avenir joué à pile ou face.",
  },

  promise: {
    title: "La promesse de Cap sur monAvenir",
    items: [
      {
        icon: "compass" as IconName,
        title: "Choisis la bonne université",
        text: "— public ou privé, tu sauras faire l'arbitrage selon ton profil et tes moyens.",
      },
      {
        icon: "award" as IconName,
        title: "Maximise tes chances de bourse",
        text: "— régimes d'intégration, stratégie de classement des choix, erreurs éliminatoires à éviter.",
      },
      {
        icon: "cpu" as IconName,
        title: "Prépare un métier d'avenir",
        text: "— débouchés réels par filière et impact de l'IA : tu armes ton profil pour rester compétitif.",
      },
    ],
    note: "Une méthode pensée pour les réalités du terrain. Simple. Efficace. Accessible.",
  },

  modules: [
    {
      tag: "Module 1",
      icon: "landmark" as IconName,
      title: "Généralités et Panorama des Universités",
      points: [
        "Vue d'ensemble du paysage universitaire",
        "Universités publiques : avantages, défis et réalités du terrain",
        "Universités privées : modalités, atouts et critères d'accréditation",
        "Comparatif direct : Public vs Privé — faire le bon arbitrage",
      ],
    },
    {
      tag: "Module 2",
      icon: "monitor" as IconName,
      title: "Intégration, Bourses & Apremonbac",
      points: [
        "Les régimes d'intégration : boursiers, secourus, partiellement et entièrement payants",
        "Prise en main complète de la plateforme Apremonbac",
        "Stratégies de classement des choix de filières",
        "Comprendre l'algorithme de sélection et éviter les erreurs éliminatoires",
      ],
    },
    {
      tag: "Module 3",
      icon: "cpu" as IconName,
      title: "Débouchés Métiers & Impact de l'IA",
      points: [
        "Cartographie des filières et opportunités sur le marché de l'emploi",
        "L'impact de l'IA : filières menacées vs filières émergentes",
        "Adapter son parcours pour rester compétitif face à l'IA",
        "Bâtir son plan de carrière académique et professionnel",
      ],
    },
    {
      tag: "Inclus",
      icon: "lock" as IconName,
      title: "Espace membre à vie",
      points: [
        "Les 12 leçons vidéo en accès sécurisé",
        "Disponible 24h/24, 7j/7",
        "Mises à jour incluses",
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
      "Les 3 modules complets (12 leçons vidéo)",
      "Guide pas à pas de la plateforme Apremonbac",
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

  /** Espace membre : modules avec pitch vidéo et leçons. */
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
          title: "Leçon 1.2 — Universités publiques",
          description: "Avantages, défis et réalités du terrain.",
        },
        {
          title: "Leçon 1.3 — Universités privées",
          description: "Modalités, atouts et critères d'accréditation.",
        },
        {
          title: "Leçon 1.4 — Comparatif direct : Public vs Privé",
          description: "Comment faire le bon arbitrage selon ton profil et tes moyens.",
        },
      ],
    },
    {
      tag: "Module 2",
      icon: "monitor" as IconName,
      title: "Systèmes d'Intégration, Bourses & Plateforme Apremonbac",
      pitch:
        "Dans ce deuxième module, on entre dans le cœur du système. Avoir de bonnes notes ne suffit pas si tu ne sais pas naviguer sur les plateformes officielles. Je te montre exactement comment fonctionne le classement des choix sur Apremonbac, quelles sont les conditions pour obtenir une bourse ou un statut partiellement payant, et la stratégie exacte à adopter pour ne pas te retrouver sans filière à la rentrée. Suis-moi pas à pas sur l'écran !",
      lessons: [
        {
          title: "Leçon 2.1 — Les régimes d'intégration",
          description: "Boursiers, secourus, partiellement payants, entièrement payants.",
        },
        {
          title: "Leçon 2.2 — Prise en main complète d'Apremonbac",
          description: "La plateforme officielle expliquée écran par écran.",
        },
        {
          title: "Leçon 2.3 — Stratégies de classement des choix",
          description: "Comment ordonner tes filières pour maximiser tes chances.",
        },
        {
          title: "Leçon 2.4 — L'algorithme de sélection",
          description: "Comprendre la sélection et éviter les erreurs éliminatoires.",
        },
      ],
    },
    {
      tag: "Module 3",
      icon: "cpu" as IconName,
      title: "Débouchés Métiers & Impact de l'Intelligence Artificielle",
      pitch:
        "Félicitations d'être arrivé jusqu'ici ! Étudier c'est bien, mais étudier pour un métier qui existera encore demain, c'est mieux. L'Intelligence Artificielle transforme le marché du travail à une vitesse folle. Dans ce dernier module, nous allons analyser les débouchés réels de chaque filière et identifier celles qui sont menacées ou renforcées par l'IA. Tu sauras exactement comment armer ton profil pour devenir indispensable sur le marché du travail.",
      lessons: [
        {
          title: "Leçon 3.1 — Cartographie des filières",
          description: "Les opportunités réelles sur le marché de l'emploi, filière par filière.",
        },
        {
          title: "Leçon 3.2 — L'impact de l'IA sur les métiers d'avenir",
          description: "Filières menacées vs filières émergentes.",
        },
        {
          title: "Leçon 3.3 — Rester compétitif face à l'IA",
          description: "Comment adapter ton parcours dès maintenant.",
        },
        {
          title: "Leçon 3.4 — Bâtir son plan de carrière",
          description: "Ton plan académique et professionnel, étape par étape.",
        },
      ],
    },
  ] as MemberModule[],
};
