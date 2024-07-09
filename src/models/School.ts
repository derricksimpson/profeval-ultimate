export class School {
  ID: number;
  RegionID: number;
  Name: string;
  website: string | null;
  abbr: string;

  constructor(ID: number, RegionID: number, Name: string, website: string | null, abbr: string) {
    this.ID = ID;
    this.RegionID = RegionID;
    this.Name = Name;
    this.website = website;
    this.abbr = abbr;
  }

  static fromRaw(raw: any): School {
    if (raw) {
      return new School(raw.ID, raw.RegionID, raw.Name, raw.website, raw.abbr);
    } else {
      return null;
    }
  }

  // Method to create a URL-friendly version of the school name
  toUrlFriendlyName(): string {
    console.log('new name');
    return this.Name.toLowerCase().replace(/[^a-z0-9]+/g, '-'); // Replace non-alphanumeric characters with hyphens
  }
}
