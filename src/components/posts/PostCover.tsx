import Image from "next/image";
import { cn } from "@/lib/utils";

interface PostCoverProps {
  src?: string;
  title: string;
  className?: string;
}

export function PostCover({ src, title, className }: PostCoverProps) {
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-md bg-gradient-to-br from-accent-500/15 to-accent-700/25 text-xs font-semibold text-accent-700 dark:text-accent-300",
          className,
        )}
        aria-hidden
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={44}
      height={44}
      className={cn("rounded-md object-cover", className)}
    />
  );
}
