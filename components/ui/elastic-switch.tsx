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
        <span className="text-sm text-slate-600 whitespace-nowrap">{label}</span>
      )}
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full p-0.5 transition-colors outline-none focus:outline-none ${
          checked ? "bg-slate-900" : "bg-slate-400"
        }`}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className={`h-5 w-5 rounded-full bg-white shadow-md ${checked ? "ml-auto" : ""}`}
        />
      </button>
    </div>
  );
}
