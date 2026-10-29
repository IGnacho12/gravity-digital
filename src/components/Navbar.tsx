import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const links = [
  { href: "#asesoramiento", label: "Asesoramiento" },
  { href: "#capacitacion", label: "Capacitación" },
  { href: "#automatizacion", label: "Automatización" },
  { href: "#contacto", label: "Contacto" },
]

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="glass-nav mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-4 md:px-5">
        <a href="#inicio" className="flex items-center gap-2 font-display text-[22px] leading-none tracking-tight text-foreground">
          <img
            src="/gravity-mark.png"
            alt=""
            className="nav-brand-mark"
            width="36"
            height="36"
          />
          Gravity Digital
        </a>

        <nav className="hidden items-center gap-7 text-[13px] text-muted-foreground md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden rounded-full px-4 md:inline-flex">
            <a href="#contacto">Iniciar consulta</a>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-border bg-background">
              <SheetHeader>
                <SheetTitle className="font-display text-left text-2xl">Gravity Digital</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-5 px-4 text-lg">
                {links.map((link) => (
                  <a key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.label}
                  </a>
                ))}
                <Button asChild className="mt-4 rounded-full">
                  <a href="#contacto">Iniciar consulta</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
