import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const honeyTransition = { type: "spring", stiffness: 120, damping: 20 };

const testimonials = [
  {
    quote:
      "Tastes like real honey, not sugar syrup pretending to be premium. My family noticed the difference on day one.",
    name: "Sarah Mitchell",
    role: "Verified Buyer",
    avatar: "/images/avatar-1.png",
    rating: 5,
  },
  {
    quote:
      "The texture, the colour, the aroma — everything screams authenticity. I've never gone back to store-bought since.",
    name: "James Thornton",
    role: "Health Enthusiast",
    avatar: "/images/avatar-2.png",
    rating: 5,
  },
  {
    quote:
      "Knowing it's ethically sourced makes it taste even better. Naturalora isn't just honey — it's a philosophy.",
    name: "Eleanor Price",
    role: "Nutritionist",
    avatar: "/images/avatar-3.png",
    rating: 5,
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="reviews" ref={ref} className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...honeyTransition, delay: 0.1 }}
            className="inline-block liquid-glass rounded-full px-5 py-2 mb-6"
          >
            <span className="text-xs font-body font-medium tracking-widest text-primary uppercase">
              Testimonials
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ ...honeyTransition, delay: 0.2 }}
            className="font-heading italic text-4xl sm:text-5xl text-foreground mb-4"
          >
            Loved by thousands.
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...honeyTransition, delay: 0.3 + i * 0.15 }}
              className="liquid-glass rounded-3xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-500"
            >
              {/* Quote icon */}
              <div className="mb-6">
                <Quote className="w-8 h-8 text-primary/40" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 text-primary fill-primary"
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="font-body text-base text-foreground/90 leading-relaxed mb-8 flex-1 font-light italic">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <p className="font-body font-semibold text-sm text-foreground">
                    {t.name}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
