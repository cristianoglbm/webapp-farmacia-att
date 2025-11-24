"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";

import Button from "../components/button";
import api from "../services/api";
import PopupCadastroSucesso from "../components/PopupCadastroSucesso";

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

interface ModalCadastroFarmaceuticoProps {
  isOpen: boolean;
  onClose: () => void;
  farmaceutico?: Farmaceutico | null; // <-- adicionada prop
}

export default function ModalCadastroFarmaceutico({
  isOpen,
  onClose,
  farmaceutico = null,
}: ModalCadastroFarmaceuticoProps) {
  const [form, setForm] = useState({
    nome: "",
    sobrenome: "",
    CPF: "",
    telefone: "",
    matricula: "",
    email: "",
    genero: "M",
    senha: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "erro" | "sucesso";
    texto: string;
  } | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successData, setSuccessData] = useState({
    nome: "",
    sobrenome: "",
    matricula: "",
  });

  // Preenche formulário ao abrir modal para edição
  useEffect(() => {
    if (farmaceutico) {
      setForm({
        nome: farmaceutico.Nome_Farmaceutico,
        sobrenome: farmaceutico.Sobrenome_Farmaceutico,
        CPF: farmaceutico.CPF,
        telefone: farmaceutico.Telefone,
        matricula: farmaceutico.RN,
        email: farmaceutico.Email,
        genero: farmaceutico.Genero,
        senha: "",
      });
    } else {
      setForm({
        nome: "",
        sobrenome: "",
        CPF: "",
        telefone: "",
        matricula: "",
        email: "",
        genero: "M",
        senha: "",
      });
    }
  }, [farmaceutico, isOpen]);

  if (!isOpen) return null;

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMensagem(null);
    setLoading(true);

    try {
      const dadosFarmaceutico = {
        Nome_Farmaceutico: form.nome,
        Sobrenome_Farmaceutico: form.sobrenome,
        Email: form.email,
        CPF: form.CPF,
        RN: form.matricula,
        Telefone: form.telefone,
        Genero: form.genero,
        senha: form.senha,
        Perfil_ID: 1,
      };

      if (farmaceutico) {
        // EDIÇÃO
        await api.put(`/farmaceutico/${farmaceutico.ID}`, dadosFarmaceutico);
      } else {
        // CRIAÇÃO
        await api.post("/farmaceutico", dadosFarmaceutico);
      }

      setSuccessData({
        nome: form.nome,
        sobrenome: form.sobrenome,
        matricula: form.matricula,
      });

      setShowSuccessPopup(true);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setMensagem({
        tipo: "erro",
        texto:
          axiosError.response?.data?.message || "Erro ao salvar farmacêutico.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PopupCadastroSucesso
        isOpen={showSuccessPopup}
        onClose={() => {
          setShowSuccessPopup(false);
          onClose();
        }}
        dados={successData}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white rounded-[20px] shadow-lg w-[600px] max-h-[90vh] overflow-y-auto relative">
          <div className="bg-blue-900 h-12 w-full flex items-center justify-end px-4">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="px-8 py-6">
            <h2 className="text-2xl font-black text-center mb-6 text-blue-900 uppercase">
              {farmaceutico ? "EDITAR FARMACÊUTICO" : "CADASTRAR FARMACÊUTICO"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
                placeholder="Nome"
                className="w-full border border-gray-300 rounded-[5px] px-3 py-2 placeholder:italic focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
              <input
                name="sobrenome"
                value={form.sobrenome}
                onChange={handleChange}
                required
                placeholder="Sobrenome"
                className="w-full border border-gray-300 rounded-[5px] px-3 py-2 placeholder:italic focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
              <input
                name="CPF"
                value={form.CPF}
                onChange={handleChange}
                required
                placeholder="CPF"
                className="w-full border border-gray-300 rounded-[5px] px-3 py-2 placeholder:italic focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                required
                placeholder="Telefone"
                className="w-full border border-gray-300 rounded-[5px] px-3 py-2 placeholder:italic focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
              <input
                name="matricula"
                value={form.matricula}
                onChange={handleChange}
                required
                placeholder="Matricula:"
                className="w-full border border-gray-300 rounded-[5px] px-3 py-2 placeholder:italic focus:outline-none focus:ring-1 focus:ring-blue-900"
              />

              {/* Campos adicionais mantidos para funcionamento, mas estilizados */}
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full border border-gray-300 rounded-[5px] px-3 py-2 placeholder:italic focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
              <input
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                placeholder="Senha"
                className="w-full border border-gray-300 rounded-[5px] px-3 py-2 placeholder:italic focus:outline-none focus:ring-1 focus:ring-blue-900"
              />

              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-[5px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>

              {mensagem && (
                <div
                  className={`text-center p-2 rounded-[10px] ${
                    mensagem.tipo === "erro"
                      ? "bg-red-200 text-red-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {mensagem.texto}
                </div>
              )}

              <Button
                text={
                  loading
                    ? "Salvando..."
                    : farmaceutico
                    ? "Salvar Alterações"
                    : "Cadastrar"
                }
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 text-white font-bold py-3 rounded-full hover:bg-blue-800 transition-colors"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
