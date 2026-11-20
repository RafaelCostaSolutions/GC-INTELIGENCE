// Setor Clínica › Procedimentos e Estrutura
export const ESTRUTURA_ROOMS = ["Consultório 1", "Consultório 2", "Consultório 3", "Sala de Procedimentos", "Sala de Curativos"];

export const ESTRUTURA_EQUIP = ["Nenhum", "Ultrassom U-02", "Eletrocardiógrafo E-03", "Dermatoscópio D-01", "Autoclave — Clínica", "Monitor M-09", "Foco cirúrgico"];

export const ESTRUTURA_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export const ESTRUTURA_PROC_TYPES = ["Sutura", "Biópsia", "Retirada de lesão", "Infiltração", "Curativo complexo", "Outro procedimento"];

export const CLEAN_ITEMS = ["Desinfecção de superfícies", "Troca de lençol / campo", "Descarte de resíduos", "Higienização de equipamentos", "Reposição de material", "Ventilação e organização"];

export const CONSENT_TEMPLATES: Record<string, { text: string; pre: string[]; post: string[] }> = {
  "Procedimento": { text: "Eu, paciente abaixo identificado, declaro que fui informado(a) sobre o procedimento, seus benefícios, riscos, alternativas e cuidados necessários, e autorizo a sua realização pela equipe da Clínica, conforme descrito neste termo.", pre: ["Chegar 30 minutos antes do horário agendado.", "Trazer documento com foto e carteirinha do convênio.", "Informar alergias, medicamentos em uso e doenças.", "Seguir o jejum ou preparo orientado pela equipe, quando indicado."], post: ["Manter o curativo limpo e seco conforme orientação.", "Observar sinais de alerta: febre, dor intensa, sangramento ou secreção.", "Comparecer ao retorno agendado e manter o acompanhamento.", "Procurar a Clínica se houver qualquer piora ou dúvida."] },
  "Anestesia": { text: "Eu, paciente abaixo identificado, declaro que fui informado(a) sobre o tipo de anestesia, seus benefícios, riscos e alternativas, e autorizo a sua aplicação pela equipe da Clínica para a realização do procedimento indicado.", pre: ["Informar alergias, uso de medicamentos e jejum realizado.", "Chegar acompanhado(a), quando orientado pela equipe.", "Trazer exames e receitas em uso.", "Não dirigir ou operar máquinas após a anestesia, se orientado."], post: ["Permanecer em repouso e observação pelo tempo orientado.", "Manter acompanhante até a liberação pela equipe.", "Observar sonolência, náusea, dor ou sangramento e avisar a equipe.", "Seguir a prescrição e comparecer ao retorno agendado."] },
  "Uso de imagem": { text: "Eu, paciente abaixo identificado, autorizo o uso da imagem da região tratada, sem identificação, exclusivamente para registro no prontuário e acompanhamento clínico, podendo revogar esta autorização a qualquer momento.", pre: ["Confirmar que a imagem será usada apenas para o prontuário e acompanhamento.", "Informar se há alguma restrição quanto ao registro da imagem.", "Assinar este termo antes do registro fotográfico."], post: ["A imagem fica arquivada no prontuário, sem identificação pública.", "O paciente pode pedir a revogação do uso a qualquer momento.", "Qualquer outro uso depende de nova autorização expressa."] },
};
