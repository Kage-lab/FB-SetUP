
import dynamic from 'next/dynamic';
const GrowthAssistantApp = dynamic(() => import('../components/GrowthAssistantApp'), { ssr: false });
export default function Home() {
  return <GrowthAssistantApp />;
}
