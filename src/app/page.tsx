import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-6xl mb-6">🤖</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Sistema RAG Básico
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sube un documento PDF y haz preguntas sobre su contenido usando
          inteligencia artificial
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="text-sky-700 text-lg font-semibold mb-2">
              1. Subir PDF
            </h3>
            <p className="text-sky-700 text-sm">
              Carga tu documento PDF (máximo 10MB) para procesarlo y generar
              embeddings vectoriales
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-sky-700 text-lg font-semibold mb-2">
              2. Hacer Preguntas
            </h3>
            <p className="text-sky-700 text-sm">
              Chatea con tu documento y obtén respuestas basadas en su contenido
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/upload"
            className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 font-medium"
          >
            Comenzar - Subir PDF
          </Link>
          <Link
            href="/chat"
            className="border border-gray-300 text-gray-700 py-3 px-8 rounded-lg hover:bg-gray-50 font-medium"
          >
            Ir al Chat
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            <strong>Tecnologías:</strong> Next.js 15, TypeScript, OpenAI,
            Pinecone, React Dropzone
          </p>
        </div>
      </div>
    </div>
  );
}
