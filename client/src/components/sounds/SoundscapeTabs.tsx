interface SoundscapeTabsProps {
  tabs: Array<{ name: string; elements?: string[] }>;
  activeTab: string;
  onTabChange: (tabName: string) => void;
}

export function SoundscapeTabs({
  tabs,
  activeTab,
  onTabChange,
}: SoundscapeTabsProps) {
  return (
    <div className="soundscape-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => onTabChange(tab.name)}
          className={`soundscape-tab ${
            activeTab === tab.name ? 'soundscape-tab--active' : ''
          }`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
