import { RequestDetailScreen } from "@/components/screens/RequestDetailScreen";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RequestDetailPage({ params }: Props) {
  const { id } = await params;
  return <RequestDetailScreen requestId={Number(id)} />;
}
