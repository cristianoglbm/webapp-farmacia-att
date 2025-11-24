export interface TitleProps {
  title: string;
}

export interface Horario {
  id: number;
  horario: string;
}

export interface Tratamento {
  id: number;
  paciente_id: number;
  farmaceutico_id: number;
  horario_id: number;
  data_consulta: string;
  status?: string;
}

export interface Evento {
  id: number;
  title: string;
  start: string;
  paciente_id: number;
  horario_id: number;
  farmaceutico_id: number;
  status?: string;
}

export interface Paciente {
  id: number;
  nome_completo: string;
  cpf: string;
  telefone: string;
  genero?: string;
  email?: string;
  data_nascimento?: string;
  profissao?: string;
}

export interface Farmaceutico {
  id: number;
  nome_completo: string;
  cpf: string;
  telefone: string;
}

export interface Medicamento {
  ID: number;
  id?: number;
  Nome_Medicamento?: string;
  nome?: string;
  dosagem?: string;
  Dosagem?: string;
  tipo?: string;
  Tipo?: string;
  tarja?: string;
  Tarja?: string;
  via_consumo?: string;
  Via_Consumo?: string;
  viaConsumo?: string;
  mg_ml?: string;
  Mg_Ml?: string;
  alertas?: string;
  Alertas?: string;
  principio_ativo?: string;
  Principio_Ativo?: string;
  principioAtivo?: string;
}
