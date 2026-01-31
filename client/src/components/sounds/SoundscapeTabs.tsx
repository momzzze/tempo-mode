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
    <div className="flex justify-center p-4 gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => onTabChange(tab.name)}
          className={`element-spacing rounded-md px-6 py-2 text-center whitespace-nowrap cursor-pointer transition-all ${
            activeTab === tab.name
              ? 'bg-blue-500 text-white'
              : 'bg-gray-400 text-gray-900'
          }`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
