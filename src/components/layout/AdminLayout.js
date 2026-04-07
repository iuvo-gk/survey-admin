import React from "react";
import { Link, NavLink } from "react-router-dom";
import { ADMIN_NAVIGATION } from "../../constants";
import { getInitials, cx } from "../../lib/format";
import BrandMark from "./BrandMark";

function NavigationLink(props) {
  return (
    <NavLink
      exact={props.exact}
      to={props.href}
      className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:translate-x-1 hover:bg-slate-100 hover:text-primary"
      activeClassName="bg-primary-fixed text-primary shadow-sm shadow-primary/10"
    >
      <span className="material-symbols-outlined text-[22px]">{props.icon}</span>
      <span>{props.label}</span>
    </NavLink>
  );
}

function AdminLayout(props) {
  var currentUser = props.currentUser || {};
  var initials = getInitials(currentUser.first_name, currentUser.last_name);

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/50 bg-slate-50/95 px-6 py-6 backdrop-blur xl:flex">
        <BrandMark to="/dashboard" subLabel="Enterprise Tier" />
        <nav className="mt-10 space-y-2">
          {ADMIN_NAVIGATION.map(function mapItem(item) {
            return (
              <NavigationLink
                key={item.key}
                exact={item.href === "/dashboard"}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            );
          })}
        </nav>
        <div className="mt-auto space-y-4">
          <div className="rounded-[28px] bg-primary p-5 text-white shadow-xl shadow-primary/20">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/70">
              GraphQL Ready
            </p>
            <h3 className="mt-3 font-headline text-xl font-bold">Schema-first workspace</h3>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Every admin screen, public survey flow, and profile update is wired to the resolver surface.
            </p>
          </div>
          <button
            type="button"
            onClick={props.onLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-primary"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl xl:pl-72">
        <div className="mx-auto flex max-w-[120rem] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="xl:hidden">
              <BrandMark to="/dashboard" subLabel="Workspace" />
            </div>
            <div className="hidden min-w-0 flex-1 lg:block">
              <div className="relative max-w-md">
                <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search surveys, respondents, or questions..."
                  value={props.searchValue || ""}
                  onChange={props.onSearchChange}
                  className="w-full rounded-2xl border-none bg-surface-container-low py-3 pl-12 pr-4 text-sm shadow-inner shadow-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {props.headerActions}
            <Link to="/profile" className="group flex items-center gap-3 rounded-full bg-surface-container-low pl-2 pr-4 py-2 transition hover:bg-surface-container">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {initials}
              </div>
              <div className="hidden text-left sm:block">
                <div className="text-sm font-semibold text-on-surface">
                  {currentUser.first_name || currentUser.email}
                </div>
                <div className="text-xs text-slate-500">{currentUser.email}</div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="xl:pl-72">
        <div className="mx-auto max-w-[120rem] px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              {props.eyebrow ? (
                <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-primary">
                  {props.eyebrow}
                </div>
              ) : null}
              <h1 className="mt-2 font-headline text-4xl font-black tracking-tight text-on-surface sm:text-5xl">
                {props.title}
              </h1>
              {props.description ? (
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
                  {props.description}
                </p>
              ) : null}
            </div>
            {props.pageActions ? <div className="flex flex-wrap items-center gap-3">{props.pageActions}</div> : null}
          </div>
          {props.children}
        </div>
      </main>

      <nav className="fixed bottom-4 left-4 right-4 z-30 rounded-[28px] border border-white/70 bg-white/90 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur xl:hidden">
        <div className="grid grid-cols-4 gap-1">
          {ADMIN_NAVIGATION.map(function mapItem(item) {
            return (
              <NavLink
                key={item.key}
                exact={item.href === "/dashboard"}
                to={item.href}
                className="flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-100"
                activeClassName="bg-primary-fixed text-primary"
              >
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                <span className={cx(item.label.length > 8 ? "text-[10px]" : "")}>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default AdminLayout;
