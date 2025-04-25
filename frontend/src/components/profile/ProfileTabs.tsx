const ProfileTabs = ({ tab, setTab }) => {
  return (
    <div className="flex border-b border-border/30 mt-6">
      <button
        onClick={() => setTab("Posts")}
        className={`pb-3 px-4 text-sm font-medium relative ${
          tab === "Posts" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        Posts
        {tab === "Posts" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
        )}
      </button>
      <button
        onClick={() => setTab("Projects")}
        className={`pb-3 px-4 text-sm font-medium relative ${
          tab === "Projects" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        Projects
        {tab === "Projects" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
        )}
      </button>
      <button
        onClick={() => setTab("Marketplace")}
        className={`pb-3 px-4 text-sm font-medium relative ${
          tab === "Marketplace" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        Marketplace
        {tab === "Marketplace" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
        )}
      </button>
    </div>
  );
};

export default ProfileTabs;
