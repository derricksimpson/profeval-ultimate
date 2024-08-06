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
  const [currentPage, setCurrentPage] = useState(activeLetter);

  let href = `/school/${schoolName}/${schoolId}/`;

  return (
    <div className="max-w-screen-xl mx-auto mt-2 px-4 text-gray-600 ">
      <div aria-label="Pagination">
        <ul className="hidden lg:inline-block">
          {pages.map((item, idx) => (
            <li key={item} className="inline-block">
              <a
                href={href + item}
                aria-current={currentPage == item ? 'page' : false}
                className={`inline-block w-7 h-7 text-center justify-center border ${idx ? 'border-l-0' : ''} duration-150  ${currentPage == item ? 'bg-gray-300 font-medium' : 'hover:bg-gray-100'}`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
