import { RunFormPage } from "@/components/runs";

interface Props {
  params: Promise<{
    runId: string;
  }>;
}

export default async function EditRunPage({ params }: Props) {
  const { runId } = await params;
  return <RunFormPage runId={runId} />;
}
