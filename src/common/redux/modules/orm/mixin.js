/**
 * Mixin that adds helper methods to a model class
 * @param  {class} superclass model class
 * @return {class}            model class with mixin
 */
export default superclass => class extends superclass {
  static createOrUpdate(userProps) {
    const ModelClass = this;
    const key = ModelClass.idAttribute;
    if (ModelClass.hasId(userProps[key])) {
      const modelInstance = ModelClass.withId(userProps[key]);
      modelInstance.update(userProps);
    } else {
      ModelClass.create(userProps);
    }
  }

  static update(id, attributes) {
    const ModelClass = this;
    if (ModelClass.hasId(id)) {
      const modelInstance = ModelClass.withId(id);
      modelInstance.update(attributes);
    }
  }

  static delete(id) {
    const ModelClass = this;
    if (ModelClass.hasId(id)) {
      const modelInstance = ModelClass.withId(id);
      modelInstance.delete();
    }
  }

  toJSON() {
    const data = {
      // Include all fields from the plain data object
      ...this.ref,
    };
    return data;
  }
};
