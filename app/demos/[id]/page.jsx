import DemoDetail from '@/pages/DemoDetail';

// This is required for static export (GitHub Pages)
export function generateStaticParams() {
  // Return an array of IDs to pre-render.
  // For example, if you want to generate /demos/1, /demos/2, /demos/3:
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
  
  // Alternatively, if you just want a single placeholder for now to get the build passing:
  // return [{ id: 'placeholder' }]; 
}

export default function Page() { return <DemoDetail />; }