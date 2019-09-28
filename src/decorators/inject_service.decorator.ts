export function InjectService(Repository: Function) {
  const metaKey = 'injected_services'
  return (target, name) => {
    const constructor = target.constructor
    const services = Reflect.getMetadata(metaKey, constructor) || new Map<string, any>()
    services.set(name, Repository)
    Reflect.defineMetadata(metaKey, services, constructor)
  }
}
