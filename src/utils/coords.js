import {julian, coord, sexa} from "astronomia";

/**
 * Convert RA/Dec to horizontal alt/az for a given date/time and location
 * @param {number} ra Right Ascension in hours
 * @param {number} dec Declination in degrees
 * @param {Date} date
 * @param {number} lat Observer latitude in degrees
 * @param {number} lon Observer longitude in degrees
 * @param {{alt:number, az:number}} Altitude & Azimuth in degrees
 */

export function raDecToAltAz(ra, dec, date, lat, lon) {
    // Convert date to Julian Day
    const jd = julian.Calendar.jd(date.getFullYear(), date.getMonth() + 1, date.getDate()) + (date.getUTCHours() + date.getUTCMinutes()/60 + date.getUTCSeconds()/3600) / 24;

    // Convert RA to hours:min:sec format astronomia expects
    const raSexa = new sexa.RA(ra);
    const decSexa = new sexa.Angle(false, Math.abs(dec), 0, 0);
    const equatorial = new coord.Equatorial(raSexa, decSexa);

    // Observer geographic position
    const observer = new coord.Latitude(lat * Math.PI/180);

    const {alt, az} = coord.eqToHz(equatorial, jd, lon * Math.PI/180, observer);

    return {
        alt: alt * 180 / Math.PI,
        az: az * 180 / Math.PI,
    };
}