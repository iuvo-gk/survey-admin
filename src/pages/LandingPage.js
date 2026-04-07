import React from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

function FeatureCard(props) {
  return (
    <Card className="p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
      <div className={"flex h-14 w-14 items-center justify-center rounded-3xl " + props.iconClass}>
        <span className="material-symbols-outlined">{props.icon}</span>
      </div>
      <h3 className="mt-6 font-headline text-2xl font-bold tracking-tight text-on-surface">
        {props.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-500">{props.description}</p>
    </Card>
  );
}

function LandingPage(props) {
  return (
    <PublicLayout currentUser={props.currentUser}>
      <main>
        <section className="overflow-hidden bg-surface-container-low px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge tone="primary">Schema-first survey SaaS</Badge>
              <h1 className="mt-6 font-headline text-5xl font-black tracking-tight text-on-surface sm:text-6xl lg:text-7xl">
                Surveys that feel polished on the surface and exact in GraphQL underneath.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
                InsightFlow blends an editorial respondent experience, a proper admin workspace, and a
                builder that maps straight onto `Survey`, `Question`, `Option`, `Answer`, and
                `Student` types without backend reshaping.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to={props.currentUser ? "/dashboard" : "/auth"}>
                  <Button size="lg">{props.currentUser ? "Open dashboard" : "Start building"}</Button>
                </Link>
                <Link to="/surveys">
                  <Button size="lg" variant="secondary">
                    Explore product
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="relative overflow-hidden p-8">
              <div className="absolute -right-16 -top-8 h-64 w-64 rounded-full bg-secondary-container/40 blur-3xl" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                      Live survey
                    </div>
                    <h2 className="mt-2 font-headline text-3xl font-black text-on-surface">
                      Student wellbeing pulse
                    </h2>
                  </div>
                  <Badge tone="secondary">84% completion</Badge>
                </div>
                <div className="rounded-[28px] bg-surface-container-low p-6">
                  <div className="text-sm font-semibold text-on-surface">
                    How supported do you feel by your current learning environment?
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[22px] bg-primary-fixed px-4 py-4 font-bold text-primary">
                      Very supported
                    </div>
                    <div className="rounded-[22px] bg-white px-4 py-4 text-slate-500 shadow-sm">
                      Somewhat supported
                    </div>
                    <div className="rounded-[22px] bg-white px-4 py-4 text-slate-500 shadow-sm">
                      Neutral
                    </div>
                    <div className="rounded-[22px] bg-white px-4 py-4 text-slate-500 shadow-sm">
                      Need more support
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[24px] bg-white p-5 shadow-sm">
                    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Surveys
                    </div>
                    <div className="mt-2 font-headline text-3xl font-black text-on-surface">84</div>
                  </div>
                  <div className="rounded-[24px] bg-white p-5 shadow-sm">
                    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Questions
                    </div>
                    <div className="mt-2 font-headline text-3xl font-black text-on-surface">1.1k</div>
                  </div>
                  <div className="rounded-[24px] bg-primary p-5 text-white shadow-lg shadow-primary/20">
                    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
                      Answers
                    </div>
                    <div className="mt-2 font-headline text-3xl font-black">42.8k</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-3xl">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                Built around your schema
              </div>
              <h2 className="mt-4 font-headline text-4xl font-black tracking-tight text-on-surface">
                Admin features and public features in one coherent product surface.
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <FeatureCard
                icon="space_dashboard"
                iconClass="bg-primary-fixed text-primary"
                title="Management dashboard"
                description="Monitor `stats`, inspect `getSurveysInfo`, and act on individual `Survey` records without juggling detached tools."
              />
              <FeatureCard
                icon="edit_square"
                iconClass="bg-secondary-container text-secondary"
                title="Conditional survey builder"
                description="Compose `QuestionInput` and `OptionInput` payloads with reusable logic blocks that serialize to `conditional_logic` and `conditionals`."
              />
              <FeatureCard
                icon="how_to_reg"
                iconClass="bg-error-container text-error"
                title="Public respondent flow"
                description="Collect `StudentInput` and `AnswerInput` through a polished UI that posts directly to `submitAnswers`."
              />
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

export default LandingPage;
