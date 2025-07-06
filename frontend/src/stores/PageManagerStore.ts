import { defineStore, acceptHMRUpdate } from 'pinia';

export enum SidebarPage {
  Dashboard = 'Dashboard',
  Phases = 'Phases',
  Tasks = 'Tasks',
  Drafts = 'Drafts',
}

export class SidebarItem {
  constructor(
    public label: SidebarPage,
    public icon: string
  ) {}
}

const sidebarItemsConfig: SidebarItem[] = [
  new SidebarItem(SidebarPage.Dashboard, 'dashboard'),
  new SidebarItem(SidebarPage.Phases, 'calendar_view_week'),
  new SidebarItem(SidebarPage.Tasks, 'format_list_bulleted'),
  new SidebarItem(SidebarPage.Drafts, 'drafts'),
];

export const usePageManagerStore = defineStore('pagemanagerstore', {
  state: () => ({
    activePage: SidebarPage.Dashboard as SidebarPage,
  }),

  getters: {
    isActive: (state) => (label: SidebarPage) =>
      state.activePage === label,

    sidebarItems: () => sidebarItemsConfig,
    getActivePage: (state) => state.activePage
  },

  actions: {
    setActivePage(newActiveLabel: SidebarPage) {
      this.activePage = newActiveLabel;
    },
  },

  persist: {
    key: 'page-manager-store',
    storage: localStorage,
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePageManagerStore, import.meta.hot));
}
