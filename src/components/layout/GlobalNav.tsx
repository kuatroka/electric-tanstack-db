import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, Sun, Moon, Monitor } from "lucide-react";
import { GlobalSearch } from "@/components/GlobalSearch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export function GlobalNav() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { to: "/assets", label: "Assets", match: "/assets" },
    { to: "/superinvestors", label: "Superinvestors", match: "/superinvestors" },
  ];

  const cycleTheme = () => {
    const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <nav className="bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile hamburger menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            <Link
              to="/"
              className={`text-lg sm:text-xl font-bold text-foreground hover:text-muted-foreground hover:underline underline-offset-4 transition-colors cursor-pointer outline-none ${
                location.pathname === "/" ? "underline" : ""
              }`}
            >
              fintellectus
            </Link>
          </div>

          {/* Search - centered on desktop, hidden on mobile (shown in mobile menu) */}
          <div className="hidden sm:flex flex-1 justify-center items-center gap-2">
            <GlobalSearch />
          </div>

          {/* Desktop navigation links, theme toggle, and avatar */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm sm:text-base text-foreground hover:text-muted-foreground hover:underline underline-offset-4 transition-colors cursor-pointer outline-none ${
                    location.pathname.startsWith(link.match) ? "underline" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={cycleTheme}
              aria-label={`Current theme: ${theme}. Click to change.`}
              title={`Theme: ${theme}`}
            >
              <ThemeIcon className="h-5 w-5" />
            </Button>

            {/* Avatar */}
            <Avatar className="h-8 w-8 hover:ring-2 hover:ring-muted-foreground transition-all cursor-pointer">
              <AvatarFallback className="text-xs">U</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-4">
            {/* Mobile search */}
            <div className="sm:hidden">
              <GlobalSearch />
            </div>

            {/* Mobile nav links */}
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-2 py-2 text-base text-foreground hover:bg-muted rounded-md transition-colors ${
                    location.pathname.startsWith(link.match)
                      ? "bg-muted font-medium"
                      : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
