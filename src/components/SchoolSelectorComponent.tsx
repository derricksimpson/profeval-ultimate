import { useEffect, useState } from 'react';
import { states, type State } from '~/data/states';
import type { School } from '~/models/School';

export type SchoolSelectorProps = {
  onSchoolChanged: (school: School) => void;
};

export default ({ onSchoolChanged }) => {
  const [state, setState] = useState<State>(null);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    state && fetchSchools(state.id);
  }, [state]);

  const fetchSchools = async (stateId) => {
    const response = await fetch(`/api/schools/?stateId=${stateId}`);
    const data = await response.json();
    setSchools(data);
  };

  const onStateChange = (event) => {
    const selectedState = states.find((s) => s.id == event.target.value);
    if (selectedState) {
      setState(selectedState);
    } else {
      setSchools(null);
    }
  };

  const onSchoolChange = (event) => {
    const selectedSchool = schools.find((s) => s.ID == event.target.value);
    if (selectedSchool) {
      onSchoolChanged(selectedSchool);
    }
  };

  return (
    <>
      <div className="mb-4 text-lg font-semibold">Choose your State and College</div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
        <div>
          <select
            onChange={onStateChange}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>Choose</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        {state && (
          <div className="col-span-1 md:col-span-2 ">
            <select
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={onSchoolChange}
            >
              <option>Choose</option>
              {schools.map((school) => (
                <option key={school.ID} value={school.ID}>
                  {school.Name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </>
  );
};
