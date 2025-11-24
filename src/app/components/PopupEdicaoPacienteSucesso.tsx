import React from "react";

interface PopupEdicaoPacienteSucessoProps {
  isOpen: boolean;
  onClose: () => void;
  dados: {
    nome: string;
    sobrenome: string;
    cpf: string;
    telefone: string;
    genero: string;
  };
}

export default function PopupEdicaoPacienteSucesso({
  isOpen,
  onClose,
  dados,
}: PopupEdicaoPacienteSucessoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden border border-gray-200">
        {/* Header Azul */}
        <div className="bg-blue-900 h-12 w-full"></div>

        <div className="p-6 flex flex-col items-center text-center">
          <h2 className="text-2xl font-black text-blue-900 mb-6 uppercase">
            DADOS EDITADOS!
          </h2>

          {/* Dados do Paciente */}
          <div className="w-full text-left space-y-1 mb-8 pl-4">
            <p className="text-black font-bold text-lg">
              Nome: <span className="font-normal">{dados.nome}</span>
            </p>
            <p className="text-black font-bold text-lg">
              Sobrenome: <span className="font-normal">{dados.sobrenome}</span>
            </p>
            <p className="text-black font-bold text-lg">
              CPF: <span className="font-normal">{dados.cpf}</span>
            </p>
            <p className="text-black font-bold text-lg">
              Telefone: <span className="font-normal">{dados.telefone}</span>
            </p>
            <p className="text-black font-bold text-lg">
              Genero: <span className="font-normal">{dados.genero}</span>
            </p>
          </div>

          {/* Botao OK */}
          <button
            onClick={onClose}
            className="bg-blue-900 text-white text-xl font-bold py-2 px-12 rounded-full hover:bg-blue-800 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
