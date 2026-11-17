import { demo1 } from './demo1';

export const DEMO_REGISTRY = {
  [demo1.id]: demo1,
};

export function getAllDemos() {
  return Object.values(DEMO_REGISTRY);
}

export function getDemo(id) {
  return DEMO_REGISTRY[id] || null;
}