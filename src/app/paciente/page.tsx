"use client";

import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import NavBar from "../components/navBar";
import TopBar from "../components/topBar";
import pacienteService from "../services/pacienteService";
import { Paciente } from "../interfaces/types";
import CadastroPaciente from "../cadastroPaciente/page";
import PopupEdicaoPaciente from "../components/PopupEdicaoPaciente";

export default function PaginaPaciente() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  // Modais
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);

  useEffect(() => {
    fetchPacientes();
  }, []);

  async function fetchPacientes() {
    setLoading(true);
    try {
      const res = await pacienteService.listar();
      setPacientes(res.data || []);
    } catch (err) {
      console.error("Erro ao buscar pacientes:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Deseja realmente excluir este paciente?")) return;

    try {
      await pacienteService.deletar(id);
      setPacientes((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erro ao excluir paciente:", err);
      alert("Erro ao excluir paciente.");
    }
  }

  function formatDate(dateString?: string) {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch (e) {
      return dateString;
    }
  }

  return (
    <div className="bg-white h-screen flex flex-row overflow-hidden ml-[288px]">
      <NavBar />
      <div className="flex flex-col flex-1">
        <TopBar title="Pacientes" />
        <main className="flex flex-1 flex-col items-center p-8 overflow-y-auto bg-gray-100 relative mt-10">
          {/* Botão de Cadastro Flutuante */}
          <button
            onClick={() => setIsCadastroOpen(true)}
            className="fixed bottom-10 right-10 bg-blue-900 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 hover:bg-blue-800 transition-colors shadow-lg z-40"
          >
            <PlusIcon className="h-6 w-6" />
            Cadastrar Paciente
          </button>

          <div className="bg-white w-full max-w-5xl rounded-[20px] shadow-sm overflow-hidden">
            <div className="bg-blue-900 h-12 w-full"></div>

            <div className="p-6">
              <div className="flex flex-col gap-4">
                {pacientes.map((paciente) => (
                  <div
                    key={paciente.id}
                    className="bg-[#D9D9D9] rounded-full py-4 px-6 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <span className="font-bold text-lg block">
                        {paciente.nome_completo}
                      </span>
                      <div className="text-sm text-gray-700 grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                        <p>
                          <span className="font-semibold">CPF:</span>{" "}
                          {paciente.cpf}
                        </p>
                        <p>
                          <span className="font-semibold">Tel:</span>{" "}
                          {paciente.telefone}
                        </p>
                        {paciente.email && (
                          <p className="col-span-2">
                            <span className="font-semibold">Email:</span>{" "}
                            {paciente.email}
                          </p>
                        )}
                        {paciente.data_nascimento && (
                          <p>
                            <span className="font-semibold">Nasc:</span>{" "}
                            {formatDate(paciente.data_nascimento)}
                          </p>
                        )}
                        {paciente.genero && (
                          <p>
                            <span className="font-semibold">Gênero:</span>{" "}
                            {paciente.genero}
                          </p>
                        )}
                        {paciente.profissao && (
                          <p>
                            <span className="font-semibold">Profissão:</span>{" "}
                            {paciente.profissao}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditingPaciente(paciente)}
                        className="text-black hover:text-gray-800"
                      >
                        <PencilSquareIcon className="h-8 w-8 stroke-2" />
                      </button>
                      <button
                        onClick={() => handleDelete(paciente.id)}
                        className="text-black hover:text-gray-800"
                      >
                        <TrashIcon className="h-8 w-8 stroke-2" />
                      </button>
                    </div>
                  </div>
                ))}

                {pacientes.length === 0 && !loading && (
                  <div className="text-center text-gray-500 mt-10">
                    Nenhum paciente cadastrado.
                  </div>
                )}

                {loading && (
                  <div className="text-center text-gray-500 mt-10">
                    Carregando...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modais */}
          <CadastroPaciente
            isOpen={isCadastroOpen}
            onClose={() => {
              setIsCadastroOpen(false);
              fetchPacientes(); // Recarrega lista após cadastro
            }}
          />

          <PopupEdicaoPaciente
            isOpen={!!editingPaciente}
            onClose={() => setEditingPaciente(null)}
            paciente={editingPaciente}
            onAtualizar={(pacienteAtualizado) => {
              setPacientes((prev) =>
                prev.map((p) =>
                  p.id === pacienteAtualizado.id ? pacienteAtualizado : p
                )
              );
            }}
          />
        </main>
      </div>
    </div>
  );
}
