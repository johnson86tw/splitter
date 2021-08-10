export function timeout(duration: number = 4000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null);
    }, duration);
  });
}
