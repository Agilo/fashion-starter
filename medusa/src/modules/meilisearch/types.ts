// @ts-ignore
import type { Config, Settings } from 'meilisearch';

export interface MeiliSearchPluginOptions {
  /**
   * MeiliSearch client configuration
   */
  config: Config;

  /**
   * MeiliSearch index settings
   */
  settings?: Record<
    string,
    {
      indexSettings: Settings;
      primaryKey?: string;
      transformer?: (document: Record<string, unknown>) => Record<string, unknown>;
    }
  >;
}
