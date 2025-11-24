import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface PopupCadastroSucessoProps {
  isOpen: boolean;
  onClose: () => void;
  dados: {
    nome: string;
    sobrenome: string;
    matricula: string;
  };
}

export default function PopupCadastroSucesso({
  isOpen,
  onClose,
  dados,
}: PopupCadastroSucessoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-[20px] shadow-lg w-full max-w-sm overflow-hidden ml-64 mb-20">
        {/* Header Azul */}
        <div className="bg-blue-900 h-4 w-full"></div>

        <div className="p-6 flex flex-col items-center text-center">
          <h2 className="text-2xl font-black text-blue-900 mb-4 uppercase">
            CADASTRO CONCLUIDO!
          </h2>

          {/* Icone de Usuario */}
          <div className="mb-6">
            <UserCircleIcon className="h-24 w-24 text-gray-500" />
          </div>

          {/* Dados do Usuario */}
          <div className="w-full text-left space-y-1 mb-8 pl-4">
            <p className="text-black font-bold text-lg">
              Nome: <span className="font-normal">{dados.nome}</span>
            </p>
            <p className="text-black font-bold text-lg">
              Sobrenome: <span className="font-normal">{dados.sobrenome}</span>
            </p>
            <p className="text-black font-bold text-lg">
              Matricula: <span className="font-normal">{dados.matricula}</span>
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
