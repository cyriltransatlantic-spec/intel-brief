"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Step {
  id: string;
  label: string;
  status: "pending" | "active" | "done";
}

interface GenerationProgressProps {
  steps: Step[];
}

export default function GenerationProgress({ steps }: GenerationProgressProps) {
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-3 p-3.5 rounded-lg border transition-all ${
              step.status === "done"
                ? "bg-emerald-50 border-emerald-200"
                : step.status === "active"
                ? "bg-blue-50 border-blue-200"
                : "bg-[#F8FAFC] border-[#E2E8F0]"
            }`}
          >
            <div className="flex-shrink-0">
              {step.status === "done" ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check size={11} className="text-white" />
                </div>
              ) : step.status === "active" ? (
                <Loader2 size={20} className="text-[#2563EB] animate-spin" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-[#CBD5E1]" />
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                step.status === "done"
                  ? "text-emerald-700"
                  : step.status === "active"
                  ? "text-[#2563EB]"
                  : "text-[#94A3B8]"
              }`}
            >
              {step.label}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
