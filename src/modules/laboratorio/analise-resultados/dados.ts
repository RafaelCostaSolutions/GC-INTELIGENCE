// Setor Laboratório › Análise e Resultados
export const LAB_REPORT_MODELS: Record<string, { methodology: string; layout: string; extra: string }> = {
  "Hematologia": { methodology: "Contagem automatizada", layout: "Série vermelha · Série branca · Plaquetas", extra: "Contagem diferencial e índices hematimétricos." },
  "Bioquímica": { methodology: "Enzimático / HPLC", layout: "Resultado · Unidade · Referência · Flag", extra: "Jejum e medicação em uso registrados na amostra." },
  "Hormonal": { methodology: "Quimioluminescência", layout: "Resultado · Faixa por sexo/idade · Referência", extra: "Fase do ciclo e uso de suplementos, quando aplicável." },
  "Imunologia": { methodology: "Nefelometria / Quimioluminescência", layout: "Resultado · Interpretação · Referência", extra: "Sorologia com interpretação reagente / não reagente." },
  "Microbiologia": { methodology: "Cultura", layout: "Microrganismo · Antibiograma · Interpretação", extra: "Antibiograma com sensível / resistente por antibiótico." },
  "Urinálise": { methodology: "Tiras + microscopia", layout: "Exame físico · Químico · Sedimento", extra: "Aspecto, densidade, pH e sedimento urinário." },
  "Parasitologia": { methodology: "Microscopia", layout: "Amostras · Parasitos · Interpretação", extra: "Resultado por amostra coletada." },
  "Imagem": { methodology: "Radiografia digital / Ultrassonografia", layout: "Achados · Conclusão · Recomendação", extra: "Descrição do exame de imagem e conclusão." },
};

export const LAB_BIOQUIMICOS = ["Dra. Beatriz Almeida — Bioquímica (CRBio 12345)", "Dr. Carlos Menezes — Bioquímico (CRBio 23456)", "Dra. Fernanda Costa — Bioquímica (CRBio 34567)"];
