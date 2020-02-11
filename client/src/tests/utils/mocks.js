export const firebaseMock = (data = {}) => jest.fn().mockReturnValueOnce({
  ref: (path = '') => {
    const getKey = (path) => {
      const keys = path.split('/');
      return keys[keys.length - 1];
    };

    const key = getKey(path);

    const once = (event) => {
      if (event === "value") {
        return new Promise((resolve) => {
          resolve({
            val: () => data
          });
        });
      }
    };

    const set = (value) => {
      return new Promise((resolve) => {
        resolve();
      });
    };

    const push = (value) => {
      return new Promise((resolve) => {
        resolve({
          key: `pushKey-${Date.now()}`,
        });
      });
    }

    const child = (path) => {
      const key = getKey(path);

      return { key, child, once, set, push };
    };

    return { key, child, once, set, push };
  }
});