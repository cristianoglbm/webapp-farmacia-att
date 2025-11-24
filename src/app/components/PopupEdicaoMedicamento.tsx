"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";

import Button from "./button";
import api from "../services/api";
import { Medicamento } from "../interfaces/types";

interface PopupEdicaoMedicamentoProps {
  isOpen: boolean;
  onClose: () => void;
  medicamento: Medicamento | null;
  onAtualizar: (medicamentoAtualizado: Medicamento) => void;
}

export default function PopupEdicaoMedicamento({
  isOpen,
  onClose,
  medicamento,
  onAtualizar,
}: PopupEdicaoMedicamentoProps) {
  const [form, setForm] = useState({
    nome: "",
    dosagem: "",
    tipo: "",
    tarja: "",
    via_consumo: "",
    mg_ml: "",
    alertas: "",
    principio_ativo: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "erro" | "sucesso";
    texto: string;
  } | null>(null);

  useEffect(() => {
    if (medicamento) {
      setForm({
        nome: medicamento.nome || medicamento.Nome_Medicamento || "",
        dosagem: medicamento.dosagem || medicamento.Dosagem || "",
        tipo: medicamento.tipo || medicamento.Tipo || "",
        tarja: medicamento.tarja || medicamento.Tarja || "",
        via_consumo:
          medicamento.via_consumo ||
          medicamento.Via_Consumo ||
          medicamento.viaConsumo ||
          "",
        mg_ml: medicamento.mg_ml || medicamento.Mg_Ml || "",
        alertas: medicamento.alertas || medicamento.Alertas || "",
        principio_ativo:
          medicamento.principio_ativo ||
          medicamento.Principio_Ativo ||
          medicamento.principioAtivo ||
          "",
      });
    }
  }, [medicamento]);

  if (!isOpen || !medicamento) return null;

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!medicamento) return;

    setMensagem(null);
    setLoading(true);

    try {
      const dadosMedicamento = { ...form };

      // Função para limpar o valor, mantendo apenas números e convertendo vírgula para ponto
      const cleanValue = (val: string) => {
        if (!val) return "";
        const normalized = val.replace(",", ".");
        const match = normalized.match(/[\d]+(\.[\d]+)?/);
        return match ? match[0] : val;
      };

      // Aplica a limpeza nos campos de dosagem e mg_ml
      dadosMedicamento.dosagem = cleanValue(dadosMedicamento.dosagem);
      dadosMedicamento.mg_ml = cleanValue(dadosMedicamento.mg_ml);

      // Converte campos de texto para maiúsculas
      dadosMedicamento.nome = (dadosMedicamento.nome || "").toUpperCase();
      // Dropdowns já enviam o valor correto
      dadosMedicamento.tipo = dadosMedicamento.tipo || "";
      dadosMedicamento.tarja = dadosMedicamento.tarja || "";
      dadosMedicamento.via_consumo = dadosMedicamento.via_consumo || "";

      dadosMedicamento.principio_ativo = (
        dadosMedicamento.principio_ativo || ""
      ).toUpperCase();

      // Mapeia para o formato esperado pelo backend (PascalCase/SnakeCase)
      const payload = {
        Nome_Medicamento: dadosMedicamento.nome,
        Dosagem: dadosMedicamento.dosagem,
        Tipo: dadosMedicamento.tipo,
        Tarja: dadosMedicamento.tarja,
        Via_Consumo: dadosMedicamento.via_consumo,
        Mg_Ml: dadosMedicamento.mg_ml,
        Alertas: dadosMedicamento.alertas,
        Principio_Ativo: dadosMedicamento.principio_ativo,
      };

      const response = await api.put(
        `/medicamento/${medicamento.ID}`,
        dadosMedicamento
      );

      // Atualiza a lista na página principal
      onAtualizar({
        ...medicamento,
        ...payload,
        ID: medicamento.ID,
        // Atualiza também as chaves em minúsculo para garantir que a UI atualize
        nome: dadosMedicamento.nome,
        dosagem: dadosMedicamento.dosagem,
        tipo: dadosMedicamento.tipo,
        tarja: dadosMedicamento.tarja,
        via_consumo: dadosMedicamento.via_consumo,
        mg_ml: dadosMedicamento.mg_ml,
        alertas: dadosMedicamento.alertas,
        principio_ativo: dadosMedicamento.principio_ativo,
      });

      onClose();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setMensagem({
        tipo: "erro",
        texto:
          axiosError.response?.data?.message ||
          "Erro ao atualizar medicamento. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-[20px] shadow-lg w-[600px] max-h-[90vh] overflow-y-auto relative">
        <div className="bg-blue-900 h-10 w-full flex items-center justify-end px-4">
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
            EDITAR MEDICAMENTO
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Nome Medicamento
              </label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm"
              />
            </div>

            {/* Dosagem */}
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Dosagem
              </label>
              <input
                type="text"
                name="dosagem"
                value={form.dosagem}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm"
              />
            </div>

            {/* Tipo (Select) */}
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Tipo
              </label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm bg-white"
              >
                <option value="">Selecione...</option>
                {[
                  "Analgesico",
                  "Antibiotico",
                  "Anti_inflamatorio",
                  "Antidepressivo",
                  "Antialergico",
                  "Antihipertensivo",
                  "Diabetes",
                  "Cardiovascular",
                  "Gastrointestinal",
                  "Respiratorio",
                  "Hormonal",
                  "Vitaminas",
                  "Outros",
                ].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Tarja (Select) */}
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Tarja
              </label>
              <select
                name="tarja"
                value={form.tarja}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm bg-white"
              >
                <option value="">Selecione...</option>
                {["Sem Tarja", "Amarela", "Vermelha", "Preta"].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Via de Consumo (Select) */}
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Via de consumo
              </label>
              <select
                name="via_consumo"
                value={form.via_consumo}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm bg-white"
              >
                <option value="">Selecione...</option>
                {[
                  "Oral",
                  "Intravenosa",
                  "Intramuscular",
                  "Subcutanea",
                  "Tópica",
                  "Inalatória",
                  "Nasal",
                  "Oftalmica",
                  "Otologica",
                  "Retal",
                ].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Mg/ml */}
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Mg/ml
              </label>
              <input
                type="text"
                name="mg_ml"
                value={form.mg_ml}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm"
              />
            </div>

            {/* Princípio Ativo */}
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Princípio Ativo
              </label>
              <input
                type="text"
                name="principio_ativo"
                value={form.principio_ativo}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm"
              />
            </div>

            {/* Alertas */}
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Alertas
              </label>
              <textarea
                name="alertas"
                value={form.alertas}
                onChange={handleChange}
                className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black resize-none text-sm"
                rows={2}
              ></textarea>
            </div>

            {/* ERRO */}
            {mensagem && (
              <div
                className={`text-center font-semibold rounded-[10px] p-2 text-sm ${
                  mensagem.tipo === "sucesso"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {mensagem.texto}
              </div>
            )}

            {/* BOTÃO */}
            <div className="pt-2 flex justify-center">
              <Button
                text={loading ? "Salvando..." : "Salvar Alterações"}
                onClick={() => {}}
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-full"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
