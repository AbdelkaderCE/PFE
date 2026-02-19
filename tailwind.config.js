module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surface elevation — whisper-quiet shifts
        canvas:      '#f8f9fb',
        surface: {
          DEFAULT: '#ffffff',
          100:     '#ffffff',
          200:     '#f4f5f7',
          300:     '#edeef1',
        },
        // Foreground — 4-level text hierarchy
        ink: {
          DEFAULT: '#1a1d23',
          secondary: '#4b5160',
          tertiary:  '#7c8294',
          muted:     '#a9aeb8',
        },
        // Borders — subtle progression
        edge: {
          DEFAULT: 'rgba(0,0,0,0.08)',
          subtle:  'rgba(0,0,0,0.05)',
          strong:  'rgba(0,0,0,0.14)',
        },
        // Brand — Ibn Khaldoun university blue
        brand: {
          DEFAULT: '#1d4ed8',
          light:   '#dbeafe',
          dark:    '#1e3a8a',
          hover:   '#1e40af',
        },
        // Semantic
        success:   '#16a34a',
        warning:   '#ca8a04',
        danger:    '#dc2626',
        // Control
        control: {
          bg:     '#f1f2f5',
          border: '#d1d5db',
          focus:  '#93bbfd',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm:  '4px',
        md:  '8px',
        lg:  '12px',
        xl:  '16px',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        card: '0 2px 8px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
