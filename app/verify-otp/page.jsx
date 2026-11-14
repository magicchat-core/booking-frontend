import dynamic from 'next/dynamic';
const VerifyOtp = dynamic(() => import('@/views/VerifyOtp'), { ssr: false });
export default function Page() { return <VerifyOtp />; }