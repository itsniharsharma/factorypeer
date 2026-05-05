"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEventHandler, ReactNode } from "react";

type PrefetchLinkProps = LinkProps & {
  className?: string;
  children: ReactNode;
  prefetchOnHover?: boolean;
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement>;
};

export function PrefetchLink({ prefetchOnHover = true, onMouseEnter, ...props }: PrefetchLinkProps) {
  const router = useRouter();

  return (
    <Link
      {...props}
      prefetch
      onMouseEnter={(event) => {
        if (prefetchOnHover) {
          router.prefetch(typeof props.href === "string" ? props.href : String(props.href));
        }
        onMouseEnter?.(event);
      }}
    />
  );
}

export default PrefetchLink;