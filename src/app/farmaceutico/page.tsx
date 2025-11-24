"use client";

import { useEffect, useState } from "react";
import {
  UserIcon as UserIconSolid,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import api from "../services/api";

import NavBar from "@/app/components/navBar";
import TopBar from "../components/topBar";
import ModalCadastroFarmaceutico from "../cadastroFarmaceutico/page";
import PopupExcluirFarmaceutico from "../components/PopupExcluirFarmaceutico";

interface Farmaceutico {
  ID: number;
  Nome_Farmaceutico: string;
  Sobrenome_Farmaceutico: string;
  Email: string;
  CPF: string;
  RN: string;
  Telefone: string;
  Genero: string;
}

export default function PaginaFarmaceutico() {
  const [farmaceuticos, setFarmaceuticos] = useState<Farmaceutico[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [farmaceuticoEdit, setFarmaceuticoEdit] = useState<Farmaceutico | null>(
    null
  );
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [farmaceuticoToDelete, setFarmaceuticoToDelete] =
    useState<Farmaceutico | null>(null);

  useEffect(() => {
    fetchFarmaceuticos();
  }, []);

  async function fetchFarmaceuticos() {
    try {
      const res = await api.get<Farmaceutico[]>("/farmaceutico");
      setFarmaceuticos(res.data);
    } catch (error) {
      console.error("Erro ao buscar farmacêuticos:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(farmaceutico: Farmaceutico) {
    setFarmaceuticoToDelete(farmaceutico);
    setDeletePopupOpen(true);
  }

  async function confirmDelete() {
    if (!farmaceuticoToDelete) return;
    try {
      await api.delete(`/farmaceutico/${farmaceuticoToDelete.ID}`);
      setFarmaceuticos((prev) =>
        prev.filter((f) => f.ID !== farmaceuticoToDelete.ID)
      );
      setDeletePopupOpen(false);
      setFarmaceuticoToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar farmacêutico:", error);
    }
  }

  function handleEdit(f: Farmaceutico) {
    setFarmaceuticoEdit(f);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setFarmaceuticoEdit(null);
    fetchFarmaceuticos(); // Atualiza lista após cadastro/edição
  }

  return (
    <div className="bg-white h-screen flex flex-row overflow-hidden ml-[288px]">
      <NavBar />
      <div className="flex flex-col flex-1">
        <TopBar title="Farmacêuticos" />
        <main className="flex flex-1 items-start justify-center p-8 overflow-y-auto bg-gray-100 relative mt-4">
          <div className="bg-white w-full max-w-5xl mt-8 rounded-[20px] shadow-sm overflow-hidden">
            <div className="bg-blue-900 h-12 w-full"></div>

            <div className="p-6">
              <div className="flex flex-col gap-4">
                {farmaceuticos.map((f) => (
                  <div
                    key={f.ID}
                    className="bg-[#D9D9D9] rounded-full py-4 px-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <UserIconSolid className="h-12 w-12 text-black" />
                      <span className="text-black uppercase italic text-lg">
                        {f.Nome_Farmaceutico} {f.Sobrenome_Farmaceutico}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(f)}
                        className="text-black hover:text-gray-800"
                      >
                        <PencilSquareIcon className="h-10 w-10" />
                      </button>

                      <button
                        onClick={() => handleDelete(f)}
                        className="text-black hover:text-gray-800"
                      >
                        <TrashIcon className="h-10 w-10" />
                      </button>
                    </div>
                  </div>
                ))}

                {farmaceuticos.length === 0 && !loading && (
                  <div className="text-center text-gray-500 mt-10">
                    Nenhum farmacêutico encontrado.
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-10 right-10 bg-blue-900 text-white rounded-full p-4 shadow-lg hover:bg-blue-800 transition-colors"
          >
            <h1>Cadastrar Farmacêutico</h1>
          </button>

          <PopupExcluirFarmaceutico
            isOpen={deletePopupOpen}
            onClose={() => setDeletePopupOpen(false)}
            onConfirm={confirmDelete}
            farmaceutico={
              farmaceuticoToDelete
                ? {
                    nome: farmaceuticoToDelete.Nome_Farmaceutico,
                    sobrenome: farmaceuticoToDelete.Sobrenome_Farmaceutico,
                  }
                : null
            }
          />

          <ModalCadastroFarmaceutico
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            farmaceutico={farmaceuticoEdit} // Passa dados para edição
          />
        </main>
      </div>
    </div>
  );
}
