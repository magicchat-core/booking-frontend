// app/demos/[id]/page.jsx
import { getAllDemos, getDemo } from "@/demos";
import DemoView from "./DemoView";

export function generateStaticParams() {
  const demos = getAllDemos();
  return demos.map((demo) => ({
    id: demo.id,
  }));
}

export default function Page({ params }) {
  const demo = getDemo(params.id);
  
  if (!demo) {
    return <div style={{ padding: '2rem', color: 'white' }}>Demo not found</div>;
  }

  return <DemoView demo={demo} />;
}