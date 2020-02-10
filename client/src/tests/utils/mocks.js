export const firebaseMock = (data = {}) => jest.fn().mockReturnValueOnce({
  ref: (path) => {
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

    const child = (path) => ({
      child,
      once,
      set,
      push
    });

    return { child, once, set, push };
  }
});