import type { Settings, InterventionMode } from '../shared/types';

export function fallbackAction(settings: Settings, _errorCode: string): InterventionMode {
  return settings.fallbackBehavior;
}
