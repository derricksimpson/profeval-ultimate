import { useState, useRef } from 'react';
import Downshift from 'downshift';
import type { Professor } from '~/models/Professor';
import type { CSSProperties } from 'react';
import type { EvaluationForm } from '~/models/EvaluationForm';

type Props = {
  schoolId: string;
  formData: EvaluationForm;
  setFormData: React.Dispatch<React.SetStateAction<EvaluationForm>>;
};

const ProfessorSelectComponent = ({ schoolId, formData, setFormData }: Props) => {
  const [suggestions, setSuggestions] = useState<Professor[]>([]);
  const cache = useRef<{ [letter: string]: Professor[] }>({});

  const handleInputChange = async (inputValue: string) => {
    if (inputValue.length >= 1) {
      const firstLetter = inputValue[0].toLowerCase();

      if (cache.current[firstLetter]) {
        const filteredSuggestions = cache.current[firstLetter].filter((professor) =>
          professor.lName.toLowerCase().startsWith(inputValue.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
      } else {
        try {
          const response = await fetch(`/api/professors-by-letter?schoolId=${schoolId}&letter=${firstLetter}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          cache.current[firstLetter] = data;

          const filteredSuggestions = data.filter((professor) =>
            professor.lName.toLowerCase().startsWith(inputValue.toLowerCase())
          );
          setSuggestions(filteredSuggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleProfessorSelected = (selectedItem: Professor | null) => {
    if (selectedItem) {
      setFormData({
        ...formData,
        firstName: selectedItem.fName,
        lastName: selectedItem.lName,
        professorId: selectedItem.id,
      });
    }
  };

  return (
    <Downshift
      onInputValueChange={handleInputChange}
      onSelect={handleProfessorSelected}
      itemToString={(item) => (item ? `${item.lName}, ${item.fName}` : '')}
    >
      {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
        <div style={{ position: 'relative' }}>
          <input
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            {...getInputProps({
              placeholder: 'Search by last name...',
              value: formData.lastName,
              onChange: (e) => {
                handleInputChange(e.target.value);
                setFormData((prevData) => ({ ...prevData, lastName: e.target.value }));
              },
              onBlur: () => {
                // No need to clear the first name field
              },
            })}
          />
          {isOpen && suggestions.length > 0 && (
            <div style={dropdownStyles as CSSProperties}>
              {suggestions.map((item, index) => (
                <div
                  {...getItemProps({
                    key: item.id,
                    index,
                    item,
                    style: {
                      ...itemStyles,
                      backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                      fontWeight: highlightedIndex === index ? 'bold' : 'normal',
                    } as CSSProperties,
                  })}
                >
                  {`${item.lName}, ${item.fName}`}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );
};

const dropdownStyles: CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  maxHeight: '200px',
  overflowY: 'auto',
  border: '1px solid #ccc',
  backgroundColor: 'white',
  zIndex: 1,
};

const itemStyles: CSSProperties = {
  padding: '8px 16px',
  cursor: 'pointer',
};

export default ProfessorSelectComponent;
