import styles from "./DocsPage.module.css";

export default function DocsPage() {
  return (
    <>
      <title>Docs - Model Shrinker</title>
      <div
        className={styles.docs_container}
      >
        <section>
          <h2 className="text-4xl font-bold mb-4 border-b border-gray-700 pb-2 inline-block">
            Available Algorithms
          </h2>
          <p className="text-lg leading-relaxed text-gray-300 mt-4">
            At this stage, the app includes a
            <span className="text-blue-400 font-medium"> Kruskal-based shrinking algorithm</span>,
            which simplifies model graphs by selecting only the most significant connections.
            This helps reduce the complexity of UML and other models while preserving their core structure.
          </p>
          <p className="text-lg leading-relaxed text-gray-300 mt-6 italic">
            More algorithms — including heuristic, neural, and evolutionary approaches —
            are <span className="text-blue-400 font-semibold"> coming soon </span>
            to let users explore different strategies for balancing precision and compression.
          </p>
        </section>
      </div>
    </>
  )
}
