type RadioButtonProps = {
  name?: string;
  label?: string;
  width?: number;
  colors?: string[];
  options?: string[];
  onChange?: (name: string, value: string) => void;
};

export default ({ name, label, colors, options, width, onChange }: RadioButtonProps) => {
  if (!name) {
    name = 'radioGroup' + Math.random() * 1000000;
  }
  if (!options) {
    options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'];
  }

  if (!colors) {
    colors = ['#2563EB', '#777777', '#8B5CF6', '#DB2777', '#475569', '#EA580C'];
  }

  if (!onChange) {
    onChange = (name, value) => {};
  }
  const colorMap = colors.map((c) => {
    return {
      base: c,
      bg: `bg-[${c}]`,
      ring: `ring-[${c}]`,
    };
  });

  //   { bg: 'bg-[#777777]', ring: 'ring-[#777777]' },
  //   // { bg: 'bg-[#DB2777]', ring: 'ring-[#DB2777]' },
  //   // { bg: 'bg-[#475569]', ring: 'ring-[#475569]' },
  //   // { bg: 'bg-[#EA580C]', ring: 'ring-[#EA580C]' },
  // ];

  const instId = `rg_${Math.random() * 1000000}`;
  return (
    <div className="mx-auto px-4">
      {label && <h2 className="text-gray-800 font-medium">{label}</h2>}
      <ul className="mt-4 flex items-center flex-wrap gap-4">
        {options.map((item, idx) => {
          let w = width ? `${width}em` : '';
          return (
            <li key={idx} className={`flex-none inline-block}`} style={{ width: w }}>
              <label
                htmlFor={`${instId}_${idx}`}
                className={`flex items-center space-x-2 cursor-pointer`}
                style={{ userSelect: 'none' }}
              >
                <div className="relative">
                  <input
                    onChange={() => onChange(name, item)}
                    id={`${instId}_${idx}`}
                    type="radio"
                    name={`${instId}_group`}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-8 h-8 border-2 rounded-full peer-checked:ring ring-offset-2 ${colorMap[idx].ring}`}
                  ></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none peer-checked:block peer-checked:opacity-100 opacity-0 transition-opacity duration-0"
                  >
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M4.5 12.75l6 6 9-13.5"
                      stroke={colorMap[idx].base}
                    />
                  </svg>
                </div>
                <span className="inline-block font-medium pr-5">{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/*

original colors
    { bg: 'bg-[#2563EB]', ring: 'ring-[#2563EB]' },
    { bg: 'bg-[#8B5CF6]', ring: 'ring-[#8B5CF6]' },
    { bg: 'bg-[#DB2777]', ring: 'ring-[#DB2777]' },
    { bg: 'bg-[#475569]', ring: 'ring-[#475569]' },
    { bg: 'bg-[#EA580C]', ring: 'ring-[#EA580C]' },


    */
