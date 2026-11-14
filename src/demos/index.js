import { demo1 } from './demo1';
// import { demo2 } from './demo2'; // Add future demos here

export const DEMO_REGISTRY = {
  [demo1.id]: demo1,
  // [demo2.id]: demo2,
};

export function getAllDemos() {
  return Object.values(DEMO_REGISTRY);
}

export function getDemo(id) {
  return DEMO_REGISTRY[id] || null;
}