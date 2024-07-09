type RadioButtonProps = {
  label: string;
};

export default ({ label, options }) => {
  if (!options) {
    options = ['Option 1', 'Option 2'];
  }

  const colors = [
    { bg: 'bg-pe-blue', ring: 'ring-pe-blue' },
    { bg: 'bg-[#777777]', ring: 'ring-[#777777]' },
    // { bg: 'bg-[#DB2777]', ring: 'ring-[#DB2777]' },
    // { bg: 'bg-[#475569]', ring: 'ring-[#475569]' },
    // { bg: 'bg-[#EA580C]', ring: 'ring-[#EA580C]' },
  ];

  const instId = `rg_${Math.random() * 1000000}`;
  return (
    <div className=" mx-auto px-4">
      <h2 className="text-gray-800 font-medium">{label}</h2>
      <ul className="mt-4 flex items-center flex-wrap gap-4">
        {colors.map((item, idx) => (
          /* Color box */
          <li key={idx} className="flex-none">
            <label htmlFor={`${instId}_${idx}`} className="block relative w-32 h-8" style={{ userSelect: 'none' }}>
              <input
                id={`${instId}_${idx}`}
                type="radio"
                // defaultChecked={idx == 1 ? true : false}
                name={`${instId}_group`}
                className="sr-only peer"
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                style={{ top: '.4em', left: '.6em' }}
                className="w-5 h-5 text-white absolute inset-0  z-0 pointer-events-none hidden peer-checked:block duration-150"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span
                className={`inline-flex  w-full h-full rounded-full peer-checked:ring ring-offset-2 cursor-pointer duration-150 ${item.bg} ${item.ring}`}
              >
                <div className={`text-white flex w-full h-full rounded-full text-center items-center justify-center`}>
                  &nbsp;&nbsp;{options[idx]}
                </div>
              </span>
            </label>
          </li>
        ))}
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
