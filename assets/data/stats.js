
const stats = statKeyNames = ['HP', 'Atk', 'Def', 'SpAtk', 'SpDef', 'Spd']
const natureTable = defaultSettings.natures
/**
 * @param  {Number} iv          Pokémon HP IV(Individual Values)
 * @param  {Number} baseStats   Pokémon base stats
 * @param  {Number} ev          Pokémon HP EV(Effort Values) from 0 ~ 255
 * @param  {Number} level       Pokémon level from 1 ~ 100
 * @return {Number}
 */
function calculateHPStat (iv, baseStats, ev, level) {
  // No.292 Shedinja's HP always be 1.
  if (baseStats === 1) {
    return 1
  }

  // let result = Math.floor((iv + baseStats * 2 + ev / 4) * level / 100 + 10 + level)
  let result = Math.floor((((2 * baseStats) + iv + Math.floor(ev / 4)) * level) / 100) + level + 10
  return result
}

/**
 * @param  {Number} iv          Pokémon IV(Individual Values)
 * @param  {Number} baseStats   Pokémon base stats
 * @param  {Number} ev          Pokémon EV(Effort Values) from 0 ~ 255
 * @param  {Number} level       Pokémon level from 1 ~ 100
 * @param  {Number} nature      Pokémon nature
 * @return {Number}
 */
function calculateRegularStat (iv, baseStats, ev = 0, level = 1, nature = 1) {
  // let baseResult = Math.floor(((iv + baseStats * 2 + ev / 4) * level / 100 + 5))
  let baseResult = (Math.floor((((2 * baseStats) + iv + Math.floor(ev / 4)) * level) / 100) + 5)
  let result = Math.floor(baseResult * nature)
  return result
}
function getNatureWeighting (nature, stat) {
  const natureEffect = natureTable[nature.toLowerCase()]

  if (natureEffect.increase === natureEffect.decrease) return 1
  if (natureEffect.increase.toLowerCase() === stat.toLowerCase()) return 1.1
  if (natureEffect.decrease.toLowerCase() === stat.toLowerCase()) return 0.9
}

function getBaseStatsFor (baseStats, stat) {
  if (stat.toLowerCase() === 'atk') return baseStats['Attack']
  if (stat.toLowerCase() === 'def') return baseStats['Defense']
  if (stat.toLowerCase() === 'hp') return baseStats['HP']
  if (stat.toLowerCase() === 'spatk') return baseStats['Sp. Attack']
  if (stat.toLowerCase() === 'spdef') return baseStats['Sp. Defense']
  if (stat.toLowerCase() === 'spd') return baseStats['Speed']
}

function getStat (pokemon, baseStats, stat) {
  if (!pokemon.nature) return null

  if (stat.toLowerCase() === 'hp') {
    return calculateHPStat(
      pokemon.ivs.hp,
      getBaseStatsFor(baseStats, stat),
      pokemon.evs.hp,
      pokemon.level
    )
  }
  return calculateRegularStat(
    pokemon.ivs[stat.toLowerCase()],
    getBaseStatsFor(baseStats, stat),
    pokemon.evs[stat.toLowerCase()],
    pokemon.level,
    getNatureWeighting(pokemon.nature, stat)
  )
}

function getStats  (pokemon, baseStats) {
  if (!pokemon.nature) return []
  return stats
    .sort((a, b) => {
      return stats.findIndex(stat => stat.toLowerCase() === a.toLowerCase()) -
              stats.findIndex(stat => stat.toLowerCase() === b.toLowerCase())
    })
    .map(name => {
      return {
        stat: name,
        value: getStat(pokemon, baseStats, name)
      }
    })
}