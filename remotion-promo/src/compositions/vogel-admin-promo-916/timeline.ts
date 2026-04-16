export const FPS = 30;

export const TIMELINE = {
  fps: FPS,
  scenes: {
    intro: { duration: 3 * FPS },
    login: { duration: 4 * FPS },
    navigation: { duration: 4 * FPS },
    list: { duration: 5 * FPS },
    editor: { duration: 7 * FPS },
    sections: { duration: 6 * FPS },
    seo: { duration: 6 * FPS },
    services: { duration: 4 * FPS },
    partners: { duration: 4 * FPS },
    analytics: { duration: 6 * FPS },
    settings: { duration: 6 * FPS },
    outro: { duration: 4 * FPS },
  },
  get total() {
    return Object.values(this.scenes).reduce((acc, scene) => acc + scene.duration, 0);
  },
};

const getStart = (key: keyof typeof TIMELINE.scenes) => {
    const keys = Object.keys(TIMELINE.scenes) as Array<keyof typeof TIMELINE.scenes>;
    const idx = keys.indexOf(key);
    return keys.slice(0, idx).reduce((acc, k) => acc + TIMELINE.scenes[k].duration, 0);
};

export const START = {
  intro: getStart("intro"),
  login: getStart("login"),
  navigation: getStart("navigation"),
  list: getStart("list"),
  editor: getStart("editor"),
  sections: getStart("sections"),
  seo: getStart("seo"),
  services: getStart("services"),
  partners: getStart("partners"),
  analytics: getStart("analytics"),
  settings: getStart("settings"),
  outro: getStart("outro"),
};
