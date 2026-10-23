import { motion } from "framer-motion";

interface ElasticSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function ElasticSwitch({ checked, onChange, label }: ElasticSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-sm text-muted whitespace-nowrap">{label}</span>
      )}
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className={`relative h-6 w-11 rounded-full p-0.5 transition-colors duration-300 ease-soft outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
          checked ? "bg-accent" : "bg-line-strong"
        }`}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className={`h-5 w-5 rounded-full bg-card shadow-[0_2px_6px_rgba(33,28,22,0.25)] ${checked ? "ml-auto" : ""}`}
        />
      </button>
    </div>
  );
}
