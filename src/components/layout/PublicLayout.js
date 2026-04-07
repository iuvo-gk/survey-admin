import React from "react";
import { Link } from "react-router-dom";
import BrandMark from "./BrandMark";
import Button from "../ui/Button";

function PublicLayout(props) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <BrandMark subLabel={props.subLabel || "Conversational SaaS"} />
          <nav className="hidden items-center gap-8 lg:flex">
            <Link className="text-sm font-medium text-slate-500 transition hover:text-primary" to="/">
              Platform
            </Link>
            <Link
              className="text-sm font-medium text-slate-500 transition hover:text-primary"
              to="/auth"
            >
              Builder
            </Link>
            <Link className="text-sm font-medium text-slate-500 transition hover:text-primary" to="/surveys">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {props.currentUser ? (
              <Link to="/dashboard">
                <Button variant="secondary" size="sm">
                  Open workspace
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="sm">Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      {props.children}
    </div>
  );
}

export default PublicLayout;
