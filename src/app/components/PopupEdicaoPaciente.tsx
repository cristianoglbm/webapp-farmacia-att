"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";

import Button from "./button";
import api from "../services/api";
import { Paciente } from "../interfaces/types";
import PopupEdicaoPacienteSucesso from "./PopupEdicaoPacienteSucesso";

interface ModalEditarPacienteProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente | null;
  onAtualizar: (pacienteAtualizado: Paciente) => void;
}

export default function PopupEdicaoPaciente({
  isOpen,
  onClose,
  paciente,
  onAtualizar,
}: ModalEditarPacienteProps) {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState<{
    nome: string;
    sobrenome: string;
    cpf: string;
    telefone: string;
    genero: string;
  }>({
    nome: "",
    sobrenome: "",
    cpf: "",
    telefone: "",
    genero: "",
  });

  useEffect(() => {
    if (paciente) {
      const nomeCompleto = paciente.nome_completo || "";
      const partesNome = nomeCompleto.split(" ");
      const nome = partesNome[0] || "";
      const sobrenome = partesNome.slice(1).join(" ") || "";

      setFormData({
        nome,
        sobrenome,
        cpf: paciente.cpf || "",
        telefone: paciente.telefone || "",
        genero: paciente.genero || "",
      });
    }
  }, [paciente]);

  if (!isOpen || !paciente) return null;

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!paciente) return;

    try {
      const payload = {
        Nome_paciente: `${formData.nome} ${formData.sobrenome}`.trim(),
        CPF: formData.cpf,
        Telefone: formData.telefone,
        Genero: formData.genero,
      };

      const response = await api.put(`/paciente/${paciente.id}`, payload);
      onAtualizar(response.data); // Atualiza a lista na página principal
      setShowSuccessPopup(true);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error(
        axiosError.response?.data?.message || "Erro ao atualizar paciente"
      );
    }
  }

  function handleSuccessClose() {
    setShowSuccessPopup(false);
    onClose();
  }

  if (showSuccessPopup) {
    return (
      <PopupEdicaoPacienteSucesso
        isOpen={showSuccessPopup}
        onClose={handleSuccessClose}
        dados={formData}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Header Azul */}
        <div className="bg-blue-900 py-4 text-center relative">
          <h2 className="text-white text-xl font-bold uppercase tracking-wider">
            EDITAR PACIENTE
          </h2>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-[10px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-900 placeholder:italic placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <input
                type="text"
                name="sobrenome"
                placeholder="Sobrenome"
                value={formData.sobrenome}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-[10px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-900 placeholder:italic placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <input
                type="text"
                name="cpf"
                placeholder="CPF"
                value={formData.cpf}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-[10px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-900 placeholder:italic placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <input
                type="text"
                name="telefone"
                placeholder="Telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-[10px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-900 placeholder:italic placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-[10px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white appearance-none text-gray-700 italic"
              >
                <option value="" disabled hidden>
                  genero
                </option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div className="flex justify-between gap-4 mt-8 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-[#D9D9D9] text-black font-bold text-lg py-3 px-4 rounded-full shadow hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-900 text-white font-bold text-lg py-3 px-4 rounded-full shadow hover:bg-blue-800 transition-colors"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
