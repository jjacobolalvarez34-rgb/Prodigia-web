import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// Primitiva de botón al estilo shadcn, sin class-variance-authority ni Radix:
// las variantes son un objeto. Para enlaces con aspecto de botón se usa
// buttonVariants() sobre <a>, <Link> o <EnlaceExterno>.

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-display font-semibold tracking-tight whitespace-nowrap select-none transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-entrar active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variantes = {
  // Degradado de marca: uno por pantalla (DISENO.md §1.1). Texto fondo-hondo:
  // ≥ 4.6:1 incluso sobre el extremo violeta.
  primario:
    "bg-[linear-gradient(120deg,var(--color-violeta),var(--color-oro-claro))] text-fondo-hondo shadow-[0_0_24px_rgb(124_92_255/0.3)] hover:shadow-[0_0_32px_rgb(255_197_61/0.35)]",
  secundario: "border border-borde bg-sup-2 text-texto hover:border-violeta/60 hover:bg-sup-3",
  fantasma: "text-texto-2 hover:text-texto",
} as const;

const tamanos = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-12 px-7 text-base",
} as const;

export type VarianteBoton = keyof typeof variantes;
export type TamanoBoton = keyof typeof tamanos;

export function buttonVariants({
  variant = "primario",
  size = "md",
  className,
}: { variant?: VarianteBoton; size?: TamanoBoton; className?: string } = {}) {
  return cn(base, variantes[variant], tamanos[size], className);
}

type Props = ComponentProps<"button"> & { variant?: VarianteBoton; size?: TamanoBoton };

export function Button({ variant, size, className, type = "button", ...props }: Props) {
  return <button type={type} className={buttonVariants({ variant, size, className })} {...props} />;
}
