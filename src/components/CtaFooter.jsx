import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ShoppingBag, MapPin, Mail, MessageCircle, Globe } from "lucide-react";
import PollenParticles from "./PollenParticles";

const honeyTransition = { type: "spring", stiffness: 120, damping: 20 };

const footerLinks = {
  Shop: ["Wildflower Honey", "Mountain Honey", "Acacia Honey", "Gift Sets"],
  Company: ["Our Story", "Sourcing", "Sustainability", "Press"],
  Support: ["Contact Us", "Shipping", "Returns", "FAQ"],
};

export default function CtaFooter({
  heading = "Taste honey the way it was meant to be.",
  subtext = "Experience purity in every drop.",
  primaryBtnText = "Shop Now",
  primaryBtnLink = "/shop",
  secondaryBtnText = "Explore Sourcing",
  secondaryBtnLink = "/#sourcing",
  hideCta = false
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      {/* CTA Section */}
      {!hideCta && (
        <section ref={ref} className="relative py-32 px-6 overflow-hidden">
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(250,204,21,0.1) 0%, transparent 50%)",
            }}
          />

          <PollenParticles />

          <div className="relative max-w-3xl mx-auto text-center z-10">
            <motion.h2
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ ...honeyTransition, delay: 0.1 }}
              className="font-heading italic text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight"
            >
              {heading}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...honeyTransition, delay: 0.3 }}
              className="font-body text-lg text-muted-foreground mb-10 font-light"
            >
              {subtext}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...honeyTransition, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <a
                href={primaryBtnLink}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body font-semibold text-sm px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 no-underline"
              >
                <ShoppingBag className="w-4 h-4" />
                {primaryBtnText}
              </a>
              {secondaryBtnText && (
                <a
                  href={secondaryBtnLink}
                  className="liquid-glass inline-flex items-center gap-2 px-8 py-4 rounded-full font-body font-medium text-muted-foreground hover:text-foreground transition-all duration-300 no-underline"
                >
                  <MapPin className="w-4 h-4" />
                  {secondaryBtnText}
                </a>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative border-t border-border/30 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <img
                  src="/images/logo.png"
                  alt="Naturalora"
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <span className="font-heading text-2xl italic text-foreground">
                  Naturalora
                </span>
              </div>
              <p className="font-body text-sm text-muted-foreground font-light leading-relaxed max-w-sm mb-6">
                Premium raw honey, sourced from untouched landscapes. No
                additives, no compromises. Just nature, in a jar.
              </p>
              <div className="flex gap-3">
                {[Globe, MessageCircle, Mail].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-body font-semibold text-sm text-foreground mb-4 tracking-wide">
                  {title}
                </h4>
                <ul className="space-y-3 list-none p-0 m-0">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-300 no-underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-muted-foreground/60">
              © 2024 Naturalora. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookies"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="font-body text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors no-underline"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
