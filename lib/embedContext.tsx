'use client';

import { createContext, useContext } from 'react';
import { DEFAULT_EMBED_APPEARANCE, type EmbedAppearance } from '@/lib/embed/options';

export interface EmbedContextValue {
  isEmbed: boolean;
  appearance: EmbedAppearance;
  slug: string;
}

const defaultValue: EmbedContextValue = {
  isEmbed: false,
  appearance: DEFAULT_EMBED_APPEARANCE,
  slug: '',
};

const EmbedContext = createContext<EmbedContextValue>(defaultValue);

export function EmbedProvider({
  children,
  appearance = DEFAULT_EMBED_APPEARANCE,
  slug = '',
}: {
  children: React.ReactNode;
  appearance?: EmbedAppearance;
  slug?: string;
}) {
  return (
    <EmbedContext.Provider value={{ isEmbed: true, appearance, slug }}>
      {children}
    </EmbedContext.Provider>
  );
}

export function useIsEmbed() {
  return useContext(EmbedContext).isEmbed;
}

export function useEmbedContext() {
  return useContext(EmbedContext);
}
