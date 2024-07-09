export default () => {
  const colors = [
    { bg: '[#2563EB]', ring: 'ring-[#2563EB]' },
    { bg: '[#8B5CF6]', ring: 'ring-[#8B5CF6]' },
    { bg: '[#DB2777]', ring: 'ring-[#DB2777]' },
    { bg: '[#475569]', ring: 'ring-[#475569]' },
    { bg: '[#EA580C]', ring: 'ring-[#EA580C]' },
  ];

  return (
    <div className=" mx-auto px-4">
      <h2 className="text-gray-800 font-medium">Pick your favorite color</h2>
      <ul className="mt-4 flex items-center flex-wrap gap-4">
        {colors.map((item, idx) => (
          /* Color box */
          <li key={idx} className="flex-none">
            <label htmlFor={item.bg} className="block relative w-32 h-8" style={{ userSelect: 'none' }}>
              <input
                id={item.bg}
                type="radio"
                defaultChecked={idx == 1 ? true : false}
                name="color"
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
                className={`inline-flex w-full h-full rounded-full peer-checked:ring ring-offset-2 cursor-pointer duration-150 bg-${item.bg} ring-${item.bg} text-white`}
              >
                <div className={`flex w-full h-full rounded-full text-center items-center justify-center`}>
                  Option {idx}
                </div>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
