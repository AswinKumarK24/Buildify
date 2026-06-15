import { BuildifyEditor } from "@/components/editor/BuildifyEditor";

export default function DynamicEditorPage({ params }: { params: { id: string } }) {
  return <BuildifyEditor projectId={params.id} />;
}
