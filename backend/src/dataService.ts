import * as fs from 'fs';
import * as path from 'path';
import { User, Project, Config } from './types';

class DataService {
  private dataDir = path.join(__dirname, '../data');

  constructor() {
    this.ensureDataDirectory();
    this.initializeData();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private initializeData() {
    const files = [
      { name: 'users.json', defaultData: [] },
      { name: 'projects.json', defaultData: [] },
      { 
        name: 'config.json', 
        defaultData: {
          homePage: {
            greeting: "Bonjour, je suis Pierre Lihoreau...",
            contactEmail: "contact@example.com",
            contactPhone: "+33 1 23 45 67 89",
            markdownContent: "# À propos de moi\n\nContenu par défaut de la page d'accueil en markdown.",
            updatedAt: new Date().toISOString()
          },
          socialNetworks: [
            {
              id: '1',
              name: 'LinkedIn',
              url: 'https://linkedin.com/in/pierre-lihoreau',
              icon: 'linkedin',
              order: 1
            }
          ]
        }
      }
    ];

    files.forEach(file => {
      const filePath = path.join(this.dataDir, file.name);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(file.defaultData, null, 2));
      }
    });
  }

  private readJsonFile<T>(filename: string): T {
    const filePath = path.join(this.dataDir, filename);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  private writeJsonFile(filename: string, data: any): void {
    const filePath = path.join(this.dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  // Users
  getUsers(): User[] {
    return this.readJsonFile<User[]>('users.json');
  }

  saveUsers(users: User[]): void {
    this.writeJsonFile('users.json', users);
  }

  getUserByUsername(username: string): User | undefined {
    const users = this.getUsers();
    return users.find(user => user.username === username);
  }

  // Projects
  getProjects(): Project[] {
    return this.readJsonFile<Project[]>('projects.json');
  }

  saveProjects(projects: Project[]): void {
    this.writeJsonFile('projects.json', projects);
  }

  getProjectById(id: string): Project | undefined {
    const projects = this.getProjects();
    return projects.find(project => project.id === id);
  }

  addProject(project: Project): void {
    const projects = this.getProjects();
    projects.push(project);
    this.saveProjects(projects);
  }

  updateProject(id: string, updatedProject: Partial<Project>): boolean {
    const projects = this.getProjects();
    const index = projects.findIndex(project => project.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updatedProject, updatedAt: new Date().toISOString() };
      this.saveProjects(projects);
      return true;
    }
    return false;
  }

  deleteProject(id: string): boolean {
    const projects = this.getProjects();
    const index = projects.findIndex(project => project.id === id);
    if (index !== -1) {
      projects.splice(index, 1);
      this.saveProjects(projects);
      return true;
    }
    return false;
  }

  // Config
  getConfig(): Config {
    return this.readJsonFile<Config>('config.json');
  }

  saveConfig(config: Config): void {
    this.writeJsonFile('config.json', config);
  }

  updateHomePage(homePageData: Partial<Config['homePage']>): void {
    const config = this.getConfig();
    config.homePage = { 
      ...config.homePage, 
      ...homePageData, 
      updatedAt: new Date().toISOString() 
    };
    this.saveConfig(config);
  }

  updateSocialNetworks(socialNetworks: Config['socialNetworks']): void {
    const config = this.getConfig();
    config.socialNetworks = socialNetworks;
    this.saveConfig(config);
  }
}

export default new DataService();
