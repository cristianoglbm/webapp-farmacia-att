import api from "./api";

export type FrontPacientePayload = {
  Nome_paciente?: string;
  CPF?: string;
  Telefone?: string | null;
  Email?: string | null;
  Data_Nascimento?: string | null;
  Genero?: string | null;
  Profissao?: string | null;
  // suporte a legado ou leitura
  nome_completo?: string;
  cpf?: string;
  data_nascimento?: string;
  genero?: string;
  profissao?: string;
};

const pacienteService = {
  listar: () => api.get("/paciente"),
  criar: (data: FrontPacientePayload) => api.post("/paciente", data),
  editar: (id: number, data: FrontPacientePayload) =>
    api.put(`/paciente/${id}`, data),
  deletar: (id: number) => api.delete(`/paciente/${id}`),
};

export default pacienteService;
