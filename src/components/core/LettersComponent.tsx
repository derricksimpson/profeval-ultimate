import { useState } from 'react';
import { letters } from '../../data/letters.ts';

// create prop interface
interface Props {
  schoolId: string;
  schoolName: string;
  activeLetter?: string;
}

export default ({ schoolId, schoolName, activeLetter }: Props) => {
  const [pages, setPages] = useState(letters);
  const [currentPage, setCurrentPage] = useState(activeLetter || 'A');

  let href = `/school/${schoolName}/${schoolId}/`;

  return (
    <div className="max-w-screen-xl mx-auto mt-2 px-4 text-gray-600 md:px-8">
      <div className="hidden justify-center lg:flex" aria-label="Pagination">
        <ul className="flex items-center">
          {pages.map((item, idx) => (
            <li key={item}>
              <a
                href={href + item}
                aria-current={currentPage == item ? 'page' : false}
                className={`h-10 px-4 py-2 border ${idx ? 'border-l-0' : ''} duration-150 hover:text-indigo-600 hover:bg-indigo-50 ${currentPage == item ? 'bg-indigo-50 text-indigo-600 font-medium' : ''}`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* On mobile version */}
      <div className="lg:hidden">
        <div className="flex flex-col">
          <ul className="flex flex-wrap justify-between mb-2">
            {pages
              .filter((p) => p < 'N')
              .map((item) => (
                <li key={item} className="mt-5">
                  <a
                    href={href + item}
                    aria-current={currentPage === item ? 'page' : undefined}
                    className={` h-10 px-4 py-3 border border-l-0 duration-150 hover:text-indigo-600 hover:bg-indigo-50 ${currentPage === item ? 'bg-indigo-50 text-indigo-600 font-medium' : ''}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
          </ul>
          <ul className="flex flex-wrap justify-between">
            {pages
              .filter((p) => p >= 'N')
              .map((item) => (
                <li key={item} className="mt-5">
                  <a
                    href={href + item}
                    aria-current={currentPage === item ? 'page' : undefined}
                    className={` h-10 px-4 py-3 border border-l-0 duration-150 hover:text-indigo-600 hover:bg-indigo-50 ${currentPage === item ? 'bg-indigo-50 text-indigo-600 font-medium' : ''}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
