const FAQ_ITEMS = [
  {
    question: "Which repositories can I analyze?",
    answer: "Any public GitHub repository. Private repositories are not supported in this release."
  },
  {
    question: "How is confidence calculated?",
    answer: "Confidence reflects how much repository evidence — commits, issues, and pull requests — supports the reconstructed decision."
  },
  {
    question: "Can the analysis be wrong?",
    answer: "Yes. DecisionTrace states its confidence and evidence explicitly so you can judge reliability yourself."
  }
];

export function Faq() {
  return (
    <section className="mx-auto max-w-2xl px-6 pb-24">
      <h2 className="mb-6 text-center text-lg font-medium text-white">Frequently asked questions</h2>
      <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
        {FAQ_ITEMS.map((item) => (
          <div key={item.question} className="p-5">
            <h3 className="text-sm font-medium text-white">{item.question}</h3>
            <p className="mt-2 text-sm text-text-secondary">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
