import React, { useState } from 'react';

export default function SchoolLogo({ schoolData, handleChange, logoPreview, setLogoPreview }) {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleRemoveLogo = () => {
    handleChange("schoolLogo", null);
    setLogoPreview(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleChange("schoolLogo", file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange("schoolLogo", file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="mb-6 rounded-lg border border-gray-400 overflow-hidden transition-all duration-200" style={{ 
      // borderColor: 'rgba(var(--color-border), 0.6)',
      backgroundColor: 'rgba(var(--color-surface), 1)'
    }}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            {/* <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ 
              color: 'rgba(var(--color-primary), 0.8)'
            }}>
              Brand Identity
            </p> */}
            <h3 className="text-base font-semibold" style={{ 
              color: 'rgba(var(--color-text), 1)'
            }}>
              School Logo
            </h3>
          </div>
          {logoPreview && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium" style={{ 
              backgroundColor: 'rgba(var(--color-success), 0.1)',
              color: 'rgba(var(--color-success), 1)'
            }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Uploaded</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Drag & Drop Area */}
          <div className="w-full lg:w-[280px]">
            {!logoPreview ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="relative w-full h-[200px] rounded-xl border-1 border-dashed border-gray-200 transition-all duration-200 cursor-pointer"
                style={{ 
                  borderColor: isDragging 
                    ? 'rgba(var(--color-primary), 1)' 
                    : 'rgba(var(--color-border), 0.5)',
                  backgroundColor: isDragging 
                    ? 'rgba(var(--color-primary), 0.04)'
                    : 'rgba(var(--color-surface-hover), 0.3)',
                  minHeight: '150px'
                }}
                onMouseEnter={(e) => {
                  if (!isDragging && !logoPreview) {
                    e.currentTarget.style.borderColor = 'rgba(var(--color-primary), 0.8)';
                    e.currentTarget.style.backgroundColor = 'rgba(var(--color-primary), 0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDragging && !logoPreview) {
                    e.currentTarget.style.borderColor = 'rgba(var(--color-border), 0.5)';
                    e.currentTarget.style.backgroundColor = 'rgba(var(--color-surface-hover), 0.3)';
                  }
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  id="logo-upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileSelect}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{
                    backgroundColor: 'rgba(var(--color-primary), 0.1)'
                  }}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ 
                      color: 'rgba(var(--color-primary), 0.8)'
                    }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium mb-1" style={{ 
                    color: 'rgba(var(--color-text), 0.9)'
                  }}>
                    {isDragging ? 'Drop your logo here' : 'Drag & drop your logo'}
                  </p>
                  <p className="text-xs mb-3" style={{ 
                    color: 'rgba(var(--color-muted), 0.8)'
                  }}>
                    or click to browse
                  </p>
                  <p className="text-xs" style={{ 
                    color: 'rgba(var(--color-muted), 0.6)'
                  }}>
                    PNG, JPG, SVG up to 5MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative w-full rounded-xl overflow-hidden" style={{
                border: '1px solid rgba(var(--color-border), 0.3)',
                backgroundColor: 'rgba(var(--color-surface-hover), 0.5)'
              }}>
                <div className="relative w-full pt-[100%]">
                  <img
                    src={logoPreview}
                    alt="School logo preview"
                    className="absolute top-0 left-0 h-[200px] object-cover"
                    // height={150}
                  />
                </div>
                <button
                  onClick={handleRemoveLogo}
                  className="absolute top-3 right-3 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                  style={{ 
                    backgroundColor: 'rgba(var(--color-surface), 0.95)',
                    color: 'rgba(var(--color-danger), 1)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(var(--color-danger), 0.95)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(var(--color-surface), 0.95)';
                    e.currentTarget.style.color = 'rgba(var(--color-danger), 1)';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Information */}
          <div className="flex-1">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-2" style={{ 
                  color: 'rgba(var(--color-text), 1)'
                }}>
                  Logo Guidelines
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                      backgroundColor: 'rgba(var(--color-primary), 0.1)'
                    }}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                        color: 'rgba(var(--color-primary), 0.8)'
                      }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-0.5" style={{ color: 'rgba(var(--color-text), 0.9)' }}>
                        Recommended dimensions
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(var(--color-muted), 0.8)' }}>
                        500x500 pixels or larger, square format
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                      backgroundColor: 'rgba(var(--color-primary), 0.1)'
                    }}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                        color: 'rgba(var(--color-primary), 0.8)'
                      }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-0.5" style={{ color: 'rgba(var(--color-text), 0.9)' }}>
                        File format
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(var(--color-muted), 0.8)' }}>
                        PNG, JPG, or SVG with transparent background support
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                      backgroundColor: 'rgba(var(--color-primary), 0.1)'
                    }}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                        color: 'rgba(var(--color-primary), 0.8)'
                      }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-0.5" style={{ color: 'rgba(var(--color-text), 0.9)' }}>
                        File size limit
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(var(--color-muted), 0.8)' }}>
                        Maximum 5MB per file
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t !border-gray-200" style={{ borderColor: 'rgba(var(--color-border), 0.3)' }}>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                    color: 'rgba(var(--color-primary), 0.7)'
                  }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs" style={{ color: 'rgba(var(--color-muted), 0.8)' }}>
                    Your logo will appear on invoices, certificates, report cards, and official school documents
                  </p>
                </div>
              </div>

              {logoPreview && (
                <button
                  onClick={handleRemoveLogo}
                  className="w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(var(--color-danger), 0.05)',
                    color: 'rgba(var(--color-danger), 0.9)',
                    border: '1px solid rgba(var(--color-danger), 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(var(--color-danger), 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(var(--color-danger), 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(var(--color-danger), 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(var(--color-danger), 0.2)';
                  }}
                >
                  Replace or Remove Logo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}