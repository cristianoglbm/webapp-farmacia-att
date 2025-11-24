"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import NavBar from "../components/navBar";
import TopBar from "../components/topBar";
import Button from "../components/button";
import api from "../services/api";

type Paciente = {
  id: number;
  nome_completo: string;
};

export default function CadastroTratamento() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteId, setPacienteId] = useState<number | "">("");
  const [Diagnostico, setDiagnostico] = useState("");
  const [Data_inicio, setDataInicio] = useState("");
  const [Data_termino, setDataTermino] = useState("");
  const [Status, setStatus] = useState("Nao_iniciado");
  const [Observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "erro" | "sucesso";
    texto: string;
  } | null>(null);

  // carregar pacientes
  useEffect(() => {
    api
      .get("/paciente")
      .then((res) =>
        setPacientes(
          res.data.map((p: any) => ({
            id: Number(p.ID ?? p.id),
            nome_completo:
              p.Nome_paciente ?? p.nome_completo ?? p.nome ?? "Sem Nome",
          }))
        )
      )
      .catch((err) => console.error("Erro ao buscar pacientes:", err));
  }, []);

  function formatarDataDisplay(dataISO: string) {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setMensagem(null);
    setLoading(true);

    try {
      const payload = {
        pacienteId: Number(pacienteId),
        paciente_id: Number(pacienteId),
        Diagnostico,
        Data_inicio,
        Data_termino: Data_termino || undefined,
        Status,
        Observacoes: Observacoes || undefined,
      };

      await api.post("/tratamento", payload);

      setMensagem({
        tipo: "sucesso",
        texto: `Tratamento cadastrado com sucesso!
Paciente: ${
          pacientes.find((p) => p.id === Number(pacienteId))?.nome_completo ||
          "Desconhecido"
        }
Diagnóstico: ${Diagnostico}
Data início: ${formatarDataDisplay(Data_inicio)}`,
      });

      setPacienteId("");
      setDiagnostico("");
      setDataInicio("");
      setDataTermino("");
      setStatus("Nao_iniciado");
      setObservacoes("");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setMensagem({
        tipo: "erro",
        texto:
          axiosError.response?.data?.message || "Erro ao salvar tratamento.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white h-screen flex flex-row overflow-hidden ml-[288px]">
      <NavBar />
      <div className="flex flex-col flex-1">
        <TopBar title="Cadastrar Tratamento" />
        <main className="flex flex-1 items-center justify-center p-4 overflow-y-auto bg-gray-100">
          <div className="bg-white w-full max-w-lg mt-16 rounded-[20px] shadow-sm overflow-hidden">
            <div className="bg-blue-900 h-10 w-full"></div>
            <div className="p-8">
              <form onSubmit={handleSalvar} className="flex flex-col gap-6">
                <label className="flex flex-col">
                  <span className="text-blue-900 font-semibold mb-2">
                    Paciente
                  </span>
                  <select
                    required
                    value={String(pacienteId)}
                    onChange={(e) =>
                      setPacienteId(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="" disabled>
                      Selecione o paciente
                    </option>
                    {pacientes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome_completo}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col">
                  <span className="text-blue-900 font-semibold mb-2">
                    Diagnóstico
                  </span>
                  <input
                    required
                    value={Diagnostico}
                    onChange={(e) => setDiagnostico(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-blue-900 font-semibold mb-2">
                      Data início
                    </span>
                    <input
                      required
                      type="date"
                      value={Data_inicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className="text-blue-900 font-semibold mb-2">
                      Data término
                    </span>
                    <input
                      type="date"
                      value={Data_termino}
                      onChange={(e) => setDataTermino(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                  </label>
                </div>

                <label className="flex flex-col">
                  <span className="text-blue-900 font-semibold mb-2">
                    Status
                  </span>
                  <select
                    value={Status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="Nao_iniciado">Não iniciado</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Pausado">Pausado</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Concluido">Concluído</option>
                  </select>
                </label>

                <label className="flex flex-col">
                  <span className="text-blue-900 font-semibold mb-2">
                    Observações
                  </span>
                  <textarea
                    value={Observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                    rows={3}
                  />
                </label>

                {mensagem && (
                  <div
                    className={`p-3 text-center rounded font-semibold ${
                      mensagem.tipo === "sucesso"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {mensagem.texto}
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Button
                    text="Voltar"
                    type="button"
                    onClick={() => router.push("/tratamento")}
                  />
                  <Button
                    text={loading ? "Salvando..." : "Salvar"}
                    type="submit"
                  />
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
