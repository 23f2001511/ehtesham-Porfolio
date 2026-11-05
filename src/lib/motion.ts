import type { Variants } from "framer-motion";

export function slideInFromLeft(delay = 0.5): Variants {
  return {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        delay,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
}

export function slideInFromRight(delay = 0.5): Variants {
  return {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        delay,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
}

export function slideInFromTop(delay = 0.5): Variants {
  return {
    hidden: { y: -60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
}

export function slideInFromBottom(delay = 0.5): Variants {
  return {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
}

export function fadeIn(delay = 0.2): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
}
