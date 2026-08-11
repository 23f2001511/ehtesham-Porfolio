"use client";

import { AnimatePresence } from "framer-motion";
import { useOS } from "./OSContext";
import Window from "./Window";

export default function WindowManager() {
  const { windows, getApp, openApp } = useOS();
  const visible = windows.filter((win) => win.state !== "minimized");

  return (
    <AnimatePresence>
      {visible.map((win) => {
        const app = getApp(win.appId);
        if (!app) {
          return null;
        }
        const AppComponent = app.component;
        const icon = <span className={`os-app-icon os-app-icon--${win.appId}`} aria-hidden="true" />;
        return (
          <Window key={win.id} win={win} icon={icon}>
            <AppComponent openApp={openApp} data={win.data} />
          </Window>
        );
      })}
    </AnimatePresence>
  );
}
