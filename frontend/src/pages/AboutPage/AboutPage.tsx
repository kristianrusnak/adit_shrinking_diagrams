import IntroNavbar from "../../components/layout/IntroNavbar/IntroNavbar";

export default function AboutPage() {
  return (
    <div
    style={{
      color: "white",
      margin: "23% 5% 0 5%"
    }}>
      <section className="mb-16">
        <h2 className="text-4xl font-bold mb-4 border-b border-gray-700 pb-2">
          What is Shrinking Diagrams
        </h2>
        <p className="text-lg leading-relaxed text-gray-300">
          <span className="font-semibold text-white">Shrinking Diagrams</span> is a process of reducing complex UML or software models
          to their most essential parts so that AI systems can process them efficiently.
          Large diagrams often contain redundant or low-impact elements. By pruning them intelligently,
          we keep only what truly defines the structure and logic of the system — making the model
          <span className="text-blue-400 font-medium"> lighter, faster to analyze, and cheaper to send </span>
          to language models with limited context windows.
        </p>
      </section>

      <section>
        <h2 className="text-4xl font-bold mb-4 border-b border-gray-700 pb-2">
          Chat with AI about UML
        </h2>
        <p className="text-lg leading-relaxed text-gray-300">
          Once your diagrams are shrunk, you can interact with an AI assistant to generate code,
          explain architecture, or review design patterns directly from your simplified models.
          The conversation feels natural, while the backend ensures that only the most relevant parts
          of your diagrams are sent — saving both
          <span className="text-blue-400 font-medium"> tokens and time</span>.
        </p>
      </section>
    </div>

  );
}
