"use client";
import NavBar from "../components/navBar";
import TopBar from "../components/topBar";
import Image from "next/image";

import logofarmacia from "../../../public/logofarmacia.png";

export default function Home() {
  return (
    <div className="bg-white h-screen flex flex-row overflow-hidden ml-[288px]">
      <NavBar />
      <div className="flex flex-col flex-1">
        <TopBar title={"HOME"} />
        <main className="flex flex-1 items-center justify-center p-4 overflow-y-auto bg-gray-100">
          <div className="p-8"></div>
          <div className="flex flex-col items-center py-8 ml-0">
            <Image
              src={logofarmacia}
              width={800}
              height={120}
              alt="Logo IESGO"
              className="mb-2"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
