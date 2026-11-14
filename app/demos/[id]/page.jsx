import dynamic from 'next/dynamic';
import { getAllDemos } from '@/demos'; // ⭐ Import Registry

const DemoDetail = dynamic(() => import('@/views/DemoDetail'), { ssr: false });

// ⭐ Dynamically generate the routes based on the demos we have
export function generateStaticParams() {
  const demos = getAllDemos();
  return demos.map((d) => ({ id: d.id }));
}

export default function Page({ params }) {
  return <DemoDetail id={params.id} />;
}