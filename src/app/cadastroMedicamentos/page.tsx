"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";

import Button from "../components/button";
import api from "../services/api";
import PopupCadastroMedicamentoSucesso from "../components/PopupCadastroMedicamentoSucesso";

interface ModalCadastroMedicamentoProps {
  isOpen: boolean;
  onClose: () => void;
  id?: number | null; // 🔥 ADICIONADO PARA EDIÇÃO
}

export default function ModalCadastroMedicamento({
  isOpen,
  onClose,
  id,
}: ModalCadastroMedicamentoProps) {
  const [form, setForm] = useState({
    nome: "",
    dosagem: "",
    tipo: "",
    tarja: "",
    via_consumo: "",
    mg_ml: "",
    alertas: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "erro" | "sucesso";
    texto: string;
  } | null>(null);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successData, setSuccessData] = useState({
    nome: "",
    dosagem: "",
    tipo: "",
    tarja: "",
    mg_ml: "",
    alertas: "",
  });

  // 🔥 CARREGA OS DADOS QUANDO EDITANDO
  useEffect(() => {
    if (id && isOpen) {
      api.get(`/medicamento/${id}`).then((res) => {
        setForm({
          nome: res.data.nome || res.data.Nome_Medicamento || "",
          dosagem: res.data.dosagem || res.data.Dosagem || "",
          tipo: res.data.tipo || res.data.Tipo || "",
          tarja: res.data.tarja || res.data.Tarja || "",
          via_consumo: res.data.via_consumo || res.data.Via_Consumo || "",
          mg_ml: res.data.mg_ml || res.data.Mg_Ml || "",
          alertas: res.data.alertas || res.data.Alertas || "",
        });
      });
    } else {
      // Se for cadastro, limpa o formulário
      setForm({
        nome: "",
        dosagem: "",
        tipo: "",
        tarja: "",
        via_consumo: "",
        mg_ml: "",
        alertas: "",
      });
    }
  }, [id, isOpen]);

  if (!isOpen) return null;

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // 🔥 CADASTRA OU ATUALIZA DEPENDENDO DO ID
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
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

      // Converte campos de texto para maiúsculas (exceto os que vêm de select, que já devem estar corretos, mas garantimos)
      dadosMedicamento.nome = (dadosMedicamento.nome || "").toUpperCase();
      // Dropdowns já enviam o valor correto, mas vamos garantir
      dadosMedicamento.tipo = dadosMedicamento.tipo || "";
      dadosMedicamento.tarja = dadosMedicamento.tarja || "";
      dadosMedicamento.via_consumo = dadosMedicamento.via_consumo || "";

      // Payload para o backend (PascalCase)
      const payload = {
        ...dadosMedicamento,
        Nome_Medicamento: dadosMedicamento.nome,
        Dosagem: dadosMedicamento.dosagem,
        Tipo: dadosMedicamento.tipo,
        Tarja: dadosMedicamento.tarja,
        Via_Consumo: dadosMedicamento.via_consumo,
        Via_consumo: dadosMedicamento.via_consumo,
        viaConsumo: dadosMedicamento.via_consumo,
        Mg_Ml: dadosMedicamento.mg_ml,
        Alertas: dadosMedicamento.alertas,
      };

      if (id) {
        //  EDITAR
        await api.put(`/medicamento/${id}`, payload);
      } else {
        //  CADASTRAR
        await api.post("/medicamento", payload);
      }

      setSuccessData({ ...dadosMedicamento });
      setShowSuccessPopup(true);

      if (!id) {
        // Limpa só no modo cadastro
        setForm({
          nome: "",
          dosagem: "",
          tipo: "",
          tarja: "",
          via_consumo: "",
          mg_ml: "",
          alertas: "",
          frequencia: "",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Erro ao salvar medicamento:", axiosError.response?.data);

      setMensagem({
        tipo: "erro",
        texto:
          axiosError.response?.data?.message ||
          JSON.stringify(axiosError.response?.data) ||
          "Erro ao salvar medicamento. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* POPUP DE SUCESSO */}
      <PopupCadastroMedicamentoSucesso
        isOpen={showSuccessPopup}
        onClose={() => {
          setShowSuccessPopup(false);
          onClose();
        }}
        dados={successData}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white rounded-[20px] shadow-lg w-[600px] max-h-[90vh] overflow-y-auto relative ml-64 mb-20">
          <div className="bg-blue-900 h-10 w-full flex items-center justify-end px-4">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="px-8 py-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
              {id ? "EDITAR MEDICAMENTO" : "CADASTRO MEDICAMENTOS"}
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
                  text={
                    loading
                      ? "Salvando..."
                      : id
                      ? "Salvar Alterações"
                      : "Cadastrar"
                  }
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
    </>
  );
}
