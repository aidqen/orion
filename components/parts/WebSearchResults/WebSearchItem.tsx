'use client';

import Image from 'next/image';
import Link from 'next/link';

interface WebSearchResultItemProps {
  title: string;
  url: string;
}

export function WebSearchResultItem({ title, url }: WebSearchResultItemProps) {
  const domain = new URL(url).hostname;

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-2 py-1.5 hover:bg-bg-100 rounded text-sm sm:max-w-full"
    >
      <Image
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
        alt=""
        width={16}
        height={16}
        className="size-4"
        unoptimized
      />
      <span className="truncate text-text-300 sm:max-w-full">{title}</span>
    </Link>
  );
}
