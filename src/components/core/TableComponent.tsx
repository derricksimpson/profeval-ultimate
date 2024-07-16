import type { Professor } from '~/models/Professor';

// declare PropTypes
interface TableComponentProps {
  schoolURL: string;
  schoolId: number;
  professors: Professor[];
}

export default ({ schoolURL: schoolName, schoolId, professors }: TableComponentProps) => {
  return (
    <div className="mt-12 mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold">Results</h3>
        </div>
      </div>
      <div className="mt-6 shadow-sm border overflow-x-auto">
        <table className="w-full table-auto  text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2 hidden sm:table-cell">Subjects</th>
              <th className="py-1 px-3">Total Evaluations</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y  text-lg md:text-base">
            {professors &&
              professors.map((item, idx) => {
                let link =
                  `/professors/${schoolName}/${schoolId}/` + item.lName + '-' + item.fName + `/${item.professorId}`;

                return (
                  <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-yellow-50`}>
                    <td className="flex items-center whitespace-nowrap">
                      <a href={link} className="px-1 py-2 block w-full h-full">
                        <div className="ml-1">
                          <span className="text-gray-700 font-medium">{item.lName}</span>,{' '}
                          <span className="text-gray-700">{item.fName}</span>
                        </div>
                        <div className="ml-2 block sm:hidden mt-1 text-gray-500 text-xs">
                          {item.subjects?.replaceAll(',', ', ')}
                        </div>
                      </a>
                    </td>
                    <td className="whitespace-nowrap hidden sm:table-cell">
                      <a href={link} className="px-1 py-2 block w-full h-full">
                        {item.subjects?.replaceAll(',', ', ')}
                      </a>
                    </td>
                    <td className="whitespace-nowrap">
                      <a href={link} className="px-1 py-2 block w-full h-full">
                        {item.evaluationCount}
                      </a>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
