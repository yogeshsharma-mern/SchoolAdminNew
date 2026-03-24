//backupp code. of. theme in dahsboard. header
<div className="px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] bg-clip-text text-transparent">
                School Analytics Dashboard
              </h1>
              <p className="text-sm text-[rgb(var(--color-muted))] mt-1">
                Comprehensive overview of your institution's performance
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="p-2 hover:bg-[rgb(var(--color-surface-hover))] rounded-lg transition-colors flex items-center gap-2"
                >
                  <Palette className="w-5 h-5 text-[rgb(var(--color-muted))]" />
                  <ThemeIcon className="w-5 h-5 text-[rgb(var(--color-primary))]" />
                </button>

                {showThemeMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[rgb(var(--color-surface))] rounded-xl shadow-lg border border-[rgb(var(--color-border))] py-2 z-50">
                    {themes.map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => {
                            setCurrentTheme(theme.id);
                            setShowThemeMenu(false);
                          }}
                          className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-[rgb(var(--color-surface-hover))] transition-colors ${currentTheme === theme.id ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--color-text))]'
                            }`}
                        >
                          <Icon className="w-4 h-4" style={{ color: theme.color }} />
                          <span className="text-sm">{theme.name}</span>
                          {currentTheme === theme.id && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-[rgb(var(--color-primary))]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button className="p-2 hover:bg-[rgb(var(--color-surface-hover))] rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-[rgb(var(--color-muted))]" />
              </button>
              <button className="p-2 hover:bg-[rgb(var(--color-surface-hover))] rounded-lg transition-colors">
                <Download className="w-5 h-5 text-[rgb(var(--color-muted))]" />
              </button>
              <button className="px-4 py-2 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-dark))] text-white rounded-lg transition-colors flex items-center gap-2">
                <span>Generate Report</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>