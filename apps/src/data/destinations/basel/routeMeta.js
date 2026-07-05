export const baselRouteMeta = {
  zoo: { zone: 5, minutes: 210, family: 96, indoor: false, outdoor: true, route: 5, calm: 6 },
  rhine: { zone: 2, minutes: 105, family: 88, indoor: false, outdoor: true, route: 2, calm: 2 },
  paper: { zone: 3, minutes: 140, family: 86, indoor: true, outdoor: false, route: 3, calm: 3 },
  augusta: { zone: 8, minutes: 180, family: 80, indoor: false, outdoor: true, route: 8, calm: 8 },
  stlouis: { zone: 9, minutes: 150, family: 72, indoor: false, outdoor: true, route: 9, calm: 9 },
  aquabasilea: { zone: 8, minutes: 180, family: 95, indoor: true, outdoor: true, route: 8, calm: 10 },
  lange: { zone: 4, minutes: 130, family: 91, indoor: false, outdoor: true, route: 4, calm: 1 },
  natural: { zone: 2, minutes: 120, family: 78, indoor: true, outdoor: false, route: 2, calm: 4 },
  markthalle: { zone: 1, minutes: 75, family: 82, indoor: true, outdoor: false, route: 1, calm: 2 },
  kannenfeld: { zone: 6, minutes: 100, family: 90, indoor: false, outdoor: true, route: 6, calm: 1 },
  schuetzenmatt: { zone: 6, minutes: 90, family: 84, indoor: false, outdoor: true, route: 6, calm: 1 },
  zurich: { zone: 12, minutes: 390, family: 66, indoor: true, outdoor: true, route: 12, calm: 12 }
};

export function getBaselRouteMeta(activityId) {
  return baselRouteMeta[activityId] || { zone: 99, minutes: 120, family: 70, indoor: false, outdoor: true, route: 99, calm: 99 };
}
