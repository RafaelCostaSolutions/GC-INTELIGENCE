// Setor Laboratório › WhatsApp e Comunicação
export function waPrepFor(exam: string) {
  const e = exam.toLowerCase();
  if (e.includes("glicemia")) return "Jejum de 8 horas. Não ingerir bebida alcoólica 24 h antes. Manter a medicação habitual, salvo orientação médica. Levar documento com foto e carteirinha.";
  if (e.includes("hemoglobina")) return "Jejum não obrigatório. Informar uso de suplementos de ferro. Levar documento com foto e carteirinha.";
  if (e.includes("hemograma")) return "Jejum não obrigatório. Evitar exercício intenso 2 h antes da coleta. Levar documento com foto.";
  if (e.includes("urina") || e.includes("eas") || e.includes("urocultura")) return "Coletar a primeira urina da manhã em frasco estéril, após higiene íntima. Não coletar durante o uso de antibiótico, salvo orientação médica.";
  if (e.includes("colesterol")) return "Jejum de 8 a 12 horas. Evitar bebida alcoólica 24 h antes da coleta.";
  if (e.includes("ultrassom") || e.includes("tomografia") || e.includes("ressonância") || e.includes("raio")) return "Chegar 15 min antes. Seguir o jejum indicado para o exame de imagem. Informar alergia a contraste, possível gestação, marca-passo ou próteses.";
  if (e.includes("tsh") || e.includes("estradiol") || e.includes("vitamina")) return "Jejum não obrigatório. Coletar preferencialmente pela manhã. Informar uso de suplementos e fase do ciclo, quando aplicável.";
  return "Seguir o preparo informado no pedido. Levar documento com foto e carteirinha. Em dúvida, responder a esta conversa.";
}

export function waPostFor(exam: string) {
  const e = exam.toLowerCase();
  if (e.includes("urina") || e.includes("eas")) return "Após a coleta de urina: manter higiene íntima, beber água normalmente e observar o curativo, se houver. Procurar o Laboratório se houver febre, dor ao urinar ou sangramento.";
  if (e.includes("ultrassom") || e.includes("tomografia") || e.includes("ressonância") || e.includes("raio")) return "Após o exame de imagem: repouso leve, beber bastante água (principalmente se houve contraste) e observar o local do exame. Procurar atendimento se houver reação, falta de ar ou inchaço.";
  return "Após a coleta de sangue: manter o curativo por 2 horas, não carregar peso com o braço da coleta, beber bastante água e fazer repouso leve. Se o local inchar, sangrar ou doer muito, responder a esta conversa ou procurar o Laboratório.";
}
