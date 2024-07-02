interface Prof {
  professorId: number;
  LName: string;
  FName: string;
  Subjects: string;
  EvaluationCount: number;
}

// declare PropTypes
interface TableComponentProps {
  schoolName: string;
  schoolId: number;
  professors: Prof[];
}

export default ({ schoolName, schoolId, professors }: TableComponentProps) => {
  return (
    <div className=" mt-12 mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">Professors</h3>
        </div>
      </div>
      <div className="mt-6 shadow-sm border overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Subjects</th>
              <th className="py-3 px-6">Total Evaluations</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {professors.map((item, idx) => {
              let link =
                `/professors/${schoolName}/${schoolId}/` + item.LName + '-' + item.FName + `/${item.professorId}`;

              return (
                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-yellow-50`}>
                  <td className="flex items-centerwhitespace-nowrap">
                    <a href={link} className=" py-3 px-5 block w-full h-full">
                      <div className="ml-2">
                        <span className="text-gray-700 font-medium">{item.LName}</span>,{' '}
                        <span className="text-gray-700">{item.FName}</span>
                      </div>
                    </a>
                  </td>
                  <td className="whitespace-nowrap">
                    <a href={link} className="px-6 py-4 block w-full h-full">
                      {item.Subjects.replaceAll(',', ', ')}
                    </a>
                  </td>
                  <td className="whitespace-nowrap">
                    <a href={link} className="px-6 py-4  block w-full h-full">
                      {item.EvaluationCount}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
