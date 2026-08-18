/**
 * ============================================================
 * CONTENU DU SITE — FICHIER UNIQUE À MODIFIER
 *
 * Quand le sujet de la formation change, on modifie UNIQUEMENT
 * ce fichier : tout le site (landing, checkout, espace membre)
 * se met à jour automatiquement.
 * ============================================================
 */

export interface Module {
  tag: string;
  emoji: string;
  title: string;
  points: string[];
}

export interface Video {
  module: string;
  title: string;
  description: string;
  /** URL de la vidéo (mp4, Vimeo ou YouTube embed). Vide = "à venir". */
  url?: string;
}

export const site = {
  brand: "FormationPro",
  topbar: "La formation vidéo la plus complète pour te lancer — Places limitées",

  hero: {
    badge: "Programme spécial — 100 % vidéo",
    title: "Ta Formation Vidéo Étape par Étape",
    subtitle:
      "Des vidéos claires et structurées pour apprendre à ton rythme, avec un accès membre sécurisé à vie. Chaque module te fait avancer concrètement, sans jargon et sans blabla.",
    videoLabel: "🔴 Regarde la vidéo ci-dessous 🔴",
    /** URL de la vidéo de vente (embed YouTube/Vimeo). Vide = placeholder. */
    videoUrl: "",
  },

  trust: ["Accès immédiat", "Garantie 7 jours", "Places limitées"],

  benefits: [
    {
      emoji: "🎥",
      title: "Des vidéos courtes et concrètes",
      text: "chaque leçon va droit au but, tu appliques immédiatement.",
    },
    {
      emoji: "🔒",
      title: "Un espace membre sécurisé",
      text: "tes vidéos sont hébergées dans un espace privé, accessible uniquement aux membres.",
    },
    {
      emoji: "♾️",
      title: "Un accès à vie",
      text: "tu avances à ton rythme et tu reviens quand tu veux, y compris sur les mises à jour.",
    },
  ],

  forWho: {
    title: "Pour qui est cette formation ?",
    items: [
      { emoji: "🎓", highlight: "débutants", text: "qui veulent apprendre depuis zéro avec une méthode claire." },
      { emoji: "💼", highlight: "salariés", text: "qui veulent monter en compétences sur leur temps libre." },
      { emoji: "🚀", highlight: "indépendants et entrepreneurs", text: "qui veulent des résultats concrets, rapidement." },
      { emoji: "📈", highlight: "ambitieux", text: "prêts à passer à l'action sérieusement." },
    ],
    note: "Tu n'as pas besoin d'être expert. Tu as juste besoin de vouloir avancer sérieusement.",
  },

  mistakes: {
    title: "Les erreurs qui t'empêchent d'avancer aujourd'hui",
    intro: "Tu as sûrement déjà essayé… mais :",
    items: [
      "Tu ne sais pas par où commencer.",
      "Tu regardes des tutos gratuits, mais sans méthode claire.",
      "Tu te perds dans la technique et les outils.",
      "Tu testes des choses sans résultats concrets.",
      "Tu doutes de toi parce que personne autour de toi ne l'a fait.",
    ],
    conclusion: "Résultat ? Tu stagnes.",
  },

  promise: {
    title: "La promesse de cette formation",
    items: [
      { emoji: "🎯", title: "Apprends étape par étape", text: "avec des vidéos structurées, du niveau débutant jusqu'au niveau avancé." },
      { emoji: "⚡", title: "Applique immédiatement", text: "grâce à des exercices concrets à la fin de chaque module." },
      { emoji: "🏆", title: "Obtiens des résultats mesurables", text: "avec une méthode simple, efficace et accessible." },
    ],
    note: "Sans compétence technique, sans gros budget. Une méthode pensée pour les réalités du terrain. Simple. Efficace. Accessible.",
  },

  modules: [
    {
      tag: "Module 1",
      emoji: "🧱",
      title: "Les Fondations",
      points: [
        "Comprendre les bases essentielles",
        "Définir ton objectif clairement",
        "Préparer tes outils",
        "Éviter les pièges du départ",
      ],
    },
    {
      tag: "Module 2",
      emoji: "⚙️",
      title: "L'Exécution",
      points: [
        "Mettre en pratique la méthode",
        "Créer tes premiers livrables",
        "Suivre les indicateurs clés",
        "Corriger et ajuster",
      ],
    },
    {
      tag: "Module 3",
      emoji: "🚀",
      title: "L'Accélération",
      points: [
        "Optimiser tes résultats",
        "Automatiser ce qui peut l'être",
        "Monter en puissance",
        "Construire sur le long terme",
      ],
    },
    {
      tag: "Bonus 1",
      emoji: "🎁",
      title: "Boîte à outils",
      points: ["Modèles prêts à l'emploi", "Check-lists téléchargeables", "Ressources recommandées"],
    },
    {
      tag: "Bonus 2",
      emoji: "🗺️",
      title: "Plan d'action",
      points: ["Ton planning semaine par semaine", "Les priorités dans le bon ordre", "De l'idée au résultat"],
    },
    {
      tag: "Inclus",
      emoji: "🔒",
      title: "Espace membre à vie",
      points: ["Toutes les vidéos en accès sécurisé", "Disponible 24h/24, 7j/7", "Mises à jour incluses"],
    },
  ] as Module[],

  pricing: {
    badge: "Offre de lancement",
    oldPrice: "30 000",
    price: "15 000",
    currency: "FCFA",
    note: "Paiement unique — accès à vie",
    features: [
      "Tous les modules vidéo",
      "Espace membre sécurisé à vie",
      "Les 2 bonus inclus",
      "Mises à jour gratuites",
      "Garantie satisfait ou remboursé 7 jours",
    ],
    paymentNote:
      "🔒 Paiement sécurisé (Mobile Money, Orange Money, Wave, carte bancaire) — Après ton achat, tu reçois immédiatement ton code d'accès à l'espace membre.",
  },

  paymentMethods: [
    { id: "orange", label: "Orange Money", emoji: "🟠" },
    { id: "mtn", label: "MTN Mobile Money", emoji: "🟡" },
    { id: "wave", label: "Wave", emoji: "🌊" },
    { id: "card", label: "Carte bancaire", emoji: "💳" },
  ],

  /** Vidéos de l'espace membre (visibles uniquement après connexion). */
  videos: [
    {
      module: "Module 1",
      title: "Leçon 1 — Bienvenue & fondations",
      description: "Commence ici : les bases, les objectifs et comment tirer le maximum de la formation.",
    },
    {
      module: "Module 1",
      title: "Leçon 2 — Préparer tes outils",
      description: "Tout ce qu'il faut installer et configurer avant de passer à l'action.",
    },
    {
      module: "Module 2",
      title: "Leçon 3 — Passer à l'exécution",
      description: "La méthode en pratique, étape par étape, avec un exemple complet.",
    },
    {
      module: "Module 3",
      title: "Leçon 4 — Accélérer tes résultats",
      description: "Optimisation, automatisation et montée en puissance.",
    },
  ] as Video[],
};
