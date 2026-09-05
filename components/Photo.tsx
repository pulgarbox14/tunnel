/**
 * Photo affichée ENTIÈRE dans son cadre, quelle que soit sa forme.
 *
 * Une capture d'écran verticale, une photo paysage ou carrée s'affichent
 * toutes sans être recadrées : rien n'est jamais coupé. L'espace restant
 * dans le cadre est rempli par la même image floutée, ce qui garde un
 * rendu net et volontaire plutôt que des bandes vides.
 *
 * À utiliser dans un conteneur en `position: relative` et `overflow: hidden`
 * (.photo-frame, .result-card .media).
 */
export function Photo({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" aria-hidden="true" className="media-blur" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="media-main" />
    </>
  );
}
