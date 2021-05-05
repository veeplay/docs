const { FAMILY_TYPE } = require('./constants');

module.exports = class MediaSupport {
  constructor() {
    // eslint-disable-next-line global-require
    this.deviceFamilies = require('../data/families.json');
    // eslint-disable-next-line global-require
    this.features = require('../data/features.json');
    this.data = [];
    this.deviceFilters = [];
    this.featureFilters = [];
  }

  initialize() {
    if (this.data.length === 0) {
      // eslint-disable-next-line global-require
      const data = require('../data/availability.json');

      const buildSpec = (input) => {
        if (!input) {
          return null;
        }
        if (Array.isArray(input)) {
          return input.map((i) => buildSpec(i));
        }
        if (typeof input === 'string') {
          return (
            this.data.find((s) => s.id === input) ||
            buildSpec(data.find((s) => s.id === input))
          );
        }
        if (typeof input === 'object') {
          const spec = input;
          const builtSpec = {
            ...(input.inherits ? buildSpec(input.inherits) : {}),
          };

          builtSpec.id = spec.id;
          builtSpec.family = spec.family;
          builtSpec.versions = spec.versions;
          builtSpec.inherits = spec.inherits;
          builtSpec.references = [
            ...new Set(
              (builtSpec.references || []).concat(spec.references || []),
            ),
          ];
          builtSpec.support = (builtSpec.support || []).map((d) => ({
            ...d,
            inherited: true,
          }));

          Object.keys(spec.support || {}).forEach((key) => {
            const newSpecs = spec.support[key].map((d) =>
              typeof d === 'string' ? { type: d, enabled: true } : d,
            );

            newSpecs.forEach((newSpec) => {
              const existingSpec = builtSpec.support.find(
                (s) => s.type === newSpec.type,
              );

              if (existingSpec) {
                Object.assign(existingSpec, newSpec, { inherited: false });
              } else {
                builtSpec.support.push(newSpec);
              }
            });
          });

          builtSpec.support = builtSpec.support
            .filter((d) => !('enabled' in d) || d.enabled === true)
            .map(({ enabled, ...rest }) => rest);

          this.data.push(builtSpec);
          return builtSpec;
        }
        return null;
      };

      buildSpec(data);
    }
  }

  devicesOfType(familyType) {
    return this.deviceFamilies.filter((fam) => fam.type === familyType);
  }

  streamingDevices() {
    return this.devicesOfType(FAMILY_TYPE.STREAMING_DEVICE);
  }

  tvs() {
    return this.devicesOfType(FAMILY_TYPE.TV);
  }

  handhelds() {
    return this.devicesOfType(FAMILY_TYPE.HANDHELD);
  }

  browsers() {
    return this.devicesOfType(FAMILY_TYPE.BROWSER);
  }

  feature(id) {
    return this.features.find((f) => f.id === id);
  }

  family(name) {
    return this.deviceFamilies.find((d) => d.name === name);
  }

  for(input) {
    this.featureFilters = this.featureFilters.concat(
      (Array.isArray(input) ? input : [input]).map((i) =>
        typeof i === 'string' ? i : i.id,
      ),
    );

    return this;
  }

  on(input) {
    this.deviceFilters = this.deviceFilters.concat(
      (Array.isArray(input) ? input : [input]).map((i) =>
        typeof i === 'string' ? i : i.name,
      ),
    );

    return this;
  }

  all() {
    this.initialize();

    let specs = this.data;

    if (this.deviceFilters.length) {
      this.deviceFilters = this.deviceFilters.reduce((agg, filter) => {
        const alias = this.deviceFamilies.filter(
          (f) => f.alias && f.alias.includes(filter),
        );

        if (alias.length) {
          return [...agg, ...alias.map((a) => a.name)];
        }

        return [...agg, filter];
      }, []);
      specs = specs.filter((s) => this.deviceFilters.includes(s.family));
    }

    if (this.featureFilters.length) {
      specs = specs.filter(
        (s) =>
          this.featureFilters.length === 0 ||
          this.featureFilters.every((feat) =>
            s.support.find((f) => f.type === feat),
          ),
      );

      specs = specs.map((s) => ({
        ...s,
        support: s.support.filter((d) => this.featureFilters.includes(d.type)),
      }));
    }

    const collapsedIds = [];

    specs.forEach((s) => {
      const ancestor =
        s.inherits &&
        specs.find(
          (d) =>
            (Array.isArray(d.id) && d.id.includes(s.inherits)) ||
            d.id === s.inherits,
        );

      if (
        s.support.every((d) => d.inherited) &&
        ancestor &&
        ancestor.family === s.family
      ) {
        if (Array.isArray(ancestor.id)) {
          ancestor.id.push(s.id);
        } else {
          ancestor.id = [ancestor.id, s.id];
        }
        const family = this.family(s.family);
        if (!('collapseVersions' in family) || !family.collapseVersions) {
          ancestor.versions = ancestor.versions.concat(s.versions);
        }
        collapsedIds.push(s.id);
      }
    });

    specs = specs.filter((s) => !collapsedIds.includes(s.id));

    specs = specs.map((s) => ({
      ...s,
      support: s.support.map(({ inherited, ...rest }) => rest),
    }));

    this.deviceFilters = [];
    this.featureFilters = [];

    return specs;
  }

  byDevice() {
    const results = this.all();
    const agg = {};

    results.forEach((s) => {
      const family = this.family(s.family);

      agg[family.type] = agg[family.type] || {};
      agg[family.type][family.name] = agg[family.type][family.name] || [];

      agg[family.type][family.name].push(s);
    });

    return agg;
  }
};
