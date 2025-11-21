type ClassValue = string | number | boolean | null | undefined;

export function cn(...classes: Array<ClassValue | Record<string, boolean> | Array<ClassValue>>) {
  const flattened: string[] = [];

  const iterate = (value: ClassValue | Record<string, boolean> | Array<ClassValue>) => {
    if (Array.isArray(value)) {
      value.forEach(iterate);
      return;
    }

    if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([key, val]) => {
        if (val) {
          flattened.push(key);
        }
      });
      return;
    }

    if (value) {
      flattened.push(String(value));
    }
  };

  classes.forEach(iterate);

  return flattened.join(' ');
}

