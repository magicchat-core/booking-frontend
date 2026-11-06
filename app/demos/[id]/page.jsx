import dynamic from 'next/dynamic';

const DemoDetail = dynamic(() => import('@/views/DemoDetail'), { ssr: false });

export function generateStaticParams() {
  return [
    { id: 'demo1' },
    { id: 'demo2' },
    { id: 'demo3' },
  ];
}

export default function Page({ params }) {
  return <DemoDetail id={params.id} />;
}