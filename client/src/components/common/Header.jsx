import { useState } from "react";
import assets from "../../assets/assets";
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  Eye,
  Wrench,
  Database,
  Settings as SettingsIcon,
  HelpCircle,
  Plus,
  FolderOpen,
  Download,
  LogOut,
  Maximize2,
  Minimize2,
  Sliders,
  FileJson,
  Sparkles,
  Trash2,
  Radio,
  User,
  Shield,
  FolderHeart,
  RefreshCw,
  Info
} from "lucide-react";

const Header = ({ activeTab, setActiveTab, onMenuAction }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);

  const toggleDropdown = (menuName) => {
    setActiveDropdown(activeDropdown === menuName ? null : menuName);
  };

  const toggleMobileAccordion = (menuName) => {
    setMobileAccordion(mobileAccordion === menuName ? null : menuName);
  };

  const handleAction = (action) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);

    // Dynamic tab routing based on action
    switch (action) {
      case "gallery_creator":
        setActiveTab("create");
        break;
      case "selection_matcher":
        setActiveTab("process");
        break;
      case "album_receiver":
        setActiveTab("receiver");
        break;
      case "data_management":
        setActiveTab("data");
        break;
      default:
        break;
    }

    if (onMenuAction) {
      onMenuAction(action);
    }
  };

  // Sleek descriptive items configuration with icons and shortcut keys
  const menus = {
    file: {
      label: "File",
      icon: <FileText size={14} />,
      items: [
        { label: "New Proof Session", action: "new_session", icon: <Plus size={13} />, shortcut: "Ctrl+N" },
        { label: "Open Selection JSON...", action: "open_json", icon: <FolderOpen size={13} />, shortcut: "Ctrl+O" },
        { label: "Export Preferences", action: "export_prefs", icon: <Download size={13} /> },
        { label: "Exit Studio", action: "exit", icon: <LogOut size={13} />, shortcut: "Alt+F4" },
      ],
    },
    view: {
      label: "View",
      icon: <Eye size={14} />,
      items: [
        { label: "Toggle Fullscreen", action: "toggle_fullscreen", icon: <Maximize2 size={13} />, shortcut: "F11" },
        { label: "Reset Zoom", action: "reset_zoom", icon: <Minimize2 size={13} />, shortcut: "Ctrl+0" },
        { label: "Toggle Sidebar Config", action: "toggle_sidebar", icon: <Sliders size={13} />, shortcut: "Ctrl+B" },
      ],
    },
    tools: {
      label: "Tools",
      icon: <Wrench size={14} />,
      items: [
        { label: "Lightroom Query Builder", action: "tool_lightroom", icon: <FileJson size={13} /> },
        { label: "Compile Standalone HTML", action: "compile_gallery", icon: <Sparkles size={13} />, shortcut: "Ctrl+Shift+C" },
        { label: "Wipe Preview Cache", action: "clear_cache", icon: <Trash2 size={13} />, shortcut: "Ctrl+Shift+Del" },
      ],
    },
    data_management: {
      label: "Workspaces",
      icon: <Database size={14} />,
      items: [
        { label: "Gallery Creator", action: "gallery_creator", icon: <Sparkles size={13} />, active: activeTab === "create" },
        { label: "Selection Matcher", action: "selection_matcher", icon: <FileJson size={13} />, active: activeTab === "process" },
        { label: "Album Receiver", action: "album_receiver", icon: <Radio size={13} />, active: activeTab === "receiver" },
        { label: "Workspace Data Manager", action: "data_management", icon: <Database size={13} />, active: activeTab === "data" },
      ],
    },
    settings: {
      label: "Settings",
      icon: <SettingsIcon size={14} />,
      items: [
        { label: "Photographer Profile", action: "settings_profile", icon: <User size={13} /> },
        { label: "Watermark Defaults", action: "settings_watermark", icon: <Shield size={13} /> },
        { label: "Default Output Paths", action: "settings_paths", icon: <FolderHeart size={13} /> },
      ],
    },
    help: {
      label: "Help",
      icon: <HelpCircle size={14} />,
      items: [
        { label: "Keyboard Shortcuts", action: "help_keys", icon: <HelpCircle size={13} /> },
        { label: "Check for Updates...", action: "help_updates", icon: <RefreshCw size={13} /> },
        { label: "About StudioGallery", action: "help_about", icon: <Info size={13} /> },
      ],
    },
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 select-none">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">

          {/* Left Side: Logo & Brand + Separator + Desktop Navigation Links */}
          <div className="flex items-center gap-5">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <img
                src={assets.logo}
                alt="logo"
                className="w-12 h-12 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handleAction("gallery_creator")}
              />
            </div>

            {/* Split Vertical Separator (Desktop) */}
            <div className="hidden lg:block h-5 w-[1px] bg-slate-900"></div>

            {/* Menu Bar (Desktop Only) */}
            <nav className="hidden lg:flex items-center gap-1">
              {Object.keys(menus).map((key) => {
                const menu = menus[key];
                const isOpen = activeDropdown === key;

                return (
                  <div key={key} className="relative">
                    <button
                      onClick={() => toggleDropdown(key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${isOpen
                        ? "bg-slate-900 text-white shadow-inner"
                        : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                        }`}
                    >
                      {menu.icon}
                      <span>{menu.label}</span>
                      <ChevronDown
                        size={10}
                        className={`opacity-60 transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-400" : ""
                          }`}
                      />
                    </button>

                    {/* Dropdown Menu Panel (Desktop) */}
                    {isOpen && (
                      <div className="absolute left-0 mt-1.5 w-60 rounded-xl bg-slate-950 border border-slate-900 p-1.5 shadow-2xl backdrop-blur-2xl animate-fade-in z-50">
                        {menu.items.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAction(item.action)}
                            className={`w-full flex items-center justify-between text-left px-3 py-2 text-[10.5px] rounded-lg transition-all cursor-pointer font-bold ${item.active
                              ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/10"
                              : "text-slate-300 hover:text-white hover:bg-indigo-600"
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={item.active ? "text-indigo-400" : "text-slate-500 hover:text-white"}>
                                {item.icon}
                              </span>
                              <span>{item.label}</span>
                            </div>
                            {item.shortcut && (
                              <span className="text-[8.5px] text-slate-500 tracking-wide bg-slate-950 border border-slate-900 px-1 py-0.5 rounded ml-2 group-hover:text-white">
                                {item.shortcut}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right Side: Photographer Badge (Desktop) OR Hamburger Toggle (Mobile) */}
          <div className="flex items-center gap-3">
            {/* Desktop Status Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-900/50 border border-slate-900/80 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                Studio Elite <span className="text-slate-600 font-medium">| Connected</span>
              </span>
            </div>

            {/* Mobile Menu Button (Hamburger) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-slate-950 border-b border-slate-900 shadow-2xl backdrop-blur-2xl z-40 max-h-[85vh] overflow-y-auto animate-fade-in p-4 space-y-2">
            {Object.keys(menus).map((key) => {
              const menu = menus[key];
              const isAccordionOpen = mobileAccordion === key;

              return (
                <div key={key} className="border border-slate-900 rounded-xl overflow-hidden bg-slate-900/20">
                  <button
                    onClick={() => toggleMobileAccordion(key)}
                    className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-indigo-400">{menu.icon}</span>
                      <span>{menu.label}</span>
                    </div>
                    {isAccordionOpen ? <ChevronUp size={14} className="text-indigo-400" /> : <ChevronDown size={14} className="opacity-60" />}
                  </button>

                  {/* Mobile Sub-Items Collapse/Accordion */}
                  {isAccordionOpen && (
                    <div className="px-3.5 pb-3.5 pt-0.5 space-y-1 bg-slate-950/40 border-t border-slate-900/50">
                      {menu.items.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAction(item.action)}
                          className={`w-full flex items-center justify-between text-left p-2.5 text-[10.5px] rounded-lg transition-all cursor-pointer font-bold ${item.active
                            ? "bg-indigo-600/10 text-indigo-400"
                            : "text-slate-400 hover:text-white hover:bg-indigo-600"
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">{item.icon}</span>
                            <span>{item.label}</span>
                          </div>
                          {item.shortcut && (
                            <span className="text-[8px] text-slate-600 tracking-wide font-mono">
                              {item.shortcut}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Mobile Connected Status Badge */}
            <div className="flex items-center gap-2 bg-slate-900/40 border border-slate-900/60 p-3.5 rounded-xl justify-center mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Studio Elite | Active Session
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Outside Click Dropdown Close Overlay */}
      {activeDropdown && (
        <div
          className="fixed inset-0 bg-transparent z-40"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </>
  );
};

export default Header;