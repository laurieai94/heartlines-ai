export const logEvent = (name: string, props?: Record<string, any>) => {
  try {
    // Replace with your analytics provider if desired
    console.log("[analytics]", name, props ?? {});
  } catch {
    // no-op
  }
};
