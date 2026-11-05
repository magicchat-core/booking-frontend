import dynamic from 'next/dynamic';

// 1. Dynamically import with ssr: false so it only runs in the browser
const DemoDetail = dynamic(() => import('@/views/DemoDetail'), { ssr: false });

// 2. Tell Next.js which IDs to generate
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

// 3. Pass the Next.js params as props
export default function Page({ params }) {
  return <DemoDetail id={params.id} />;
}