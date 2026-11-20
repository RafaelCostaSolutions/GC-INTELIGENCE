import { FlaskConical, HeartPulse } from "lucide-react";

export function sectorIcon(id: string) {
  if (id === "laboratorio") return <FlaskConical size={17} />;
  return <HeartPulse size={17} />;
}
