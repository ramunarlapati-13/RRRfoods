import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Heritage Box – Build Your Custom Telugu Gift Box | RRR Foods',
  description: 'Mix & match authentic Telugu pickles and sweets into a beautiful custom gift box. Drag and drop to build your Heritage Box.',
};
export default function SamplerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
