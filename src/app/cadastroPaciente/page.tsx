"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import Button from "../components/button";
import pacienteService from "../services/pacienteService";
import PopupCadastroPacienteSucesso from "../components/PopupCadastroPacienteSucesso";
import api from "../services/api";

interface ModalCadastroPacienteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CadastroPaciente({
  isOpen,
  onClose,
}: ModalCadastroPacienteProps) {
  const [form, setForm] = useState({
    nome: "",
    sobrenome: "",
    CPF: "",
    telefone: "",
    dataNascimento: "",
    genero: "M",
    farmaceuticoId: "",
  });

  const [farmaceuticos, setFarmaceuticos] = useState<
    { id: number; nome_completo: string }[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "erro" | "sucesso";
    texto: string;
  } | null>(null);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successData, setSuccessData] = useState({
    nome: "",
    sobrenome: "",
    cpf: "",
    telefone: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchFarmaceuticos();
    }
  }, [isOpen]);

  async function fetchFarmaceuticos() {
    try {
      const res = await api.get("/farmaceutico");
      setFarmaceuticos(
        res.data.map((f: any) => ({
          id: f.ID || f.id,
          nome_completo:
            f.Nome_Farmaceutico || f.nome_completo || f.nome || "Sem Nome",
        }))
      );
    } catch (err) {
      console.error("Erro ao buscar farmacêuticos:", err);
    }
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMensagem(null);
    setLoading(true);

    try {
      const payload = {
        Nome_paciente: `${form.nome} ${form.sobrenome}`.trim(),
        CPF: form.CPF,
        Telefone: form.telefone || null,
        Genero: form.genero || "NB",
        Data_Nascimento: form.dataNascimento
          ? new Date(form.dataNascimento).toISOString()
          : null,
        farmaceutico_id: form.farmaceuticoId
          ? Number(form.farmaceuticoId)
          : null,
      };

      await pacienteService.criar(payload);

      setSuccessData({
        nome: form.nome,
        sobrenome: form.sobrenome,
        cpf: form.CPF,
        telefone: form.telefone,
      });

      setShowSuccessPopup(true);

      // limpa formulário
      setForm({
        nome: "",
        sobrenome: "",
        CPF: "",
        telefone: "",
        dataNascimento: "",
        genero: "M",
        farmaceuticoId: "",
      });
    } catch (error: any) {
      console.error("Erro ao cadastrar paciente:", error);
      setMensagem({
        tipo: "erro",
        texto:
          error?.response?.data?.message ||
          "Erro ao cadastrar paciente. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <PopupCadastroPacienteSucesso
        isOpen={showSuccessPopup}
        onClose={() => {
          setShowSuccessPopup(false);
          onClose();
        }}
        dados={successData}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white rounded-[20px] shadow-lg w-[600px] max-h-[90vh] overflow-y-auto relative">
          {/* Header Azul com botão de fechar */}
          <div className="bg-blue-900 h-10 w-full flex items-center justify-end px-4">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="px-8 py-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-900 uppercase tracking-wider">
              CADASTRAR PACIENTE
            </h2>

            {mensagem && (
              <div
                className={`mb-4 p-3 rounded text-sm ${
                  mensagem.tipo === "erro"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {mensagem.texto}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome"
                  value={form.nome}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  name="sobrenome"
                  placeholder="Sobrenome"
                  value={form.sobrenome}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  name="CPF"
                  placeholder="CPF"
                  value={form.CPF}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  name="telefone"
                  placeholder="Telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1 ml-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={form.dataNascimento}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900 text-gray-600"
                  required
                />
              </div>

              <div>
                <select
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <select
                  name="farmaceuticoId"
                  value={form.farmaceuticoId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
                >
                  <option value="">Selecione o Farmacêutico</option>
                  {farmaceuticos.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome_completo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between gap-4 mt-8 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-300 text-black font-bold py-2 px-4 rounded shadow hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-900 text-white font-bold py-2 px-4 rounded shadow hover:bg-blue-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "Cadastrando..." : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
