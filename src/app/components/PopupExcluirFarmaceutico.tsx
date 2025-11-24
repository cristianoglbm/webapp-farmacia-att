import React from "react";

interface PopupExcluirFarmaceuticoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  farmaceutico: {
    nome: string;
    sobrenome: string;
  } | null;
}

export default function PopupExcluirFarmaceutico({
  isOpen,
  onClose,
  onConfirm,
  farmaceutico,
}: PopupExcluirFarmaceuticoProps) {
  if (!isOpen || !farmaceutico) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-[20px] shadow-lg w-full max-w-md overflow-hidden ml-64 mb-20 border border-gray-200">
        {/* Header Azul */}
        <div className="bg-blue-900 py-4 w-full text-center">
          <h2 className="text-white font-bold text-lg uppercase">
            DESEJA EXCLUIR FARMACEUTICO?
          </h2>
        </div>

        <div className="p-6 flex flex-col items-center text-center">
          {/* Dados do Usuario */}
          <div className="w-full text-left space-y-2 mb-8 pl-8">
            <p className="text-black font-bold text-lg">
              Nome: <span className="font-normal">{farmaceutico.nome}</span>
            </p>
            <p className="text-black font-bold text-lg">
              Sobrenome:{" "}
              <span className="font-normal">{farmaceutico.sobrenome}</span>
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
