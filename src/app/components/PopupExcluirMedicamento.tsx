import React from "react";

interface PopupExcluirMedicamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  medicamento: {
    nome: string;
    dosagem: string;
    tipo: string;
    tarja: string;
    via_consumo: string;
    mg_ml: string;
    alertas: string;
  } | null;
}

export default function PopupExcluirMedicamento({
  isOpen,
  onClose,
  onConfirm,
  medicamento,
}: PopupExcluirMedicamentoProps) {
  if (!isOpen || !medicamento) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-[20px] shadow-lg w-full max-w-md overflow-hidden border border-gray-200">
        {/* Header Azul */}
        <div className="bg-blue-900 py-4 w-full text-center">
          <h2 className="text-white font-bold text-lg uppercase">
            DESEJA EXCLUIR MEDICAMENTO?
          </h2>
        </div>

        <div className="p-6 flex flex-col items-center text-center">
          {/* Dados do Medicamento */}
          <div className="w-full text-left space-y-2 mb-8 pl-8">
            <p className="text-black font-bold text-lg">
              Nome: <span className="font-normal">{medicamento.nome}</span>
            </p>
            <p className="text-black font-bold text-lg">
              Dosagem:{" "}
              <span className="font-normal">{medicamento.dosagem}</span>
            </p>
            <p className="text-black font-bold text-lg">
              Tipo: <span className="font-normal">{medicamento.tipo}</span>
            </p>
            <p className="text-black font-bold text-lg">
              Tarja: <span className="font-normal">{medicamento.tarja}</span>
            </p>
            <p className="text-black font-bold text-lg">
              Via de consumo:{" "}
              <span className="font-normal">{medicamento.via_consumo}</span>
            </p>
            <p className="text-black font-bold text-lg">
              Mg/Ml: <span className="font-normal">{medicamento.mg_ml}</span>
            </p>
            <p className="text-black font-bold text-lg">
              Alertas:{" "}
              <span className="font-normal">{medicamento.alertas}</span>
            </p>
          </div>

          {/* Botoes */}
          <div className="flex gap-4 w-full justify-center">
            <button
              onClick={onClose}
              className="bg-red-600 text-white font-bold py-2 px-8 rounded-full hover:bg-red-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="bg-green-600 text-white font-bold py-2 px-8 rounded-full hover:bg-green-700 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
