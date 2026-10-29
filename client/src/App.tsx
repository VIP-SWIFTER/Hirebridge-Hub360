import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
const Scene3D = lazy(() => import("./components/Scene3D"));
import { ReadyContext } from "./lib/ready";
import { scrollToTarget, startSmoothScroll } from "./lib/smooth";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import WhyUs from "./components/WhyUs";
import DragShowcase from "./components/DragShowcase";
import ClosingCta from "./components/ClosingCta";
import PauseMotion from "./components/PauseMotion";
import RobotAssistant from "./components/RobotAssistant";
import Services from "./components/Services";
import EndToEnd from "./components/EndToEnd";
import BrandStudio from "./components/BrandStudio";
import Process from "./components/Process";
import Stats from "./components/Stats";
import Faq from "./components/Faq";
import FormsHub from "./components/FormsHub";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import AdminPage from "./admin/AdminPage";
import type { FormRequest, OpenForm } from "./types";
import FormPage from "./components/FormPage";
import { FORM_PAGES, Route, parseRoute } from "./formPages";


export default function App() {
  const [request, setRequest] = useState<FormRequest | null>(null);
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));
  const admin = route.kind === "admin";
  const [ready, setReady] = useState(false);

  // Inertia scrolling for the public site (not the admin dashboard).
  useEffect(() => (admin ? undefined : startSmoothScroll()), [admin]);

  // Pages use the URL hash (no router needed): /#/admin, /#/talk-to-manager, /#/placement-registration, ...
  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Moving to another page starts at the top; links like #services scroll to that section on the home page.
  const routeKey = route.kind === "form" ? route.form : route.kind;
  useEffect(() => {
    const h = window.location.hash;
    if (routeKey === "home" && h.length > 1 && !h.startsWith("#/")) {
      const t = setTimeout(() => scrollToTarget(h), 80);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [routeKey]);

  const openForm: OpenForm = useCallback((form, preset) => {
    setRequest({ form, preset, nonce: Date.now() });
    window.location.hash = FORM_PAGES[form].path;
  }, []);

  if (admin) return <AdminPage />;

  return (
    <ReadyContext.Provider value={ready}>
      <Loader onDone={() => setReady(true)} />
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>
      <Cursor />
      <ScrollProgress />
      <Navbar openForm={openForm} route={routeKey} />
      <main style={{ position: "relative", zIndex: 1 }}>
        {route.kind === "form" ? (
          <FormPage form={route.form} request={request} />
        ) : (
          <>
        <Hero openForm={openForm} />
        <Stats />
        <Marquee />
        <WhyUs />
        <Services openForm={openForm} />
        <DragShowcase />
        <EndToEnd openForm={openForm} />
        <BrandStudio openForm={openForm} />
        <Process />
        <ClosingCta openForm={openForm} />
        <Faq />
        <FormsHub />
          </>
        )}
      </main>
      <div style={{ position: "relative", zIndex: 1, paddingBottom: "56px" }}>
        <Footer openForm={openForm} />
      </div>
      <FloatingActions />
      <PauseMotion />
      <RobotAssistant openForm={openForm} />
    </ReadyContext.Provider>
  );
}
