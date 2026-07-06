/**
 * @typedef {'rainy' | 'hot' | 'cold' | 'normal'} WeatherMode
 * @typedef {'low' | 'medium' | 'high'} EnergyLevel
 * @typedef {'Sightseeing' | 'Animals' | 'Museum' | 'History' | 'Water' | 'Park' | 'Lake/Water' | 'Food' | 'Day trip' | 'Shopping' | 'Beach' | 'Viewpoint' | 'Old Town'} ActivityType
 *
 * @typedef {Object} BaseLocation
 * @property {string} label
 * @property {string} address
 * @property {string} mapQuery
 *
 * @typedef {Object} WeatherLocation
 * @property {string} label
 * @property {number} latitude
 * @property {number} longitude
 *
 * @typedef {Object} RouteMeta
 * @property {number} zone
 * @property {number} minutes
 * @property {number} family
 * @property {boolean} indoor
 * @property {boolean} outdoor
 * @property {number} route
 * @property {number} calm
 *
 * @typedef {Object} HeroImages
 * @property {string} desktop
 * @property {string} laptop
 * @property {string} tablet
 * @property {string} mobile
 * @property {string} smallMobile
 *
 * @typedef {Object} Activity
 * @property {string} id
 * @property {ActivityType} type
 * @property {'$'|'$$'|'$$$'} tier
 * @property {string} area
 * @property {number} cost
 * @property {string} time
 * @property {string} transit
 * @property {string} distance
 * @property {WeatherMode[]} weather
 * @property {EnergyLevel[]} energy
 * @property {string[]=} ages
 * @property {string[]=} tags
 * @property {string} en
 * @property {string} de
 * @property {string} descEn
 * @property {string} descDe
 * @property {string=} tipEn
 * @property {string=} tipDe
 * @property {string[]=} missionEn
 * @property {string[]=} missionDe
 * @property {string[]=} images
 * @property {string=} official
 * @property {string=} map
 * @property {string=} photos
 * @property {string=} mapQuery
 *
 * @typedef {Object} BudgetModel
 * @property {string} currency
 * @property {string[]=} excludes
 * @property {{ min: number, max: number }=} expectedTripBudget
 * @property {Record<string, number>=} dailyCosts
 *
 * @typedef {Object} FoodStrategy
 * @property {boolean=} breakfastIncluded
 * @property {boolean=} lunchOutsideOnly
 * @property {string=} dinner
 * @property {string[]=} preferences
 *
 * @typedef {Object} ChecklistItem
 * @property {string} id
 * @property {string} en
 * @property {string} de
 * @property {string=} category
 *
 * @typedef {Object} SafetyNote
 * @property {string} id
 * @property {string} en
 * @property {string} de
 *
 * @typedef {Object} SpecialPlan
 * @property {string} id
 * @property {string} en
 * @property {string} de
 * @property {string[]=} activityIds
 *
 * @typedef {Object} DestinationPack
 * @property {string} id
 * @property {string} name
 * @property {string} country
 * @property {string} timezone
 * @property {BaseLocation} baseLocation
 * @property {Record<string, WeatherLocation>} weatherLocations
 * @property {string[]=} tripDates
 * @property {FoodStrategy=} foodStrategy
 * @property {BudgetModel=} budgetModel
 * @property {Activity[]} activities
 * @property {Record<string, RouteMeta>} routeMeta
 * @property {ChecklistItem[]=} checklist
 * @property {SafetyNote[]=} safetyNotes
 * @property {SpecialPlan[]=} specialPlans
 * @property {HeroImages=} heroImages
 */

// This file documents the destination pack schema used by the data layer.
// It is intentionally a JSDoc contract file so the repo can keep working in plain JS.
