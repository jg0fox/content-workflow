import type { FlowState } from '../types/nodes';

const FLOW_STORAGE_KEY = 'content-workflow-flow';

export function saveFlow(flowState: FlowState): void {
  try {
    localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(flowState));
  } catch (error) {
    console.error('Failed to save flow:', error);
  }
}

export function loadFlow(): FlowState | null {
  try {
    const saved = localStorage.getItem(FLOW_STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved) as FlowState;
  } catch (error) {
    console.error('Failed to load flow:', error);
    return null;
  }
}

export function clearFlow(): void {
  localStorage.removeItem(FLOW_STORAGE_KEY);
}
