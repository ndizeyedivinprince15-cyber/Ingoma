/**
 * Mapping des régions françaises métropolitaines
 */
export declare const REGIONS: {
    readonly 'Auvergne-Rh\u00F4ne-Alpes': readonly ["01", "03", "07", "15", "26", "38", "42", "43", "63", "69", "73", "74"];
    readonly 'Bourgogne-Franche-Comt\u00E9': readonly ["21", "25", "39", "58", "70", "71", "89", "90"];
    readonly Bretagne: readonly ["22", "29", "35", "56"];
    readonly 'Centre-Val de Loire': readonly ["18", "28", "36", "37", "41", "45"];
    readonly Corse: readonly ["2A", "2B"];
    readonly 'Grand Est': readonly ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"];
    readonly 'Hauts-de-France': readonly ["02", "59", "60", "62", "80"];
    readonly '\u00CEle-de-France': readonly ["75", "77", "78", "91", "92", "93", "94", "95"];
    readonly Normandie: readonly ["14", "27", "50", "61", "76"];
    readonly 'Nouvelle-Aquitaine': readonly ["16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"];
    readonly Occitanie: readonly ["09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"];
    readonly 'Pays de la Loire': readonly ["44", "49", "53", "72", "85"];
    readonly 'Provence-Alpes-C\u00F4te d\'Azur': readonly ["04", "05", "06", "13", "83", "84"];
};
export type Region = keyof typeof REGIONS;
/**
 * Obtenir la région à partir d'un code département
 */
export declare function getRegionFromDepartment(departmentCode: string): Region | null;
/**
 * Obtenir le département à partir d'un code postal
 */
export declare function getDepartmentFromPostalCode(postalCode: string): string;
//# sourceMappingURL=regions.d.ts.map