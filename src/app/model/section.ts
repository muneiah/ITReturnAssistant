export class Section {
  name: string;
  title: string;
  description: string;
  isActive: boolean;
  constructor(name: string, title: string, description: string, active: boolean) {
    this.name = name;
    this.title = title;
    this.description = description;
    this.isActive = active;
  }
}
