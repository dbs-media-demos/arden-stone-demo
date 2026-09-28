import Link from "next/link";
import clsx from "clsx";

export function Breadcrumbs({ items, className }: { items: { name: string; path: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={clsx("label text-faint", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-fg">
                  {it.name}
                </span>
              ) : (
                <>
                  <Link href={it.path} className="link-draw hover:text-fg">
                    {it.name}
                  </Link>
                  <span aria-hidden>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
