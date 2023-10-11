export class ComponentInterfaceRepo {
  static #savedMethods = {};

  static getMethod(methodName: string) {
    try {
      if (methodName in this.#savedMethods) {
        return this.#savedMethods[methodName];
      } else {
        throw new Error(
          `Failed to retrieve a specific method from the 
            method repo, as it appears the method corresponding 
            to the supplied method name does not exist, received ${methodName}`
        );
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  static addMethod(methodName: string, method: Function) {
    try {
      if (!(methodName in this.#savedMethods)) {
        this.#savedMethods[methodName] = method;
      } else {
        throw new Error(
          `Failed to add a method to the method repo,
             as it appears a method with the supplied 
             method name already exists, received ${methodName}`
        );
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  static removeMethod(methodName: string) {
    try {
      if (methodName in this.#savedMethods) {
        delete this.#savedMethods[methodName];
      } else {
        throw new Error(
          `Failed to remove a method from the method repo,
             as it appears a method with the supplied method
              name does not exist, received ${methodName}`
        );
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }
}

export default ComponentInterfaceRepo
