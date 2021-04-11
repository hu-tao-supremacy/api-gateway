export function If(condition: boolean, decorator: MethodDecorator): MethodDecorator {
  return (...args) {
	if (condition) {
      return decorator(...args);
    }
  }
}
