import React, { useState, useEffect } from 'react';

const SearchComponent = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState({ schoolResults: [], professorResults: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const fetchSearchResults = async (searchTerm) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchSearchResults(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      await fetchSearchResults(query);
      // Update URL without page reload
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="p-8 mt-12 flex flex-col items-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-bold">Search School or Professor</h2>
        </div>
        <form method="get" action="/search" onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="rounded-md">
            <input
              type="text"
              id="for_id"
              name="for"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 dark:focus:ring-gray-400 dark:focus:border-gray-400 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
              placeholder="professor name; school name or abbr"
              required
            />
          </div>
          <div>
            <input
              type="submit"
              value="Search"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            />
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="mt-4">Loading...</div>
      ) : (
        query && (
          <div className="mt-8 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Search Results for "{query}"</h2>
            {results.schoolResults.length > 0 && (
              <div className="mb-6">
                {results?.professorResults?.length > 0 && <h3 className="text-lg  mb-1 underline">Schools</h3>}
                <ul className="space-y-2">
                  {results.schoolResults.map((school) => (
                    <li key={school.ID}>
                      <a href={`/school/${school.Name}/${school.ID}`} className="text-blue-600 hover:underline">
                        {school.Name} ({school.abbr})
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.professorResults.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Professors</h3>
                <ul className="space-y-2">
                  {results.professorResults.map((professor) => (
                    <li key={professor.ID}>
                      <a
                        href={`/professors/school/${professor.schoolId}/${professor.fName}%20${professor.lName}/${professor.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {professor.lName}, {professor.fName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.schoolResults.length === 0 && results.professorResults.length === 0 && <p>No results found.</p>}
          </div>
        )
      )}
    </div>
  );
};

export default SearchComponent;
