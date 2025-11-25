"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pill, Syringe, Search, Pencil, Trash2 } from "lucide-react";

import NavBar from "@/app/components/navBar";
import TopBar from "../components/topBar";
import api from "../services/api";
import { Medicamento } from "../interfaces/types";

import ModalCadastroMedicamento from "../cadastroMedicamentos/page";
import PopupExcluirMedicamento from "../components/PopupExcluirMedicamento";
import PopupEdicaoMedicamento from "../components/PopupEdicaoMedicamento";

export default function PaginaMedicamento() {
  const router = useRouter();
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para edição
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [medicamentoToEdit, setMedicamentoToEdit] =
    useState<Medicamento | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [medicamentoToDelete, setMedicamentoToDelete] =
    useState<Medicamento | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await api.get<Medicamento[]>(`/medicamento?_t=${Date.now()}`);
      setMedicamentos(res.data);
    } catch (error) {
      console.error("Erro ao buscar medicamentos:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(medicamento: Medicamento) {
    setMedicamentoToDelete(medicamento);
    setDeletePopupOpen(true);
  }

  async function confirmDelete() {
    if (!medicamentoToDelete) return;
    try {
      await api.delete(`/medicamento/${medicamentoToDelete.ID}`);
      setMedicamentos((prev) =>
        prev.filter((m) => m.ID !== medicamentoToDelete.ID)
      );
      setDeletePopupOpen(false);
      setMedicamentoToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir medicamento:", error);
      alert("Erro ao excluir medicamento.");
    }
  }

  const filteredMedicamentos = medicamentos.filter((med) =>
    (med.nome || med.Nome_Medicamento || med.nome || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white h-screen flex flex-row overflow-hidden ml-[288px]">
      <NavBar />
      <div className="flex flex-col flex-1">
        <TopBar title="Medicamentos" />

        <main className="flex flex-1 flex-col items-center p-8 overflow-y-auto bg-gray-100 relative mt-4">
          {/* Header Azul */}
          <div className="w-full max-w-5xl bg-blue-900 py-4 rounded-t-[20px] text-center shadow-sm z-10 mt-10">
            <h2 className="text-white font-black text-2xl uppercase tracking-wide">
              MEDICAMENTOS CADASTRADOS
            </h2>
          </div>

          {/* Container Branco */}
          <div className="bg-white w-full max-w-5xl p-8 rounded-b-[20px] shadow-sm h-[calc(100vh-220px)] flex flex-col">
            {/* Barra de Pesquisa */}
            <div className="relative w-full mb-8 flex-shrink-0">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full !pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg shadow-sm transition-shadow"
                placeholder="Ex: Dipirona"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Lista de Medicamentos */}
            <div className="flex flex-col gap-6 overflow-y-auto flex-1 pr-2">
              {loading ? (
                <div className="text-center text-blue-900 mt-10 text-lg font-bold">
                  Carregando medicamentos...
                </div>
              ) : (
                <>
                  {filteredMedicamentos.map((med, index) => (
                    <div
                      key={med.ID || med.id || index}
                      className="bg-[#E5E7EB] rounded-[30px] p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Esquerda: Ícone + Informações */}
                      <div className="flex items-center gap-8">
                        {/* Ícone */}
                        <div className="flex-shrink-0">
                          {med.tipo?.toLowerCase().includes("injeção") ||
                          med.tipo?.toLowerCase().includes("injetável") ? (
                            <Syringe
                              className="h-16 w-16 text-black"
                              strokeWidth={1.5}
                            />
                          ) : (
                            <Pill
                              className="h-16 w-16 text-black"
                              strokeWidth={1.5}
                            />
                          )}
                        </div>

                        {/* Grid de Informações */}
                        <div className="flex gap-16 text-base text-black">
                          <div className="flex flex-col gap-1">
                            <div className="font-bold italic text-lg">
                              Medicamento:{" "}
                              {med.nome ||
                                med.Nome_Medicamento ||
                                med.nome ||
                                ""}
                            </div>
                            <div className="italic">
                              Dosagem: {med.dosagem || med.Dosagem || ""}
                            </div>
                            <div className="italic">
                              Tipo: {med.tipo || med.Tipo || ""}
                            </div>
                            <div className="text-red-600 italic font-medium">
                              Tarja: {med.tarja || med.Tarja || ""}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="italic">
                              Via de consumo:{" "}
                              {med.via_consumo ||
                                med.Via_Consumo ||
                                med.viaConsumo ||
                                ""}
                            </div>
                            <div className="italic">
                              Mg/Ml: {med.mg_ml || med.Mg_Ml || ""}
                            </div>
                            <div className="italic">
                              Alertas: {med.alertas || med.Alertas || ""}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Direita: Ações */}
                      <div className="flex items-center gap-4 pr-4">
                        <button
                          onClick={() => {
                            setMedicamentoToEdit(med);
                            setIsEditPopupOpen(true);
                          }}
                          className="text-black hover:text-gray-700 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-10 w-10" strokeWidth={2} />
                        </button>

                        <button
                          onClick={() => handleDelete(med)}
                          className="text-black hover:text-gray-700 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="h-10 w-10" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredMedicamentos.length === 0 && (
                    <div className="text-center text-gray-500 mt-10 text-lg">
                      Nenhum medicamento encontrado.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Botão Flutuante de Cadastro */}
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="fixed bottom-10 right-10 bg-blue-900 text-white rounded-full p-4 shadow-lg hover:bg-blue-800 transition-colors z-50"
          >
            <h1 className="px-4 font-bold">Cadastrar Medicamento</h1>
          </button>

          <PopupExcluirMedicamento
            isOpen={deletePopupOpen}
            onClose={() => setDeletePopupOpen(false)}
            onConfirm={confirmDelete}
            medicamento={
              medicamentoToDelete
                ? {
                    nome:
                      medicamentoToDelete.nome ||
                      medicamentoToDelete.Nome_Medicamento ||
                      "",
                    dosagem:
                      medicamentoToDelete.dosagem ||
                      medicamentoToDelete.Dosagem ||
                      "",
                    tipo:
                      medicamentoToDelete.tipo ||
                      medicamentoToDelete.Tipo ||
                      "",
                    tarja:
                      medicamentoToDelete.tarja ||
                      medicamentoToDelete.Tarja ||
                      "",
                    via_consumo:
                      medicamentoToDelete.via_consumo ||
                      medicamentoToDelete.Via_Consumo ||
                      medicamentoToDelete.viaConsumo ||
                      "",
                    mg_ml:
                      medicamentoToDelete.mg_ml ||
                      medicamentoToDelete.Mg_Ml ||
                      "",
                    alertas:
                      medicamentoToDelete.alertas ||
                      medicamentoToDelete.Alertas ||
                      "",
                  }
                : null
            }
          />

          <ModalCadastroMedicamento
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              fetchData();
            }}
          />

          <PopupEdicaoMedicamento
            isOpen={isEditPopupOpen}
            onClose={() => setIsEditPopupOpen(false)}
            medicamento={medicamentoToEdit}
            onAtualizar={(updated) => {
              setMedicamentos((prev) =>
                prev.map((m) => (m.ID === updated.ID ? updated : m))
              );
            }}
          />
        </main>
      </div>
    </div>
  );
}
