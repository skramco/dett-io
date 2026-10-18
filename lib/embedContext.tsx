'use client';

import { createContext, useContext } from 'react';
import {
  DEFAULT_EMBED_OPTIONS,
  type EmbedWidgetOptions,
} from '@/lib/embed/options';

export type { EmbedWidgetOptions };

interface EmbedContextValue {
  isEmbed: boolean;
  options: EmbedWidgetOptions;
}

const EmbedContext = createContext<EmbedContextValue>({
  isEmbed: false,
  options: DEFAULT_EMBED_OPTIONS,
});

export function EmbedProvider({
  children,
  options,
}: {
  children: React.ReactNode;
  options?: EmbedWidgetOptions;
}) {
  return (
    <EmbedContext.Provider
      value={{ isEmbed: true, options: options ?? DEFAULT_EMBED_OPTIONS }}
    >
      {children}
    </EmbedContext.Provider>
  );
}

export function useIsEmbed() {
  return useContext(EmbedContext).isEmbed;
}

export function useEmbedOptions() {
  return useContext(EmbedContext).options;
}
