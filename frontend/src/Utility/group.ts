/**
 * get all the possibilities of a key provided by keys
 * @param objs 
 * @param keys 
 * @return {any} {key1:[100,200],key2:['native','filtered']}
 */
function group(objs: any[], keys: string[]) {
  const res: any = {};

  keys.forEach((key) => {
    res[key] = [];
  });
  keys.forEach((key) => {
    objs.forEach((obj) => {
      if (res[key].includes(obj[key])) {
        return;
      } else {
        res[key].push(obj[key]);
      }
    });
  });
  return res;
}

export { group };
