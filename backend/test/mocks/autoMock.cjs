function createAutoMock() {
  return new Proxy(
    {},
    {
      get(target, prop) {
        if (prop === "__esModule") return false;
        if (prop === "default") return target;

        if (!(prop in target)) {
          // chaque propriété devient un jest.fn() OU un sous-proxy si on l'utilise comme objet
          target[prop] = jest.fn();
        }
        return target[prop];
      },
    }
  );
}

function createDeepAutoMock() {
  return new Proxy(
    {},
    {
      get(target, prop) {
        if (prop === "__esModule") return false;
        if (prop === "default") return target;

        if (!(prop in target)) {
          // ici on crée un objet proxy, et chaque méthode dessus sera jest.fn()
          target[prop] = createAutoMock();
        }
        return target[prop];
      },
    }
  );
}

module.exports = { createAutoMock, createDeepAutoMock };
