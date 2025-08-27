import { useEffect, useRef } from "react";
import introJs from "intro.js";
import "intro.js/introjs.css";
import "intro.js/themes/introjs-modern.css";

import type { TooltipPosition } from "intro.js/src/packages/tooltip/tooltipPosition";
import { useTranslation } from "react-i18next";

interface IntroStep {
  element?: string;
  intro: string;
  title?: string;
  position?: TooltipPosition;
}

interface IntroTutorialProps {
  steps: IntroStep[];
  start?: boolean;
  onExit?: () => void;
}

const Tutorial = ({ steps, start = false, onExit }: IntroTutorialProps) => {
  const { t } = useTranslation();
  const started = useRef(false);

  const startIntro = () => {
    const intro = introJs.tour();

    intro.setOptions({
      steps,
      nextLabel: t("intro.next"),
      prevLabel: t("intro.preview"),
      doneLabel: t("intro.done"),
      showProgress: true,
      showBullets: false,
      tooltipClass: "suprss-intro-tooltip",
      highlightClass: "suprss-intro-highlight",
      disableInteraction: true,
    });

    intro.onComplete(() => {
      if (onExit) onExit();
    });

    intro.onExit(() => {
      if (onExit) onExit();
    });

    intro.start();
  };

  useEffect(() => {
    if (start && !started.current) {
      started.current = true;
      startIntro();
    }
  }, [start]);

  return null;
};

export default Tutorial;
