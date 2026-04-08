"use client";

import { useEffect, useRef, useCallback } from "react";
import { signOut } from "next-auth/react";

/**
 * Componente que monitora a inatividade do usuário e realiza o logout automático.
 * Otimizado com throttling para não impactar a performance do site.
 */
export function InactivityHandler() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // 1 hora em milissegundos
  const INACTIVITY_LIMIT = 60 * 60 * 1000;
  // Intervalo mínimo para registrar atividade (Throttling de 5 segundos)
  const THROTTLE_INTERVAL = 5000;

  const resetTimer = useCallback(() => {
    const now = Date.now();

    // Só reseta se o tempo desde a última atividade for maior que o intervalo de throttle
    // Isso evita processamento excessivo em eventos frequentes como mousemove
    if (now - lastActivityRef.current < THROTTLE_INTERVAL) {
      return;
    }

    lastActivityRef.current = now;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      console.log("Sessão expirada por inatividade. Deslogando...");
      signOut({ callbackUrl: "/login" });
    }, INACTIVITY_LIMIT);
  }, [INACTIVITY_LIMIT]);

  useEffect(() => {
    // Lista de eventos que indicam atividade do usuário
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    // Inicializa o timer
    resetTimer();

    // Adiciona os event listeners com a opção { passive: true } para performance
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      // Limpeza ao desmontar o componente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer]);

  return null; // Este componente não renderiza nada visualmente
}
