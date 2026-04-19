import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

export type DiscoveredMethod<TMeta> = Readonly<{
  instance: object;
  method: (...args: unknown[]) => unknown;
  methodName: string;
  meta: TMeta;
}>;

export function discoverMethods<TMeta>(
  discovery: DiscoveryService,
  metaKey: symbol | string,
  kind: 'provider' | 'controller',
): DiscoveredMethod<TMeta>[] {
  const wrappers: InstanceWrapper[] =
    kind === 'provider' ? discovery.getProviders() : discovery.getControllers();

  const results: DiscoveredMethod<TMeta>[] = [];
  for (const wrapper of wrappers) {
    const { instance } = wrapper;
    if (!instance || typeof instance !== 'object') continue;
    const proto = Object.getPrototypeOf(instance) as object | null;
    if (!proto) continue;
    for (const methodName of Object.getOwnPropertyNames(proto)) {
      if (methodName === 'constructor') continue;
      const method = (instance as Record<string, unknown>)[methodName];
      if (typeof method !== 'function') continue;
      const meta = Reflect.getMetadata(metaKey, method) as TMeta | undefined;
      if (!meta) continue;
      results.push({
        instance,
        method: method as DiscoveredMethod<TMeta>['method'],
        methodName,
        meta,
      });
    }
  }
  return results;
}
