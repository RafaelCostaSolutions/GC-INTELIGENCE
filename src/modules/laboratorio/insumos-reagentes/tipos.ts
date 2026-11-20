// Setor Laboratório › Controle de Insumos e Reagentes
export type LabReagente = { id: string; nome: string; fabricante: string; area: string; unidade: string; custoUnit: number; estoqueMin: number; pontoReposicao: number; condicao: string; teoricoPorExame: number; recordId?: string };

export type LabLote = { id: string; reagenteId: string; codigo: string; validade: string; qty: number; qtyInicial: number; fornecedor: string; notaFiscal: string; local: string; condicaoRecebida: string; bloqueado: boolean; motivoBloqueio: string; recordId?: string };

export type LabMov = { id: string; tipo: "entrada" | "saida" | "perda"; reagenteId: string; loteId: string; qty: number; data: string; exame: string; equipamento: string; bancada: string; pacienteId: string; pacienteNome: string; responsavel: string; motivo: string; valor: number; recordId?: string };

export type LabCompra = { id: string; reagenteId: string; qty: number; motivo: string; data: string; status: string; recordId?: string };
