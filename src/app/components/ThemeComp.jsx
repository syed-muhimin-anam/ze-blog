'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeComp = ({ children }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div data-theme={theme} className="min-h-screen">
      {children}
    </div>
  );
};

export default ThemeComp;
