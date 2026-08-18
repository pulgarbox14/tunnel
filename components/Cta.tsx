import Link from "next/link";

export function Cta({
  href,
  label,
  sub,
  block = false,
}: {
  href: string;
  label: string;
  sub: string;
  block?: boolean;
}) {
  return (
    <Link href={href} className={`btn-cta${block ? " btn-block" : ""}`}>
      {label}
      <small>{sub}</small>
    </Link>
  );
}
