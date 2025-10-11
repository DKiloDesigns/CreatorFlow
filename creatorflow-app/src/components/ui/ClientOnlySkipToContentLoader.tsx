'use client';

import dynamic from "next/dynamic";

const ClientOnlySkipToContent = dynamic(() => import('./ClientOnlySkipToContent'), { ssr: false });

export default function ClientOnlySkipToContentLoader() {
  return <ClientOnlySkipToContent />;
}
