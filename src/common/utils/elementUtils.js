export function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Component';
}

export function isClassComponent(Comp) {
  return Boolean(
    Comp &&
    Comp.prototype &&
    typeof Comp.prototype.isReactComponent === 'object',
  );
}
