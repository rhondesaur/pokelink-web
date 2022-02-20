Vue.component("Pokemon-Summary", {
  template: `
  <div
    :class="[...statusClasses, { 'pokemon': true, 'isDead': isDead, isDamaged: justTookDamage }]"
  >
    <div id='wrapper'>
      <div id="header">
        <h1 id="nickname">{{pokemon.nickname}}</h1>
        <div id="level">
          <h1 id="lvl_id">LV</h1>{{pokemon.level}}
        </div>
      </div>

      <div id="info">
        <div id="pokemon-sprite">
          <TrimmedSprite v-if="pokemonExists" :key="ident" :pokemon="pokemon" @done="fixedSprite = true">
          </TrimmedSprite>

          <div id="eva-acc"  v-if="!settings.theme.hideStatChanges">
            <div id="eva">
              EVA <h2>+2</h2>
            </div>
            <div id="acc">
              ACC <h2>+2</h2>
            </div>
          </div>
        </div>
        <div id="info-text">
          Ability: <h2>{{ability}}</h2><br>
          Nature: <h2>{{pokemon.nature}}</h2><br>
          Held Item: <h2>{{pokemon.heldItem.name}}</h2><br>
          Met in <h2>{{pokemon.locationMet}}</h2> at <h2>Lv {{pokemon.levelMet}}</h2><br>
          <h3>!mon {{pokemon.speciesName.toLowerCase()}}</h3>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>BST</th>
            <th
              :class="{statIncrease: isIncreased('Hp'), statDecrease: isDecreased('Hp')}"
            >
              HP
            </th>
            <th
              :class="{statIncrease: isIncreased('Atk'), statDecrease: isDecreased('Atk')}"
            >
              ATK
            </th>
            <th
              :class="{statIncrease: isIncreased('Def'), statDecrease: isDecreased('Def')}"
            >
              DEF
            </th>
            <th
              :class="{statIncrease: isIncreased('SpAtk'), statDecrease: isDecreased('SpAtk')}"
            >
              SPATK
            </th>
            <th
              :class="{statIncrease: isIncreased('SpDef'), statDecrease: isDecreased('SpDef')}"
            >
              SPDEF
            </th>
            <th
              :class="{statIncrease: isIncreased('Spd'), statDecrease: isDecreased('Spd')}"
            >
              SPD
            </th>
          </tr>
        </thead>
        <tr id="stats">
          <td>{{baseStatsTotal}}</td>
          <td
            :class="{ hp__inner: true, low: parseFloat(healthPercent) <= 50, critical: parseFloat(healthPercent) <= 15}"
          >
            {{pokemon.hp.current}}
          </td>
          <td
          >
            {{ stats['Atk'] }}
          </td>
          <td
          >
            {{ stats['Def'] }}
          </td>
          <td
          >
            {{ stats['SpAtk'] }}
          </td>
          <td
          >
            {{ stats['SpDef'] }}
          </td>
          <td
          >
            {{ stats['Spd'] }}
          </td>
        </tr>
        <tr id="stat-changes" v-if="!settings.theme.hideStatChanges">
          <td></td>
          <td>
            <p id="HP-style">{{pokemon.hp.max}}</p>
          </td>
          <td>+2</td>
          <td>+2</td>
          <td>+2</td>
          <td>+2</td>
          <td>+2</td>
        </tr>
      </table>
      <table id="iv-ev">
        <tr>
          <th>IV</th>
          <td>{{pokemon.ivs.hp}}</td>
          <td>{{pokemon.ivs.atk}}</td>
          <td>{{pokemon.ivs.def}}</td>
          <td>{{pokemon.ivs.spatk}}</td>
          <td>{{pokemon.ivs.spdef}}</td>
          <td>{{pokemon.ivs.spd}}</td>
        </tr>
        <tr>
          <th>EV</th>
          <td>{{pokemon.evs.hp}}</td>
          <td>{{pokemon.evs.atk}}</td>
          <td>{{pokemon.evs.def}}</td>
          <td>{{pokemon.evs.spatk}}</td>
          <td>{{pokemon.evs.spdef}}</td>
          <td>{{pokemon.evs.spd}}</td>
        </tr>
      </table>
      <div id="moves">
        <div
          v-for="move in moves"
          class="moves"
          :style="{'background-color': move.color}"
        >
          <div class="move-name">{{move.name}}</div>
          <div class="move-pp">15/15</div>
        </div>
      </div>
    </div>
  </div>`,
  props: {
    pokemon: {},
    key: {},
  },
  data() {
    return {
      settings: {},
      justTookDamage: false,
      fixedSprite: false,
    };
  },
  created() {
    this.settings = window.settings;
  },
  methods: {
    isIncreased (statKey) {
      if (this.natureDetails === null) return false
      if (this.natureDetails.increase.toLowerCase() === statKey.toLowerCase()) return true
      return false
    },
    isDecreased (statKey) {
      if (this.natureDetails === null) return false
      if (this.natureDetails.decrease.toLowerCase() === statKey.toLowerCase()) return true
      return false
    }
  },
  computed: {
    natureDetails () {
      let natureDetails = this.settings.natures[this.pokemon.nature.toLowerCase()];
      if (natureDetails.increase === natureDetails.decrease) return null;
      return natureDetails;
    },
    pokemonExists() {
      if (!this.pokemon || !this.pokemon.hasOwnProperty("hp")) return false;
      return true;
    },
    healthPercent() {
      if (this.pokemonExists === false) {
        return 0;
      }
      return (100 / this.pokemon.hp.max) * this.pokemon.hp.current + "%";
    },
    isDead() {
      if (this.pokemonExists === false) {
        return false;
      }

      return parseFloat(this.healthPercent) === 0;
    },
    isSleeping() {
      if (this.pokemonExists === false) {
        return false;
      }

      return this.pokemon.status.slp === 1;
    },
    nickname() {
      return this.pokemon.nickname || this.pokemon.speciesName;
    },
    sex() {
      return this.pokemon.isGenderless
        ? ""
        : this.pokemon.isFemale
        ? "female"
        : "male";
    },
    ident() {
      if (typeof this.pokemon === "undefined") {
        return null;
      }
      return this.pokemon.species;
    },

    ability() {
      if (!this.pokemonExists) {
        return "";
      }
      if (typeof this.pokemon.ability === "string") return this.pokemon.ability;
      let ability = getAbilityById(this.pokemon.ability);
      return ability.name || "";
    },

    opacity() {
      if (typeof this.pokemon === "undefined") {
        return "0.4";
      }
      return "1";
    },
    hasItem() {
      if (typeof this.pokemon === "undefined") {
        return false;
      }
      if (typeof this.pokemon.heldItem === "undefined") {
        return false;
      }
      return this.pokemon.heldItem.id !== 0;
    },
    sprite() {
      console.log(this.pokemon);
      if (typeof this.pokemon === "undefined") {
        return "";
      }
      if (this.pokemon.img) {
        return this.pokemon.img;
      }

      return "";
    },
    experienceRemaining() {
      if (this.pokemonExists === false) {
        return false;
      }
      const expGroup = exp_groups_table.find(
        (group) => this.pokemon.species === group.id
      );
      const levelExp = experience_table.filter((expRange) => {
        return (
          expRange.level === this.pokemon.level + 1 ||
          expRange.level === this.pokemon.level
        );
      });

      const totalExpForThisRange =
        levelExp[1][expGroup["levelling_type"]] -
        levelExp[0][expGroup["levelling_type"]];
      const expLeftInThisRange =
        this.pokemon.exp - levelExp[0][expGroup["levelling_type"]];

      return (100 / totalExpForThisRange) * expLeftInThisRange + "%";
    },
    statusClasses() {
      if (typeof this.pokemon === "undefined") {
        return [];
      }
      let statuses = [];
      if (this.pokemon.status.psn === 1) statuses = [...statuses, "isPoisoned"];
      if (this.pokemon.status.par === 1)
        statuses = [...statuses, "isParalyzed"];
      if (this.pokemon.status.brn === 1) statuses = [...statuses, "isBurned"];
      if (this.pokemon.status.fzn === 1) statuses = [...statuses, "isFrozen"];

      return statuses;
    },

    moves() {
      if (!this.pokemonExists) {
        return [];
      }
      return [
        this.pokemon.move1,
        this.pokemon.move2,
        this.pokemon.move3,
        this.pokemon.move4,
      ]
        .filter((move) => move.hasOwnProperty("type"))
        .map((move) => {
          let moveType = movedex
            .all()
            .find(
              (iteratedMove) =>
                iteratedMove.ename.toLowerCase() === move.name.toLowerCase()
            );
          if (!moveType) return move;
          return {
            ...move,
            type: moveType.type.toLowerCase(),
            maxPP: moveType.pp,
            color: this.settings.typeColors[moveType.type.toLowerCase()],
            remaining: Math.ceil(((move.pp / moveType.pp) * 100) / 25),
          };
        });
    },


    baseStats () {
      if (this.pokemon === null || pokedex.all().length === 0) return []
      try {
        return pokedex.all().find(entry => entry.id === this.pokemon.species).base
      } catch (e) {
        return []
      }
    },

    baseStatsTotal () {
      return Object.values(this.baseStats).reduce((a, b) => a + b, 0)
    },
    stats () {
      if (this.pokemon === null) return 0
      return getStats(this.pokemon, this.baseStats).reduce((a, b) => {
        return {...a, [b.stat]: b.value}
      }, {})
    },

    cellColour() {
      if (!this.pokemonExists) return "#120c2f";
      const primaryType = this.pokemon.types[0].label.toLowerCase();
      return this.settings.typeColors[primaryType];
    },
    selectedPokemon: {
      get: function () {
        return this.nickname;
      },
      set: function () {
        this.$emit("change", this.nickname);
      },
    },
  },
  watch: {
    pokemon(newVal, oldVal) {
      try {
        if (newVal.hp.current < oldVal.hp.current) {
          this.justTookDamage = true;
          setTimeout(() => {
            this.justTookDamage = false;
          }, 3000);
        }
      } catch (e) {
        return;
      }
    },
  },
});
