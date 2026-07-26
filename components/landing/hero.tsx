import { RepositoryInput } from "@/components/landing/repository-input";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-6 pt-24 text-center animate-slide-up">
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        Understand WHY code exists.
      </h1>
      <p className="mt-4 max-w-lg text-base text-text-secondary">
        DecisionTrace reconstructs engineering decisions using repository history and AI.
      </p>
      <div className="mt-8 w-full">
        <RepositoryInput />
      </div>
    </section>
  );
}
