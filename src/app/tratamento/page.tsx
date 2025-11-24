"use client";

import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { UserIcon as UserIconSolid } from "@heroicons/react/24/solid";
import { Pill, Syringe } from "lucide-react";

import NavBar from "../components/navBar";
import TopBar from "../components/topBar";
import api from "../services/api";
import { Medicamento } from "../interfaces/types";

type TratamentoFront = {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  Diagnostico: string;
  Data_inicio?: string;
  Data_termino?: string;
  Status: string;
  Observacoes?: string;
};

export default function PaginaTratamento() {
  const [tratamentos, setTratamentos] = useState<TratamentoFront[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para o novo fluxo de cadastro
  const [isPatientSelectionOpen, setIsPatientSelectionOpen] = useState(false);
  const [isTreatmentSelectionOpen, setIsTreatmentSelectionOpen] =
    useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{
    id: number;
    nome_completo: string;
  } | null>(null);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [selectedMedicamentos, setSelectedMedicamentos] = useState<number[]>(
    []
  );
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [successPopupData, setSuccessPopupData] = useState<Medicamento | null>(
    null
  );
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [treatmentToDelete, setTreatmentToDelete] =
    useState<TratamentoFront | null>(null);

  // Mantendo o modal de edição antigo apenas para edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTratamento, setEditingTratamento] =
    useState<TratamentoFront | null>(null);

  const [form, setForm] = useState({
    pacienteId: "",
    Diagnostico: "",
    Data_inicio: "",
    Data_termino: "",
    Status: "Nao_iniciado",
    Observacoes: "",
  });

  const [pacientes, setPacientes] = useState<
    { id: number; nome_completo: string }[]
  >([]);

  useEffect(() => {
    fetchTratamentos();
    fetchPacientes();
    fetchMedicamentos();
  }, []);

  async function fetchTratamentos() {
    setLoading(true);
    try {
      const res = await api.get("/tratamento");
      setTratamentos(
        res.data.map((t: any) => ({
          id: t.ID ?? t.id,
          pacienteId:
            t.paciente?.ID ??
            t.paciente?.id ??
            t.pacienteId ??
            t.paciente_id ??
            0,
          pacienteNome:
            t.paciente?.Nome_paciente ??
            t.paciente?.nome_completo ??
            t.paciente?.nome ??
            t.pacienteNome ??
            "Desconhecido",
          Diagnostico: t.Diagnostico ?? t.diagnostico,
          Data_inicio: t.Data_inicio ?? t.data_inicio,
          Data_termino: t.Data_termino ?? t.data_termino,
          Status: t.Status ?? t.status,
          Observacoes: t.Observacoes ?? t.observacoes,
        }))
      );
    } catch (err) {
      console.error("Erro ao buscar tratamentos:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPacientes() {
    try {
      const res = await api.get("/paciente");
      setPacientes(
        res.data.map((p: any) => ({
          id: Number(p.ID ?? p.id),
          nome_completo:
            p.Nome_paciente ?? p.nome_completo ?? p.nome ?? "Sem Nome",
        }))
      );
    } catch (err) {
      console.error("Erro ao buscar pacientes:", err);
    }
  }

  async function fetchMedicamentos() {
    try {
      const res = await api.get("/medicamento");
      setMedicamentos(res.data);
    } catch (err) {
      console.error("Erro ao buscar medicamentos:", err);
    }
  }

  function openEditModal(tratamento: TratamentoFront) {
    setEditingTratamento(tratamento);
    setForm({
      pacienteId: tratamento.pacienteId.toString(),
      Diagnostico: tratamento.Diagnostico,
      Data_inicio: tratamento.Data_inicio?.split("T")[0] || "",
      Data_termino: tratamento.Data_termino?.split("T")[0] || "",
      Status: tratamento.Status,
      Observacoes: tratamento.Observacoes || "",
    });
    setIsEditModalOpen(true);
  }

  function openNewTreatmentFlow() {
    setIsPatientSelectionOpen(true);
    setSelectedPatient(null);
    setSelectedMedicamentos([]);
  }

  function handlePatientSelect(patient: { id: number; nome_completo: string }) {
    setSelectedPatient(patient);
    setIsPatientSelectionOpen(false);
    setIsTreatmentSelectionOpen(true);
  }

  function toggleMedicamentoSelection(id: number) {
    setSelectedMedicamentos((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  async function handleSaveNewTreatments() {
    if (!selectedPatient) return;

    try {
      // Aqui você iteraria sobre os medicamentos selecionados e criaria os tratamentos
      // Como o backend espera um tratamento por vez, faremos um loop
      // Nota: O ideal seria o backend aceitar um array, mas vamos adaptar ao que temos
      let lastMed = null;
      for (const medId of selectedMedicamentos) {
        const med = medicamentos.find((m) => (m.ID || m.id) === medId);
        if (med) lastMed = med;
        const payload = {
          pacienteId: selectedPatient.id,
          paciente_id: selectedPatient.id,
          Diagnostico: med?.nome || med?.Nome_Medicamento || "Medicamento",
          Data_inicio: new Date().toISOString(),
          Status: "Ativo",
          Observacoes: `Medicamento ID: ${medId}`,
        };
        await api.post("/tratamento", payload);
      }

      setIsTreatmentSelectionOpen(false);
      fetchTratamentos();

      if (lastMed) {
        setSuccessPopupData(lastMed);
        setIsSuccessPopupOpen(true);
      }
    } catch (err: any) {
      console.error("Erro ao salvar tratamentos:", err);
      alert("Erro ao salvar alguns tratamentos.");
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTratamento) return;

    try {
      const payload = {
        pacienteId: Number(form.pacienteId),
        paciente_id: Number(form.pacienteId),
        Diagnostico: form.Diagnostico,
        Data_inicio: form.Data_inicio
          ? new Date(form.Data_inicio).toISOString()
          : null,
        Data_termino: form.Data_termino
          ? new Date(form.Data_termino).toISOString()
          : null,
        Status: form.Status,
        Observacoes: form.Observacoes || undefined,
      };

      await api.put(`/tratamento/${editingTratamento.id}`, payload);

      setIsEditModalOpen(false);
      fetchTratamentos();
    } catch (err: any) {
      console.error("Erro ao salvar tratamento:", err);
      alert("Erro ao salvar tratamento.");
    }
  }

  async function handleDelete(tratamento: TratamentoFront) {
    setTreatmentToDelete(tratamento);
    setIsDeletePopupOpen(true);
  }

  async function confirmDelete() {
    if (!treatmentToDelete) return;
    try {
      await api.delete(`/tratamento/${treatmentToDelete.id}`);
      setTratamentos((prev) =>
        prev.filter((t) => t.id !== treatmentToDelete.id)
      );
      setIsDeletePopupOpen(false);
      setTreatmentToDelete(null);
    } catch (err) {
      console.error("Erro ao excluir tratamento:", err);
      alert("Erro ao excluir tratamento.");
    }
  }

  function formatDate(dateString?: string) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString("pt-BR");
  }

  return (
    <div className="bg-white h-screen flex flex-row overflow-hidden ml-[288px]">
      <NavBar />
      <div className="flex flex-col flex-1">
        <TopBar title="Tratamentos" />
        <main className="flex flex-1 items-start justify-center p-8 overflow-y-auto bg-gray-100 relative mt-4">
          <div className="bg-white w-full max-w-5xl mt-8 rounded-[20px] shadow-sm overflow-hidden flex flex-col h-[calc(100vh-150px)]">
            <div className="bg-blue-900 py-4 w-full flex items-center justify-between px-8 shrink-0">
              <h2 className="text-white font-black text-2xl uppercase tracking-wide">
                PACIENTES EM TRATAMENTO
              </h2>
              <button
                onClick={openNewTreatmentFlow}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-full flex items-center gap-2"
              >
                <span>+ Adicionar Tratamento</span>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 overflow-y-auto flex-1">
              {tratamentos.map((t) => (
                <div
                  key={t.id}
                  className="bg-[#D9D9D9] rounded-[30px] py-4 px-8 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <UserIconSolid className="h-14 w-14 text-black" />

                    <div className="grid grid-cols-3 gap-8 flex-1 text-black">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg">
                          {t.pacienteNome}
                        </span>
                        <span className="italic text-sm">
                          Medicamento: {t.Diagnostico}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-medium">{t.Diagnostico}</span>
                        <span className="italic text-sm">Farmacêutico: -</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatDate(t.Data_inicio)}
                        </span>
                        <span className="italic text-sm">
                          {formatDate(t.Data_termino)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pl-4">
                    <button
                      onClick={() => openEditModal(t)}
                      className="text-black hover:text-gray-800"
                    >
                      <PencilSquareIcon className="h-8 w-8 stroke-2" />
                    </button>
                    <button
                      onClick={() => handleDelete(t)}
                      className="text-black hover:text-gray-800"
                    >
                      <TrashIcon className="h-8 w-8 stroke-2" />
                    </button>
                  </div>
                </div>
              ))}

              {!loading && tratamentos.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                  Nenhum tratamento encontrado.
                </div>
              )}
            </div>
          </div>

          {/* Modal 1: Seleção de Paciente */}
          {isPatientSelectionOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
              <div className="bg-white rounded-[20px] shadow-lg w-[600px] overflow-hidden flex flex-col max-h-[80vh]">
                <div className="bg-blue-900 py-4 text-center relative">
                  <h2 className="text-white font-bold text-xl uppercase">
                    ADICIONAR TRATAMENTO
                  </h2>
                </div>

                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-3">
                  {pacientes.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handlePatientSelect(p)}
                      className="bg-[#D9D9D9] rounded-full py-3 px-6 flex items-center gap-4 hover:bg-gray-300 transition-colors text-left"
                    >
                      <UserIconSolid className="h-8 w-8 text-black" />
                      <span className="text-black font-medium italic uppercase">
                        NOME: {p.nome_completo}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="p-4 flex justify-center bg-gray-50">
                  <button
                    onClick={() => setIsPatientSelectionOpen(false)}
                    className="bg-[#D9D9D9] text-black font-bold py-2 px-12 rounded-[10px] hover:bg-gray-300"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal 2: Seleção de Tratamentos (Medicamentos) */}
          {isTreatmentSelectionOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
              <div className="bg-white rounded-[20px] shadow-lg w-[800px] overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-blue-900 py-4 text-center relative">
                  <h2 className="text-white font-bold text-xl uppercase">
                    ADICIONAR TRATAMENTOS
                  </h2>
                </div>

                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                  {medicamentos.map((med) => (
                    <div
                      key={med.ID || med.id}
                      className="bg-[#E5E7EB] rounded-[20px] p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-6">
                        <div className="flex-shrink-0">
                          {med.tipo?.toLowerCase().includes("injeção") ||
                          med.tipo?.toLowerCase().includes("injetável") ? (
                            <Syringe
                              className="h-10 w-10 text-black"
                              strokeWidth={1.5}
                            />
                          ) : (
                            <Pill
                              className="h-10 w-10 text-black"
                              strokeWidth={1.5}
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-x-8 gap-y-1 text-sm text-black">
                          <div className="font-bold italic">
                            {med.nome || med.Nome_Medicamento}
                          </div>
                          <div className="italic">
                            Tipo: {med.tipo || med.Tipo}
                          </div>
                          <div className="italic">
                            Dosagem: {med.dosagem || med.Dosagem}
                          </div>

                          <div className="text-red-600 italic font-medium">
                            {med.tarja || med.Tarja}
                          </div>
                          <div className="italic">
                            Via: {med.via_consumo || med.Via_Consumo}
                          </div>
                          <div className="italic">
                            {med.alertas || med.Alertas}
                          </div>
                        </div>
                      </div>

                      <div className="pr-4">
                        <input
                          type="checkbox"
                          className="w-8 h-8 rounded border-gray-400 text-blue-900 focus:ring-blue-900"
                          checked={selectedMedicamentos.includes(
                            med.ID || med.id || 0
                          )}
                          onChange={() =>
                            toggleMedicamentoSelection(med.ID || med.id || 0)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 flex justify-between items-center bg-gray-50">
                  <button
                    onClick={() => setIsTreatmentSelectionOpen(false)}
                    className="bg-[#D9D9D9] text-black font-bold py-3 px-12 rounded-[15px] hover:bg-gray-300 text-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveNewTreatments}
                    className="bg-blue-900 text-white font-bold py-3 px-8 rounded-[15px] hover:bg-blue-800 text-lg"
                  >
                    Adicionar tratamento
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Edição (Antigo, mantido apenas para edição) */}
          {isEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
              <div className="bg-white rounded-[20px] shadow-lg w-[500px] overflow-hidden">
                <div className="bg-blue-900 h-12 w-full flex items-center justify-end px-4">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-8">
                  <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
                    Editar Tratamento
                  </h2>

                  <form
                    onSubmit={handleSaveEdit}
                    className="flex flex-col gap-4"
                  >
                    <label className="flex flex-col">
                      <span className="text-blue-900 font-semibold mb-2">
                        Paciente
                      </span>
                      <select
                        required
                        value={form.pacienteId}
                        onChange={(e) =>
                          setForm({ ...form, pacienteId: e.target.value })
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
                        value={form.Diagnostico}
                        onChange={(e) =>
                          setForm({ ...form, Diagnostico: e.target.value })
                        }
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
                          value={form.Data_inicio}
                          onChange={(e) =>
                            setForm({ ...form, Data_inicio: e.target.value })
                          }
                          className="border border-gray-300 rounded px-3 py-2"
                        />
                      </label>

                      <label className="flex flex-col">
                        <span className="text-blue-900 font-semibold mb-2">
                          Data término
                        </span>
                        <input
                          type="date"
                          value={form.Data_termino}
                          onChange={(e) =>
                            setForm({ ...form, Data_termino: e.target.value })
                          }
                          className="border border-gray-300 rounded px-3 py-2"
                        />
                      </label>
                    </div>

                    <label className="flex flex-col">
                      <span className="text-blue-900 font-semibold mb-2">
                        Status
                      </span>
                      <select
                        value={form.Status}
                        onChange={(e) =>
                          setForm({ ...form, Status: e.target.value })
                        }
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
                        value={form.Observacoes}
                        onChange={(e) =>
                          setForm({ ...form, Observacoes: e.target.value })
                        }
                        className="border border-gray-300 rounded px-3 py-2"
                        rows={3}
                      />
                    </label>

                    <div className="flex justify-center mt-6">
                      <button
                        type="submit"
                        className="bg-blue-900 text-white font-bold py-3 px-12 rounded-full hover:bg-blue-800"
                      >
                        Salvar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Sucesso */}
          {isSuccessPopupOpen && successPopupData && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
              <div className="bg-white rounded-[20px] shadow-lg w-[400px] overflow-hidden flex flex-col">
                <div className="bg-blue-900 py-6 text-center">
                  <h2 className="text-white font-black text-2xl uppercase leading-tight">
                    TRATAMENTO
                    <br />
                    ADICIONADO!
                  </h2>
                </div>
                <div className="p-6 flex flex-col gap-2 text-black text-lg">
                  <div>
                    <span className="font-bold">Medicamento:</span>{" "}
                    {successPopupData.nome || successPopupData.Nome_Medicamento}
                  </div>
                  <div>
                    <span className="font-bold">Tarja:</span>{" "}
                    {successPopupData.tarja || successPopupData.Tarja}
                  </div>
                  <div>
                    <span className="font-bold">Tipo:</span>{" "}
                    {successPopupData.tipo || successPopupData.Tipo}
                  </div>
                  <div>
                    <span className="font-bold">Via de consumo:</span>{" "}
                    {successPopupData.via_consumo ||
                      successPopupData.Via_Consumo}
                  </div>
                  <div>
                    <span className="font-bold">Dosagem:</span>{" "}
                    {successPopupData.dosagem || successPopupData.Dosagem}
                  </div>
                  <div>
                    <span className="font-bold">Frequência:</span> -
                  </div>
                </div>
                <div className="p-6 flex justify-center">
                  <button
                    onClick={() => setIsSuccessPopupOpen(false)}
                    className="bg-blue-900 text-white font-bold py-2 px-12 rounded-full hover:bg-blue-800 text-xl"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Exclusão */}
          {isDeletePopupOpen && treatmentToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
              <div className="bg-white rounded-[20px] shadow-lg w-[500px] overflow-hidden flex flex-col">
                <div className="bg-blue-900 py-6 text-center">
                  <h2 className="text-white font-black text-xl uppercase">
                    DESEJA EXCLUIR TRATAMENTO?
                  </h2>
                </div>
                <div className="p-8 flex flex-col gap-2 text-black text-lg font-medium">
                  <div>
                    <span className="font-bold">Paciente:</span>{" "}
                    {treatmentToDelete.pacienteNome}
                  </div>
                  <div>
                    <span className="font-bold">Medicamento:</span>{" "}
                    {treatmentToDelete.Diagnostico}
                  </div>
                  <div>
                    <span className="font-bold">Diagnóstico:</span>{" "}
                    {treatmentToDelete.Diagnostico}
                  </div>
                  <div>
                    <span className="font-bold">Farmacêutico:</span> -
                  </div>
                </div>
                <div className="p-6 flex justify-center gap-8">
                  <button
                    onClick={() => setIsDeletePopupOpen(false)}
                    className="bg-red-600 text-white font-bold py-2 px-8 rounded-full hover:bg-red-700 text-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-green-700 text-white font-bold py-2 px-8 rounded-full hover:bg-green-800 text-lg"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
